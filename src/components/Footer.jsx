import Image from 'next/image';
import Link from 'next/link';

const quickLinks = [
  ['Hakkımızda', '/hakkimizda/amac'],
  ['Faaliyetler', '/faaliyetler'],
  ['Başvurular', '/basvurular'],
  ['Bağış Yap', '/bagis'],
  ['İletişim', '/iletisim'],
];

const legalLinks = [
  ['KVKK Aydınlatma Metni', '/kvkk'],
  ['Gizlilik Politikası', '/gizlilik-politikasi'],
];

export default function Footer({ year }) {
  return (
    <footer className="mt-0 bg-[#073d2c] text-white/70">
      <div className="h-1 bg-gradient-to-r from-transparent via-eflavAltin to-transparent" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.35fr_.7fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavAltin">
            <Image src="/images/logo/eflanilogo.png" alt="" width={70} height={70} className="rounded-full bg-white object-contain" />
            <span>
              <strong className="block font-serif text-lg uppercase leading-tight tracking-wide text-white">Karabük Eflani</strong>
              <span className="text-xs font-bold uppercase tracking-[.16em] text-eflavAltin">Hayır Kervanı Vakfı</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7">
            İnsana değer, topluma nefes ve geleceğe umut olmak için kalıcı sosyal fayda üretiyoruz.
          </p>
          <p className="mt-4 font-serif text-lg italic text-eflavAltin">İyilik yolunda birlikte...</p>
        </div>

        <nav aria-label="Hızlı bağlantılar">
          <h2 className="mb-5 text-xs font-black uppercase tracking-[.2em] text-eflavAltin">Hızlı Gezinti</h2>
          <ul className="space-y-3 text-sm">
            {quickLinks.map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-5 text-xs font-black uppercase tracking-[.2em] text-eflavAltin">İletişim</h2>
          <address className="space-y-3 text-sm not-italic leading-6">
            <p>Pelitli Mahallesi, Mollafenari Caddesi No:86<br />Gebze / Kocaeli</p>
            <a href="tel:+905453790306" className="block font-semibold text-white hover:text-eflavAltin">+90 545 379 03 06</a>
            <a href="mailto:karabukeflanivakfi@gmail.com" className="block break-all font-semibold text-white hover:text-eflavAltin">karabukeflanivakfi@gmail.com</a>
            <Link href="/iletisim" className="inline-block font-bold text-eflavAltin hover:text-white">İletişim formu →</Link>
          </address>
        </div>

        <div>
          <h2 className="mb-5 text-xs font-black uppercase tracking-[.2em] text-eflavAltin">Bağış Hesabı</h2>
          <p className="text-xs uppercase tracking-wider">Ziraat Bankası</p>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-white">TR66 0001 0026 2997 8393 0750 01</p>
          <div className="mt-5 flex flex-wrap gap-3 text-xs font-bold">
            <a href="https://www.instagram.com/karabukeflanivakfi/" target="_blank" rel="noopener noreferrer" className="text-eflavAltin hover:text-white">Instagram</a>
            <a href="https://www.facebook.com/people/Karab%C3%BCk-Eflani-Vakf%C4%B1/100089528226678/" target="_blank" rel="noopener noreferrer" className="text-eflavAltin hover:text-white">Facebook</a>
          </div>
          <ul className="mt-6 space-y-2 text-xs">
            {legalLinks.map(([label, href]) => (
              <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-[11px] text-white/45 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 md:flex-row md:justify-between">
            <p>© {year} Karabük Eflani Hayır Kervanı Vakfı. Tüm hakları saklıdır.</p>
            <p>Güven · Şeffaflık · Dayanışma</p>
          </div>
          <p className="mt-4 border-t border-white/10 pt-4">
            <a
              href="https://dilenazozdemir.com.tr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold tracking-wide text-white/65 transition hover:text-eflavAltin focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavAltin"
            >
              Designed &amp; Developed by Dilenaz Özdemir
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
