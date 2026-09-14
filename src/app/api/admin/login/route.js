import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { db, isDatabaseUnavailableError } from '@/lib/db';
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  getAdminCookieOptions,
} from '@/lib/auth';
import {
  clearLoginFailures,
  createLoginIdentifier,
  getLoginLimit,
  recordLoginFailure,
} from '@/lib/services/login-security.service';
import { writeAuditLog } from '@/lib/services/audit.service';
import { ApiRequestError, enforceRateLimit, getClientIp, parseJsonBody, validateRequestOrigin } from '@/lib/api-security';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(6).max(128),
});

export async function POST(request) {
  try {
    if (!validateRequestOrigin(request)) {
      return NextResponse.json({ success: false, message: 'Geçersiz istek kaynağı.' }, { status: 403 });
    }
    await enforceRateLimit(request, 'admin-login-ip', 30, 900);
    const body = await parseJsonBody(request, 2_000);
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Geçersiz giriş bilgileri.',
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const ipAddress = getClientIp(request);
    const loginIdentifier = createLoginIdentifier(email, ipAddress);
    const loginLimit = await getLoginLimit(loginIdentifier);

    if (loginLimit.blocked) {
      return NextResponse.json(
        { success: false, message: 'Çok fazla başarısız deneme. Lütfen 15 dakika sonra tekrar deneyin.' },
        { status: 429, headers: { 'Retry-After': '900' } }
      );
    }

    const [rows] = await db.execute(
      `
        SELECT
          id,
          full_name,
          email,
          password_hash,
          role,
          is_active,
          session_version
        FROM admins
        WHERE email = ?
        LIMIT 1
      `,
      [email]
    );

    const admin = rows[0];

    if (!admin) {
      await recordLoginFailure(loginIdentifier);
      return NextResponse.json(
        {
          success: false,
          message: 'E-posta veya şifre hatalı.',
        },
        { status: 401 }
      );
    }

    if (Number(admin.is_active) !== 1) {
      await recordLoginFailure(loginIdentifier);
      return NextResponse.json(
        {
          success: false,
          message: 'Bu yönetici hesabı pasif durumdadır.',
        },
        { status: 403 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!passwordMatches) {
      await recordLoginFailure(loginIdentifier);
      return NextResponse.json(
        {
          success: false,
          message: 'E-posta veya şifre hatalı.',
        },
        { status: 401 }
      );
    }

    const token = createAdminToken(admin);
    await clearLoginFailures(loginIdentifier);
    await writeAuditLog({ adminId:admin.id, action:'login.success', entityType:'admin', entityId:admin.id });
    const cookieStore = await cookies();

    cookieStore.set(
      ADMIN_COOKIE_NAME,
      token,
      getAdminCookieOptions()
    );

    return NextResponse.json({
      success: true,
      message: 'Giriş başarılı.',
      admin: {
        id: admin.id,
        fullName: admin.full_name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    if (error instanceof ApiRequestError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status, headers: error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : undefined }
      );
    }
    if (isDatabaseUnavailableError(error)) {
      console.warn('Admin giriş API: veritabanına ulaşılamadı.');
      return NextResponse.json(
        {
          success: false,
          message: 'Veritabanı bağlantısı kullanılamıyor. Lütfen MySQL hizmetini başlatıp tekrar deneyin.',
        },
        { status: 503, headers: { 'Retry-After': '30' } }
      );
    }

    console.error('Admin giriş API hatası:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Sunucu hatası oluştu.',
      },
      { status: 500 }
    );
  }
}
