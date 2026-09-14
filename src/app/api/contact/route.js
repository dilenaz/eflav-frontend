import { NextResponse } from 'next/server';

import { createContactMessage } from '@/lib/services/contact.service';
import { ApiRequestError, enforceRateLimit, parseJsonBody, validateRequestOrigin } from '@/lib/api-security';
import { contactSchema } from '@/lib/validations/contact.schema';
import { verifyCaptcha } from '@/lib/bot-protection';
import { sendAdminNotification } from '@/lib/notification';
import { isDatabaseUnavailableError } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    if (!validateRequestOrigin(request)) return NextResponse.json({ success:false, message:'Geçersiz istek kaynağı.' }, { status:403 });
    await enforceRateLimit(request, 'contact', 5, 3600);
    const body = await parseJsonBody(request, 8_000);
    await verifyCaptcha(request, body.captchaToken);
    const validation = contactSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: 'İletişim bilgileri geçersiz.',
        errors: validation.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const id = await createContactMessage(validation.data);
    await sendAdminNotification('contact.created', { id, subject:validation.data.subject, referenceNumber:`MSG-${String(id).padStart(6, '0')}` });
    return NextResponse.json({
      success: true,
      message: 'Mesajınız başarıyla iletildi.',
      referenceNumber: `MSG-${String(id).padStart(6, '0')}`,
    }, { status: 201 });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.warn('İletişim formu: veritabanına ulaşılamadı.');
      return NextResponse.json({ success:false, message:'İletişim formu geçici olarak kullanılamıyor. Lütfen daha sonra yeniden deneyin.' }, { status:503, headers:{'Retry-After':'30'} });
    }
    console.error('İletişim mesajı kayıt hatası:', error);
    if (error instanceof ApiRequestError) {
      return NextResponse.json({ success:false, message:error.message }, { status:error.status, headers:error.retryAfter?{'Retry-After':String(error.retryAfter)}:undefined });
    }
    return NextResponse.json({ success: false, message: 'Mesaj şu anda iletilemiyor.' }, { status: 500 });
  }
}
