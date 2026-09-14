import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth';
import { db, isDatabaseUnavailableError } from '@/lib/db';

export async function getAuthenticatedAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  const payload = token ? verifyAdminToken(token) : null;
  if (!payload?.sub) return null;
  let rows;
  try {
    [rows] = await db.execute('SELECT id,email,full_name,role,is_active,session_version FROM admins WHERE id=? LIMIT 1',[Number(payload.sub)]);
  } catch (error) {
    if (isDatabaseUnavailableError(error)) return null;
    throw error;
  }
  const admin=rows[0];
  if (
    !admin ||
    Number(admin.is_active) !== 1 ||
    Number(payload.sessionVersion) !== Number(admin.session_version)
  ) return null;
  return { ...payload, sub:String(admin.id), email:admin.email, fullName:admin.full_name, role:admin.role };
}

export async function requireAdminRole(roles=['admin']) {
  const admin=await getAuthenticatedAdmin();
  return admin && roles.includes(admin.role) ? admin : null;
}

export async function requireAdminPage(roles = ['admin', 'editor']) {
  const admin = await requireAdminRole(roles);
  if (!admin) redirect('/admin/giris?reason=session-invalid');
  return admin;
}
