import { requireAdminPage } from '@/lib/admin-session';

export default async function GalleryAdminLayout({ children }) {
  await requireAdminPage();
  return children;
}
