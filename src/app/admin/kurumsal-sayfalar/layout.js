import { requireAdminPage } from '@/lib/admin-session';

export default async function ContentPagesAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
