import { requireAdminPage } from '@/lib/admin-session';

export default async function ContactAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
