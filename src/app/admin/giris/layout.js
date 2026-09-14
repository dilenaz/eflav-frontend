import { redirect } from 'next/navigation';

import { getAuthenticatedAdmin } from '@/lib/admin-session';

export default async function AdminLoginLayout({ children }) {
  const admin = await getAuthenticatedAdmin();
  if (admin) redirect('/admin');
  return children;
}
