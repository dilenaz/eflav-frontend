import { NextResponse } from 'next/server';

import { db, isDatabaseUnavailableError } from '@/lib/db';
import { ApiRequestError, enforceRateLimit, parseJsonBody, validateRequestOrigin } from '@/lib/api-security';
import { encryptPersonalData, hashIdentityNumber } from '@/lib/personal-data';
import { applicationSchema } from '@/lib/validations/application.schema';
import { verifyCaptcha } from '@/lib/bot-protection';
import { sendAdminNotification } from '@/lib/notification';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    if (!validateRequestOrigin(request)) return NextResponse.json({ success:false, message:'Geçersiz istek kaynağı.' }, { status:403 });
    await enforceRateLimit(request, 'applications', 5, 3600);
    const body = await parseJsonBody(request, 12_000);
    await verifyCaptcha(request, body.captchaToken);
    const validation = applicationSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: 'Başvuru bilgileri geçersiz.',
        errors: validation.error.flatten().fieldErrors,
      }, { status: 400 });
    }

    const data = validation.data;
    const identityHash = hashIdentityNumber(data.tcIdentityNumber);
    const [result] = await db.execute(`
      INSERT INTO applications (
        application_type, full_name, tc_identity_number, tc_identity_hash,
        phone, email, settlement_type, settlement_name, university_name,
        department_name, request_detail, kvkk_approved, application_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'pending')
    `, [
      data.applicationType,
      data.fullName,
      encryptPersonalData(data.tcIdentityNumber),
      identityHash,
      data.phone,
      data.email || null,
      data.settlementType,
      data.settlementName,
      data.universityName || null,
      data.departmentName || null,
      data.requestDetail,
    ]);

    await sendAdminNotification('application.created', { id:result.insertId, type:data.applicationType, trackingNumber:`EFL-${new Date().getFullYear()}-${String(result.insertId).padStart(6, '0')}` });
    return NextResponse.json({
      success: true,
      message: 'Başvurunuz başarıyla alındı.',
      trackingNumber: `EFL-${new Date().getFullYear()}-${String(result.insertId).padStart(6, '0')}`,
    }, { status: 201 });
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      console.warn('Başvuru formu: veritabanına ulaşılamadı.');
      return NextResponse.json({ success:false, message:'Başvuru sistemi geçici olarak kullanılamıyor. Lütfen daha sonra yeniden deneyin.' }, { status:503, headers:{'Retry-After':'30'} });
    }
    console.error('Başvuru kayıt hatası:', error);
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, message: 'Bu başvuru türü için mevcut bir kaydınız bulunuyor.' }, { status: 409 });
    }
    if (error instanceof ApiRequestError) {
      return NextResponse.json({ success:false, message:error.message }, { status:error.status, headers:error.retryAfter?{'Retry-After':String(error.retryAfter)}:undefined });
    }
    return NextResponse.json({ success: false, message: 'Başvuru şu anda kaydedilemiyor.' }, { status: 500 });
  }
}
