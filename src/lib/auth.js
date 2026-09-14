import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET ortam değişkeni tanımlı değil.');
}

if (process.env.NODE_ENV === 'production' && JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET production ortamında en az 32 karakter olmalı.');
}

export const ADMIN_COOKIE_NAME = 'eflav_admin_session';

export function createAdminToken(admin) {
  return jwt.sign(
    {
      sub: String(admin.id),
      role: admin.role,
      sessionVersion: Number(admin.session_version),
    },
    JWT_SECRET,
    {
      expiresIn: '8h',
      issuer: 'karabuk-eflani-hayir-vakfi',
      audience: 'eflav-admin-panel',
      algorithm: 'HS256',
    }
  );
}

export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'karabuk-eflani-hayir-vakfi',
      audience: 'eflav-admin-panel',
      algorithms: ['HS256'],
    });
  } catch {
    return null;
  }
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    priority: 'high',
    path: '/',
    maxAge: 60 * 60 * 8,
  };
}
