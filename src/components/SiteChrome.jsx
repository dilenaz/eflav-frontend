'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function SiteChrome({ children, year }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin) return children;

  return (
    <>
      <a
        href="#ana-icerik"
        className="fixed left-4 top-3 z-[60] -translate-y-24 rounded-full bg-white px-4 py-3 font-bold text-eflavBordo shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-eflavAltin"
      >
        Ana içeriğe geç
      </a>
      <Navbar />
      <div id="ana-icerik" className="pt-20" tabIndex={-1}>{children}</div>
      <Footer year={year} />
    </>
  );
}
