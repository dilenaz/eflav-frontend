'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import OptimizedImage from '@/components/ui/OptimizedImage';

const mainLinks = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/faaliyetler', label: 'Faaliyetler' },
  { href: '/fotograf-albumu', label: 'Fotoğraf Albümü' },
  { href: '/haberler', label: 'Haberler' },
  { href: '/basvurular', label: 'Başvurular' },
  { href: '/iletisim', label: 'İletişim' },
];

const aboutLinks = [
  { href: '/hakkimizda/amac', label: 'Vakıf Amacı' },
  { href: '/hakkimizda/misyon-vizyon', label: 'Misyon ve Vizyon' },
  { href: '/hakkimizda/tarihce', label: 'Tarihçe' },
  { href: '/hakkimizda/tuzuk', label: 'Vakıf Senedi' },
  { href: '/hakkimizda/yonetim-kurulu', label: 'Yönetim Kurulu' },
];

export default function Navbar() {
  const pathname = usePathname();
  const navRef = useRef(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key === 'Escape') {
        setIsAboutOpen(false);
        setIsMobileOpen(false);
      }
    }
    function closeOutside(event) {
      if (!navRef.current?.contains(event.target)) {
        setIsAboutOpen(false);
        setIsMobileOpen(false);
      }
    }
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOutside);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOutside);
    };
  }, []);

  const isActive = (href) => pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));
  const linkClass = (href) =>
    `relative rounded-lg px-2 py-3 text-[13px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavAltin ${
      isActive(href)
        ? 'text-eflavAltin after:absolute after:inset-x-2 after:bottom-1 after:h-0.5 after:bg-eflavAltin'
        : 'text-eflavAntrasit hover:text-eflavBordo'
    }`;

  return (
    <nav
      ref={navRef}
      aria-label="Ana navigasyon"
      className="fixed inset-x-0 top-0 z-50 border-b border-eflavSinir/80 bg-[#fbfaf6]/95 shadow-[0_5px_24px_rgba(15,81,59,.08)] backdrop-blur-xl"
      onClick={(event) => {
        if (event.target.closest('a')) {
          setIsAboutOpen(false);
          setIsMobileOpen(false);
        }
      }}
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link href="/" className="group flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavAltin">
            <OptimizedImage
              src="/images/logo/eflanilogo.png"
              alt="Karabük Eflani Hayır Kervanı Vakfı logosu"
              width={62}
              height={62}
              imageClassName="object-contain"
              className="shrink-0 rounded-full bg-white shadow-sm"
            />
            <span className="min-w-0">
              <span className="block max-w-[250px] font-serif text-sm font-black uppercase leading-[1.1] tracking-[.05em] text-eflavAntrasit sm:text-base">
                Karabük Eflani
              </span>
              <span className="block text-[10px] font-extrabold uppercase tracking-[.15em] text-eflavAltin">
                Hayır Kervanı Vakfı
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 min-[1700px]:flex min-[1850px]:gap-1">
            <Link href="/" className={linkClass('/')}>Ana Sayfa</Link>
            <div className="relative">
              <button
                type="button"
                className={linkClass('/hakkimizda')}
                aria-expanded={isAboutOpen}
                aria-controls="desktop-about-menu"
                onClick={() => setIsAboutOpen((open) => !open)}
              >
                Hakkımızda <span aria-hidden="true">⌄</span>
              </button>
              {isAboutOpen && (
                <div id="desktop-about-menu" className="absolute left-0 top-full mt-2 w-60 rounded-2xl border border-eflavSinir bg-white p-2 shadow-2xl">
                  {aboutLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="block rounded-xl px-4 py-3 text-sm font-semibold text-eflavAntrasit hover:bg-eflavKrem hover:text-eflavBordo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavAltin">
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {mainLinks.slice(1).map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(link.href)}>{link.label}</Link>
            ))}
            <Link href="/bagis" className="ml-2 rounded-full bg-eflavBordo px-5 py-3 text-xs font-black tracking-wide text-white shadow-md shadow-eflavBordo/15 hover:bg-eflavBordoKoyu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavAltin">
              BAĞIŞ YAP
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-eflavBordo/20 text-2xl text-eflavBordo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavAltin min-[1700px]:hidden"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            onClick={() => setIsMobileOpen((open) => !open)}
          >
            {isMobileOpen ? '×' : '☰'}
          </button>
        </div>

        {isMobileOpen && (
          <div id="mobile-menu" className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-eflavSinir py-4 min-[1700px]:hidden">
            <div className="grid gap-1">
              {mainLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive(link.href) ? 'bg-eflavKrem text-eflavBordo' : 'text-eflavAntrasit hover:bg-eflavKrem'}`}>
                  {link.label}
                </Link>
              ))}
            </div>
            <details className="mt-2 rounded-xl border border-eflavSinir text-eflavAntrasit">
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">Hakkımızda</summary>
              <div className="grid border-t border-eflavSinir p-2">
                {aboutLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="rounded-lg px-4 py-2.5 text-sm hover:bg-eflavKrem">{link.label}</Link>
                ))}
              </div>
            </details>
            <Link href="/bagis" className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-eflavBordo px-5 py-3 text-sm font-bold text-white">
              BAĞIŞ YAP
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
