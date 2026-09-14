import { requireAdminPage } from '@/lib/admin-session';

export default async function ApplicationsAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
