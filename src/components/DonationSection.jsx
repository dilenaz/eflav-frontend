import Image from 'next/image';
import Link from 'next/link';

export default function DonationSection({ texts = {} }) {
  const iban = texts['donation.iban'] || 'TR66 0001 0026 2997 8393 0750 01';
  return (
    <section
      id="bagis"
      aria-labelledby="bagis-basligi"
      className="relative mx-4 my-16 max-w-7xl overflow-hidden rounded-[2rem] bg-eflavBordo px-6 py-10 text-white shadow-2xl shadow-eflavBordo/15 sm:mx-6 md:px-10 md:py-14 xl:mx-auto"
    >
      <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-[50px] border-eflavAltin/10" />
      <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-eflavAltin/10 blur-3xl" />
      <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-eflavAltin">{texts['donation.section.eyebrow'] || 'Bağış ve Dayanışma'}</p>
          <h2 id="bagis-basligi" className="mt-4 max-w-2xl font-serif text-3xl font-black leading-tight md:text-5xl">
            {texts['donation.section.title'] || 'İyiliğe güvenle ortak olun'}
          </h2>
          <p className="mt-5 max-w-2xl leading-8 text-white/75">
            {texts['donation.section.description'] || 'Desteğiniz; eğitim, sosyal yardım, kültürel miras ve toplumsal kalkınma çalışmalarımızın daha çok insana ulaşmasını sağlar.'}
          </p>
          <div className="mt-7 max-w-2xl rounded-2xl border border-white/15 bg-white/8 p-5">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-eflavAltin">{texts['donation.bank_name'] || 'Ziraat Bankası'} · IBAN</p>
            <p className="mt-3 break-words font-mono text-lg font-black tracking-wide text-white sm:text-xl">{iban}</p>
            <p className="mt-2 text-xs text-white/55">Hesap sahibi: {texts['donation.account_owner'] || 'Karabük Eflani Hayır Kervanı Vakfı'}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`mailto:karabukeflanivakfi@gmail.com?subject=Bağış hakkında bilgi`}
              className="rounded-full bg-white px-7 py-3.5 text-sm font-black text-eflavBordo transition hover:bg-eflavAltin hover:text-eflavAntrasit"
            >
              Bağış Bilgisi Alın
            </a>
            <Link href="/hakkimizda/amac" className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
              Amacımızı İnceleyin
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[360px] rounded-[1.75rem] bg-white p-4 text-center text-eflavAntrasit shadow-xl sm:p-5">
          <Image
            src="/images/donation/ziraat-iban-qr-ziraat.jpg"
            alt="Ziraat Bankası Karabük Eflani Hayır Kervanı Vakfı bağış hesabı QR kodu"
            width={894}
            height={1068}
            className="mx-auto h-auto w-full rounded-xl object-contain"
          />
          <p className="mt-4 text-xs font-black uppercase tracking-[.14em] text-eflavBordo">{texts['donation.qr_caption'] || 'Kameranızla okutarak bağış yapın'}</p>
        </div>
      </div>
    </section>
  );
}
