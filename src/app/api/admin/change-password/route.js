import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAuthenticatedAdmin } from '@/lib/admin-session';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeAuditLog } from '@/lib/services/audit.service';

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  newPassword: z.string()
    .min(12, 'Yeni parola en az 12 karakter olmalıdır.')
    .max(128)
    .regex(/[a-z]/, 'En az bir küçük harf içermelidir.')
    .regex(/[A-Z]/, 'En az bir büyük harf içermelidir.')
    .regex(/[0-9]/, 'En az bir rakam içermelidir.')
    .regex(/[^a-zA-Z0-9]/, 'En az bir özel karakter içermelidir.'),
}).refine((data) => data.currentPassword !== data.newPassword, {
  path: ['newPassword'], message: 'Yeni parola mevcut paroladan farklı olmalıdır.',
});

export async function POST(request) {
  try {
    const adminToken = await getAuthenticatedAdmin();
    if (!adminToken) {
      return NextResponse.json({ success: false, message: 'Yetkisiz işlem.' }, { status: 401 });
    }
    const validation = schema.safeParse(await request.json());
    if (!validation.success) {
      return NextResponse.json({ success: false, message: 'Parola bilgileri geçersiz.', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    const [rows] = await db.execute(
      'SELECT password_hash, is_active FROM admins WHERE id=? LIMIT 1',
      [Number(adminToken.sub)]
    );
    const admin = rows[0];
    if (!admin || Number(admin.is_active) !== 1) {
      return NextResponse.json({ success: false, message: 'Yönetici hesabı kullanılamıyor.' }, { status: 403 });
    }
    const matches = await bcrypt.compare(validation.data.currentPassword, admin.password_hash);
    if (!matches) {
      return NextResponse.json({ success: false, message: 'Mevcut parola hatalı.' }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(validation.data.newPassword, 12);
    await db.execute(
      'UPDATE admins SET password_hash=?, session_version=session_version+1 WHERE id=?',
      [passwordHash, Number(adminToken.sub)]
    );
    await writeAuditLog({ adminId:Number(adminToken.sub), action:'password.changed', entityType:'admin', entityId:adminToken.sub });
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return NextResponse.json({ success: true, message: 'Parolanız değiştirildi. Yeniden giriş yapınız.' });
  } catch (error) {
    console.error('Admin parola değiştirme hatası:', error);
    return NextResponse.json({ success: false, message: 'Parola değiştirilemedi.' }, { status: 500 });
  }
}
