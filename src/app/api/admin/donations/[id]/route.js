import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAuthenticatedAdmin } from '@/lib/admin-session';
import { updateDonationStatus } from '@/lib/services/admin-records.service';
import { writeAuditLog } from '@/lib/services/audit.service';

export const runtime = 'nodejs';
const schema = z.object({ status: z.enum(['pending', 'paid', 'failed', 'cancelled']) });

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
    const updated = await updateDonationStatus(Number(id), validation.data.status);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Bağış bulunamadı.' }, { status: 404 });
    }
    await writeAuditLog({adminId:Number(admin.sub),action:'donation.status_changed',entityType:'donation',entityId:id,metadata:{status:validation.data.status}});
    return NextResponse.json({ success: true, message: 'Bağış güncellendi.' });
  } catch (error) {
    console.error('Bağış güncelleme hatası:', error);
    return NextResponse.json({ success: false, message: 'Bağış güncellenemedi.' }, { status: 500 });
  }
}
