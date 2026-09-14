import { NextResponse } from 'next/server';
import { requireAdminRole } from '@/lib/admin-session';
import { parseJsonBody, validateRequestOrigin } from '@/lib/api-security';
import { writeAuditLog } from '@/lib/services/audit.service';
import { updateSiteTexts } from '@/lib/services/site-text.service';
import { siteTextsSchema } from '@/lib/validations/site-text.schema';

export async function PATCH(request) {
  try {
    if (!validateRequestOrigin(request)) return NextResponse.json({ success:false, message:'Geçersiz istek kaynağı.' }, { status:403 });
    const admin = await requireAdminRole(['admin', 'editor']);
    if (!admin) return NextResponse.json({ success:false, message:'Yetkisiz işlem.' }, { status:401 });
    const validation = siteTextsSchema.safeParse(await parseJsonBody(request, 80_000));
    if (!validation.success) return NextResponse.json({ success:false, message:'Metin alanlarını kontrol edin.', errors:validation.error.flatten().fieldErrors }, { status:400 });
    await updateSiteTexts(validation.data.items, Number(admin.sub));
    await writeAuditLog({ adminId:Number(admin.sub), action:'site_texts.updated', entityType:'site_texts', metadata:{ keys:validation.data.items.map((item) => item.key) } });
    return NextResponse.json({ success:true, message:'Site metinleri güncellendi.' });
  } catch (error) {
    console.error('Site metinleri güncelleme hatası:', error);
    return NextResponse.json({ success:false, message:'Site metinleri güncellenemedi.' }, { status:500 });
  }
}
