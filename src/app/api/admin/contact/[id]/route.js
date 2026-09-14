import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAuthenticatedAdmin } from '@/lib/admin-session';
import { updateContactMessageStatus } from '@/lib/services/contact.service';
import { writeAuditLog } from '@/lib/services/audit.service';

const schema = z.object({ status: z.enum(['new', 'in_progress', 'resolved', 'spam']) });

export async function PATCH(request, { params }) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Yetkisiz işlem.' }, { status: 401 });
    }
    const { id } = await params;
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ success: false, message: 'Geçersiz kayıt.' }, { status: 400 });
    }
    const validation = schema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Geçersiz durum.' }, { status: 400 });
    }
    const updated = await updateContactMessageStatus(Number(id), validation.data.status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Mesaj bulunamadı.' }, { status: 404 });
    }
    await writeAuditLog({adminId:Number(admin.sub),action:'contact.status_changed',entityType:'contact_message',entityId:id,metadata:{status:validation.data.status}});
    return NextResponse.json({ success: true, message: 'Mesaj durumu güncellendi.' });
  } catch (error) {
    console.error('İletişim mesajı güncelleme hatası:', error);
    return NextResponse.json({ success: false, message: 'Mesaj güncellenemedi.' }, { status: 500 });
  }
}
