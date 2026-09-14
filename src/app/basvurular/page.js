import Link from 'next/link';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Başvurular',
  description: 'Karabük Eflani Hayır Kervanı Vakfı sosyal destek ve gönüllülük başvuru bilgileri.',
  alternates: { canonical: '/basvurular' },
};

const applicationTypes = [
  {
    title: 'Sosyal Destek Başvurusu',
    description: 'İhtiyaç sahiplerinin destek talepleri gizlilik, adalet ve insan onuruna saygı ilkeleriyle değerlendirilir.',
    status: 'Bilgi alın',
    href: '/iletisim',
    action: 'Bizimle iletişime geçin',
  },
  {
    title: 'Vakıf Gönüllülüğü',
    description: 'Vakfın eğitim, sosyal yardım, kültür ve saha çalışmalarına gönüllü katkı sunabilirsiniz.',
    status: 'Başvuru formu',
    href: '/basvurular/gonullu-ol',
    action: 'Gönüllü olun',
  },
];

export default function BasvurularPage() {
  return (
    <main className="min-h-[75vh] bg-eflavKrem py-16">
      <Container>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-eflavAltin">Dayanışmaya Katılın</p>
          <h1 className="mt-3 font-serif text-4xl font-black text-eflavAntrasit md:text-5xl">Başvuru Merkezi</h1>
          <p className="mt-5 leading-8 text-eflavMetinAcik">
            Sosyal destek talepleri insan onuruna saygı ve gizlilik ilkeleriyle değerlendirilir. Gönüllülük başvuruları bu sayfa üzerinden iletilebilir.
          </p>
        </header>
        <div className="mx-auto mt-12 grid max-w-4xl gap-7 md:grid-cols-2">
          {applicationTypes.map((item, index) => (
            <article key={item.title} className="flex flex-col rounded-3xl border border-eflavSinir bg-white p-7 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-black text-eflavAltin">0{index + 1}</span>
                <span className="rounded-full bg-eflavKrem px-3 py-1 text-xs font-bold text-eflavBordo">{item.status}</span>
              </div>
              <h2 className="mt-6 text-2xl font-black text-eflavAntrasit">{item.title}</h2>
              <p className="mt-4 flex-1 leading-7 text-eflavMetinAcik">{item.description}</p>
              <Link href={item.href} className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-eflavBordo px-5 py-3 text-sm font-bold text-white transition hover:bg-eflavBordoKoyu">
                {item.action}
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
