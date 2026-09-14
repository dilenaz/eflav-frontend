import { permanentRedirect } from 'next/navigation';

export default async function EventsAdminLayout({ children }) {
  void children;
  permanentRedirect('/admin/faaliyetler');
}
