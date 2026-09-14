import { NextResponse } from 'next/server';
import { requireAdminRole } from '@/lib/admin-session';
import { parseJsonBody, validateRequestOrigin } from '@/lib/api-security';
import { createDonation } from '@/lib/services/admin-records.service';
import { writeAuditLog } from '@/lib/services/audit.service';
import { adminDonationSchema } from '@/lib/validations/admin-donation.schema';

export async function POST(request) {
  try {
    if (!validateRequestOrigin(request)) return NextResponse.json({ success:false, message:'Geçersiz istek kaynağı.' }, { status:403 });
    const admin = await requireAdminRole(['admin', 'editor']);
    if (!admin) return NextResponse.json({ success:false, message:'Yetkisiz işlem.' }, { status:401 });
    const validation = adminDonationSchema.safeParse(await parseJsonBody(request, 12_000));
    if (!validation.success) return NextResponse.json({ success:false, message:'Bağış bilgilerini kontrol edin.', errors:validation.error.flatten().fieldErrors }, { status:400 });
    const id = await createDonation(validation.data);
    await writeAuditLog({ adminId:Number(admin.sub), action:'donation.created_manually', entityType:'donation', entityId:id, metadata:{ amount:validation.data.amount, status:validation.data.paymentStatus } });
    return NextResponse.json({ success:true, data:{ id }, message:'Bağış kaydı eklendi.' }, { status:201 });
  } catch (error) {
    console.error('Elle bağış kaydı hatası:', error);
    return NextResponse.json({ success:false, message:error.message === 'Seçilen kampanya bulunamadı.' ? error.message : 'Bağış kaydı eklenemedi.' }, { status:500 });
  }
}
