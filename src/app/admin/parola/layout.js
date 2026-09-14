import { requireAdminPage } from '@/lib/admin-session';

export default async function PasswordAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
