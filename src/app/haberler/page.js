import NewsList from '@/components/news/NewsList';
import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import { getPublishedNews } from '@/lib/services/news.service';
import { connection } from 'next/server';
import { isDatabaseUnavailableError } from '@/lib/db';

export const metadata = {
  title: 'Vakıftan Haberler',
  description:
    'Karabük Eflani Hayır Kervanı Vakfının duyurularını, faaliyet raporlarını ve güncel haberlerini inceleyin.',
  alternates: { canonical: '/haberler' },
};

export default async function NewsPage() {
  await connection();
  let unavailable = false;
  let rows = [];
  try {
    rows = await getPublishedNews();
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    unavailable = true;
    console.warn('Haberler: veritabanına ulaşılamadı.');
  }
  const news = rows.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    summary: item.summary,
    category: item.category,
    imageUrl: item.image_url,
    imageAlt: item.image_alt,
    publishedAt: new Date(item.published_at).toISOString(),
  }));

  return (
    <main className="min-h-[85vh] bg-eflavKrem py-12 md:py-16">
      <Container>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <SectionTitle
            title="Vakıftan Haberler"
            subtitle="Duyurular, Etkinlik Raporları ve Güncel Gelişmeler"
            titleAs="h1"
          />
        </div>
        {unavailable ? (
          <p role="status" className="rounded-2xl border border-eflavSinir bg-white p-6 text-center text-eflavMetinAcik">
            Haberler şu anda yüklenemiyor. Lütfen kısa süre sonra yeniden deneyin.
          </p>
        ) : <NewsList news={news} />}
      </Container>
    </main>
  );
}
