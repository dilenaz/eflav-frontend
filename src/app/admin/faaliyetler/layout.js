import { requireAdminPage } from '@/lib/admin-session';

export default async function ActivitiesAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
