import { requireAdminPage } from '@/lib/admin-session';

export default async function AuditAdminLayout({ children }) {
  await requireAdminPage(['admin']);
  return children;
}
