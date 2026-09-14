import { requireAdminPage } from '@/lib/admin-session';

export default async function NewsAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
