import { cache } from 'react';
import { notFound } from 'next/navigation';
import Container from '@/components/ui/Container';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { getContentPageBySlug } from '@/lib/services/content-page.service';
import { isDatabaseUnavailableError } from '@/lib/db';
import { getFallbackContentPage } from '@/data/fallback-content';

const allowed = new Set(['amac', 'misyon-vizyon', 'tarihce', 'yonetim-kurulu', 'tuzuk', 'seref-karakaya']);
const focusAreas = [
  ['Eğitim', 'Eğitimde fırsat eşitliğini güçlendiren çalışmalara katkı sunmak.'],
  ['Sosyal yardım', 'İhtiyaç sahibi birey ve ailelerin yaşam koşullarını iyileştirmek.'],
  ['Sağlık', 'İnsan hayatına dokunan sağlık ve yaşam desteği çalışmalarına katkı sunmak.'],
  ['Kültürel miras', 'Tarihî, kültürel ve manevi değerleri koruyarak yaşatmak.'],
  ['Toplumsal kalkınma', 'Yerel dayanışmayı sürdürülebilir ve kalıcı sosyal faydaya dönüştürmek.'],
];
const principles = [
  'Güven ve şeffaflık',
  'Dürüstlük ve hesap verebilirlik',
  'İnsan onuruna saygı',
  'Adalet ve eşitlik',
  'Gönüllülük ve dayanışma',
  'Sürdürülebilir sosyal fayda',
  'Yerel değerlere bağlılık, evrensel sorumluluk',
];
const founders = ['Şeref Karakaya', 'Hüseyin Öztürk', 'Yüksel Keleş', 'Yaşar Kılıç', 'Burhan Özdamar', 'Cihan Bodur', 'Necdet Ünal'];

const getPage = cache(async (slug) => {
  if (!allowed.has(slug)) return null;
  try {
    return await getContentPageBySlug(slug);
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return getFallbackContentPage(slug);
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = await getPage(slug);
  return item
    ? { title: item.title, description: item.summary, alternates: { canonical: `/hakkimizda/${slug}` } }
    : { title: 'Sayfa Bulunamadı', robots: { index: false, follow: false } };
}

function PageHeader({ item }) {
  return (
    <header className="relative overflow-hidden bg-eflavAntrasit py-16 text-white md:py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(201,155,69,.24),transparent_30%)]" />
      <Container className="relative">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-eflavAltin">{item.eyebrow || 'Kurumsal'}</p>
          <h1 className="mt-4 font-serif text-4xl font-black leading-tight md:text-6xl">{item.title}</h1>
          <p className="mt-6 max-w-3xl border-l-4 border-eflavAltin pl-5 text-lg leading-8 text-white/80">{item.summary}</p>
        </div>
      </Container>
    </header>
  );
}

function PurposePage({ item }) {
  const paragraphs = item.content.split(/\r?\n\s*\r?\n/).filter(Boolean);
  return (
    <>
      <PageHeader item={item} />
      <main className="bg-eflavKrem py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl space-y-5 text-lg leading-9 text-eflavMetin">
            {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          <section className="mt-14" aria-labelledby="faaliyet-alanlari">
            <h2 id="faaliyet-alanlari" className="text-center font-serif text-3xl font-black text-eflavAntrasit">Faaliyet Alanlarımız</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {focusAreas.map(([title, description], index) => (
                <article key={title} className="rounded-3xl border border-eflavSinir bg-white p-6 shadow-sm">
                  <span className="text-sm font-black text-eflavAltin">0{index + 1}</span>
                  <h3 className="mt-4 text-lg font-black text-eflavAntrasit">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-eflavMetinAcik">{description}</p>
                </article>
              ))}
            </div>
          </section>
        </Container>
      </main>
    </>
  );
}

function MissionVisionPage({ item }) {
  const paragraphs = item.content.split(/\r?\n\s*\r?\n/).filter(Boolean);
  const mission = paragraphs.slice(0, 2).map((p) => p.replace(/^Misyonumuz\s*/u, '')).join('\n\n');
  const vision = paragraphs.slice(2, 4).map((p) => p.replace(/^Vizyonumuz\s*/u, '')).join('\n\n');
  const message = paragraphs.find((p) => p.startsWith('Kurumsal Mesaj'))?.replace(/^Kurumsal Mesaj\s*/u, '');
  return (
    <>
      <PageHeader item={item} />
      <main className="bg-eflavKrem py-16 md:py-20">
        <Container>
          <div className="grid gap-7 lg:grid-cols-2">
            <article className="rounded-3xl border border-eflavSinir bg-white p-8 shadow-sm md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-eflavAltin">Bugünkü sorumluluğumuz</p>
              <h2 className="mt-3 font-serif text-3xl font-black text-eflavAntrasit">Misyonumuz</h2>
              <p className="mt-6 whitespace-pre-line leading-8 text-eflavMetinAcik">{mission}</p>
            </article>
            <article className="rounded-3xl bg-eflavBordo p-8 text-white shadow-xl md:p-10">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-eflavAltin">Gelecek hedefimiz</p>
              <h2 className="mt-3 font-serif text-3xl font-black">Vizyonumuz</h2>
              <p className="mt-6 whitespace-pre-line leading-8 text-white/80">{vision}</p>
            </article>
          </div>
          <section className="mt-14" aria-labelledby="ilkeler">
            <h2 id="ilkeler" className="text-center font-serif text-3xl font-black text-eflavAntrasit">Temel İlkelerimiz</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {principles.map((principle, index) => (
                <div key={principle} className="flex items-start gap-4 rounded-2xl border border-eflavSinir bg-white p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eflavAltin/20 text-sm font-black text-eflavBordo">{index + 1}</span>
                  <p className="pt-1 font-bold leading-6 text-eflavAntrasit">{principle}</p>
                </div>
              ))}
            </div>
          </section>
          {message && (
            <blockquote className="mt-14 rounded-[2rem] bg-eflavAntrasit px-8 py-12 text-center text-white shadow-xl md:px-14">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-eflavAltin">Kurumsal Mesaj</p>
              <p className="mx-auto mt-5 max-w-4xl font-serif text-xl font-bold leading-9 md:text-2xl">{message}</p>
            </blockquote>
          )}
        </Container>
      </main>
    </>
  );
}

function HistoryPage({ item }) {
  return (
    <>
      <PageHeader item={item} />
      <main className="bg-eflavKrem py-16 md:py-20">
        <Container>
          <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="rounded-3xl bg-eflavBordo p-8 text-white shadow-xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-eflavAltin">Kuruluş</p>
              <p className="mt-4 font-serif text-5xl font-black">11</p>
              <p className="mt-1 text-2xl font-black">Ekim 2023</p>
              <p className="mt-5 leading-7 text-white/75">Noter huzurunda düzenlenen vakıf senediyle kuruldu.</p>
            </aside>
            <article className="rounded-3xl border border-eflavSinir bg-white p-8 shadow-sm md:p-10">
              <h2 className="font-serif text-3xl font-black text-eflavAntrasit">Yedi kurucunun ortak iyilik yolculuğu</h2>
              <p className="mt-5 leading-8 text-eflavMetinAcik">Karabük Eflani Hayır Kervanı Vakfı, toplumsal dayanışmayı kurumsal ve sürdürülebilir bir yapıya dönüştürmek amacıyla yedi kurucu tarafından hayata geçirilmiştir.</p>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {founders.map((founder) => <li key={founder} className="rounded-xl bg-eflavKrem px-4 py-3 font-bold text-eflavAntrasit">{founder}</li>)}
              </ul>
            </article>
          </div>
          <div className="mx-auto mt-8 grid max-w-5xl gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-eflavSinir bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-eflavBordo">Resmî merkez</p>
              <p className="mt-3 font-bold text-eflavAntrasit">Gebze / Kocaeli</p>
            </article>
            <article className="rounded-2xl border border-eflavSinir bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-eflavBordo">Faaliyet odağı</p>
              <p className="mt-3 font-bold text-eflavAntrasit">Başta Eflani / Karabük olmak üzere ihtiyaç hâlinde Türkiye geneli</p>
            </article>
          </div>
        </Container>
      </main>
    </>
  );
}

function BoardPage({ item }) {
  const members = item.members || [];
  const advisors = members.filter((member) => member.role_title.toLocaleLowerCase('tr-TR').includes('avukat'));
  const board = members.filter((member) => !advisors.includes(member));
  const cards = (list) => (
    <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((member, index) => (
        <article key={member.id} className="overflow-hidden rounded-3xl border border-eflavSinir bg-white shadow-sm">
          <div className="relative aspect-[4/5] bg-eflavKrem">
            <OptimizedImage src={member.image_url} alt={member.image_alt || member.full_name} fill priority={index < 2} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" imageClassName="object-cover object-top" />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-black text-eflavAntrasit">{member.full_name}</h3>
            <p className="mt-2 text-sm font-bold uppercase tracking-wide text-eflavBordo">{member.role_title}</p>
          </div>
        </article>
      ))}
    </div>
  );
  return (
    <>
      <PageHeader item={item} />
      <main className="bg-eflavKrem py-16 md:py-20">
        <Container>
          <section aria-labelledby="yonetim">
            <h2 id="yonetim" className="font-serif text-3xl font-black text-eflavAntrasit">Yönetim Kadromuz</h2>
            {cards(board)}
          </section>
          {advisors.length > 0 && (
            <section className="mt-16 border-t border-eflavSinir pt-12" aria-labelledby="danismanlik">
              <h2 id="danismanlik" className="font-serif text-3xl font-black text-eflavAntrasit">Hukuk Danışmanlığı</h2>
              {cards(advisors)}
            </section>
          )}
        </Container>
      </main>
    </>
  );
}

function DeedPage({ item }) {
  const paragraphs = item.content.split(/\r?\n\s*\r?\n/).filter(Boolean);
  return (
    <>
      <PageHeader item={item} />
      <main className="bg-eflavKrem py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border border-eflavSinir bg-white p-8 shadow-sm md:p-12">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-eflavKrem p-5"><p className="text-xs font-bold uppercase tracking-wider text-eflavBordo">Resmî ad</p><p className="mt-2 font-black text-eflavAntrasit">Karabük Eflani Hayır Kervanı Vakfı</p></div>
              <div className="rounded-2xl bg-eflavKrem p-5"><p className="text-xs font-bold uppercase tracking-wider text-eflavBordo">Senetteki merkez</p><p className="mt-2 font-black text-eflavAntrasit">Pelitli Mah., Mollafenari Cad. No:86, Gebze/Kocaeli</p></div>
            </div>
            <div className="mt-8 space-y-5 leading-8 text-eflavMetinAcik">
              {paragraphs.slice(1).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}

function PresidentPage({ item }) {
  const paragraphs = item.content.split(/\r?\n\s*\r?\n/).filter(Boolean);
  return (
    <>
      <PageHeader item={item} />
      <main className="bg-eflavKrem py-16 md:py-20">
        <Container>
          <article className="mx-auto grid max-w-5xl gap-10 rounded-3xl border border-eflavSinir bg-white p-8 shadow-sm md:p-12 lg:grid-cols-[320px_1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-eflavKrem">
              <OptimizedImage src={item.image_url} alt={item.image_alt || 'Şeref Karakaya'} fill sizes="320px" fallbackSrc="/images/logo/eflanilogo.png" imageClassName="object-cover object-top" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-eflavAltin">Yönetim Kurulu Başkanı</p>
              <h2 className="mt-3 font-serif text-3xl font-black text-eflavAntrasit">Şeref Karakaya</h2>
              <div className="mt-7 space-y-5 border-t border-eflavSinir pt-7 leading-8 text-eflavMetinAcik">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>
          </article>
        </Container>
      </main>
    </>
  );
}

export default async function Page({ params }) {
  const { slug } = await params;
  const item = await getPage(slug);
  if (!item) notFound();

  if (slug === 'amac') return <PurposePage item={item} />;
  if (slug === 'misyon-vizyon') return <MissionVisionPage item={item} />;
  if (slug === 'tarihce') return <HistoryPage item={item} />;
  if (slug === 'yonetim-kurulu') return <BoardPage item={item} />;
  if (slug === 'tuzuk') return <DeedPage item={item} />;
  return <PresidentPage item={item} />;
}
