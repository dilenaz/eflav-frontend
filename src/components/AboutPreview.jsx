import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/ui/Container';

const areas = [
  ['Eğitim', 'Eğitimde fırsat eşitliğini güçlendiren çalışmalara katkı sunmak.'],
  ['Sosyal Destek', 'İhtiyaç sahibi birey ve ailelerin yanında olmak.'],
  ['Sağlık', 'Sağlık ve yaşam koşullarını iyileştiren çalışmaları desteklemek.'],
  ['Kültürel Miras', 'Tarihî, kültürel ve manevi değerleri gelecek nesillere taşımak.'],
  ['Toplumsal Kalkınma', 'Yerel dayanışmayı kalıcı sosyal faydaya dönüştürmek.'],
];

function getCorporateMessage(content) {
  const message = content.split(/Kurumsal Mesaj\s*/i)[1]?.trim();
  return message?.replace(/^[“\"]|[”\"]$/g, '') || '';
}

export default function AboutPreview({ page }) {
  if (!page) return null;

  const paragraphs = page.content
    .split(/\r?\n\s*\r?\n/)
    .filter(Boolean)
    .filter((paragraph) => !paragraph.startsWith('Kurumsal Mesaj'));
  const corporateMessage = getCorporateMessage(page.content);

  return (
    <section className="bg-white py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="absolute -inset-4 rounded-[2rem] bg-eflavAltin/10" />
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem] border border-eflavSinir bg-eflavKrem p-12 shadow-xl">
              <div className="relative h-full max-h-72 w-full max-w-72">
                <Image
                  src="/images/logo/eflanilogo.png"
                  alt="Karabük Eflani Hayır Kervanı Vakfı logosu"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-eflavAltin">{page.eyebrow || 'Vakfımız Hakkında'}</p>
            <h2 className="mt-3 font-serif text-3xl font-black text-eflavAntrasit md:text-5xl">
              {page.title}
            </h2>
            <p className="mt-6 text-lg font-semibold leading-8 text-eflavAntrasit">{page.summary}</p>
            <div className="mt-5 space-y-4 text-base leading-8 text-eflavMetinAcik">
              {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/hakkimizda/tarihce" className="rounded-xl bg-eflavBordo px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-eflavBordoKoyu">
                Tarihçemizi Okuyun
              </Link>
              <Link href="/hakkimizda/yonetim-kurulu" className="rounded-xl border-2 border-eflavBordo px-6 py-3 text-sm font-bold text-eflavBordo transition hover:bg-eflavKrem">
                Kadromuzu Tanıyın
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {areas.map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-eflavSinir bg-eflavKrem p-5">
              <div className="h-1.5 w-12 rounded-full bg-eflavAltin" />
              <h3 className="mt-4 font-black text-eflavAntrasit">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-eflavMetinAcik">{description}</p>
            </article>
          ))}
        </div>

        {corporateMessage && <blockquote className="relative mt-14 overflow-hidden rounded-[2rem] bg-eflavAntrasit px-7 py-10 text-center text-white shadow-xl md:px-14 md:py-14">
          <span className="absolute -left-4 -top-10 font-serif text-[12rem] leading-none text-eflavAltin/10" aria-hidden="true">“</span>
          <p className="relative text-xs font-bold uppercase tracking-[0.24em] text-eflavAltin">Kurumsal Mesaj</p>
          <p className="relative mx-auto mt-5 max-w-4xl font-serif text-xl font-bold leading-9 md:text-2xl md:leading-10">
            “{corporateMessage}”
          </p>
        </blockquote>}
      </Container>
    </section>
  );
}
