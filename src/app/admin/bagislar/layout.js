import { requireAdminPage } from '@/lib/admin-session';

export default async function DonationsAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
