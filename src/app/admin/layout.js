import LogoutButton from '@/components/admin/LogoutButton';
import Container from '@/components/ui/Container';
import Link from 'next/link';
import { getAuthenticatedAdmin } from '@/lib/admin-session';

// Admin pages depend on the incoming session and live database state.
// Keep them out of the build-time prerender pass.
export const dynamic = 'force-dynamic';

export const metadata = {
  title: { absolute: 'Yönetim Paneli | Karabük Eflani Hayır Kervanı Vakfı' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const admin = await getAuthenticatedAdmin();
  const navigation = admin ? [
    ['Genel Bakış', '/admin'],
    ['Bağışlar', '/admin/bagislar'],
    ['Başvurular', '/admin/basvurular'],
    ['Haberler', '/admin/haberler'],
    ['Faaliyetler', '/admin/faaliyetler'],
    ['Galeri', '/admin/galeri'],
    ['İletişim', '/admin/iletisim'],
    ['Kurumsal', '/admin/kurumsal-sayfalar'],
    ['Parola', '/admin/parola'],
    ...(admin.role === 'admin' ? [['Denetim', '/admin/denetim-kaydi']] : []),
  ] : [];

  return (
    <main className="min-h-screen bg-slate-100">
      {admin && <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100">
          <Container>
            <div className="flex min-h-16 items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <Link href="/admin" className="block truncate text-base font-black text-eflavAntrasit sm:text-xl">
                  Karabük Eflani Hayır Kervanı Vakfı
                </Link>
                <p className="truncate text-xs text-eflavMetinAcik">{admin.fullName} · Yönetim Paneli</p>
              </div>
              <LogoutButton />
            </div>
          </Container>
        </div>
        <nav aria-label="Yönetim paneli" className="overflow-x-auto">
          <Container>
            <div className="flex min-w-max gap-1 py-2">
              {navigation.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-eflavKrem hover:text-eflavBordo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavBordo">
                  {label}
                </Link>
              ))}
            </div>
          </Container>
        </nav>
      </header>}
      <Container><div className="py-10">{children}</div></Container>
    </main>
  );
}
