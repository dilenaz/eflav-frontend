import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import OptimizedImage from '@/components/ui/OptimizedImage';
import SectionTitle from '@/components/ui/SectionTitle';
import { getHomepageNews } from '@/lib/services/news.service';

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function formatDate(value) {
  const date = value ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime())
    ? dateFormatter.format(date)
    : 'Tarih belirtilmedi';
}

function formatDateTime(value) {
  const date = value ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime())
    ? date.toISOString()
    : undefined;
}

function NewsImage({ news, priority = false, sizes }) {
  return (
    <OptimizedImage
      src={news.image_url}
      alt={news.image_alt || news.title}
      fill
      priority={priority}
      sizes={sizes}
      fallbackSrc="/images/logo/eflanilogo.png"
    />
  );
}

export default async function NewsSection({ texts = {} }) {
  let news = [];
  let hasError = false;

  try {
    news = await getHomepageNews(3);
  } catch {
    hasError = true;
    console.warn('Ana sayfa haberleri: veritabanına ulaşılamadı.');
  }

  const featuredNews =
    news.find((item) => Boolean(item.is_featured)) ?? news[0] ?? null;
  const sideNews = featuredNews
    ? news.filter((item) => item.id !== featuredNews.id)
    : [];

  return (
    <section className="border-b border-eflavSinir bg-eflavKrem py-20">
      <Container>
        <SectionTitle
          eyebrow={texts['home.news.eyebrow'] || 'Güncel Paylaşımlar'}
          title={texts['home.news.title'] || 'Vakıftan Haberler'}
          description={texts['home.news.description'] || 'Karabük Eflani Hayır Kervanı Vakfı tarafından gerçekleştirilen faaliyetler, duyurular ve güncel gelişmeleri takip edebilirsiniz.'}
        />

        {hasError ? (
          <Card hover={false}>
            <div
              role="status"
              className="rounded-2xl border border-eflavSinir bg-white p-6 text-center"
            >
              <h3 className="font-bold text-eflavAntrasit">
                Haberler şu anda görüntülenemiyor
              </h3>
              <p className="mt-2 text-sm text-eflavMetinAcik">
                Güncel haberlerimize kısa süre sonra yeniden ulaşabilirsiniz.
              </p>
            </div>
          </Card>
        ) : featuredNews ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <Card
              padding="none"
              className="group col-span-12 overflow-hidden lg:col-span-7"
            >
              <div className="relative h-72 md:h-96">
                <NewsImage
                  news={featuredNews}
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
                {Boolean(featuredNews.is_featured) && (
                  <span className="absolute left-4 top-4 rounded-lg bg-eflavBordo px-4 py-2 text-xs font-bold text-white">
                    Öne Çıkan
                  </span>
                )}
              </div>

              <div className="flex flex-col p-8">
                <time
                  dateTime={formatDateTime(featuredNews.published_at)}
                  className="mb-3 text-sm font-medium text-eflavMetinAcik"
                >
                  {formatDate(featuredNews.published_at)}
                </time>
                <h3 className="mb-4 text-3xl font-bold text-eflavAntrasit transition-colors group-hover:text-eflavBordo">
                  {featuredNews.title}
                </h3>
                <p className="mb-8 leading-8 text-eflavMetin">
                  {featuredNews.summary}
                </p>
                <Button
                  href={`/haberler/${featuredNews.slug}`}
                  variant="text"
                  className="self-start"
                >
                  Devamını Oku →
                </Button>
              </div>
            </Card>

            <div className="col-span-12 flex flex-col gap-6 lg:col-span-5">
              {sideNews.map((item) => (
                <Card key={item.id} padding="sm" className="group">
                  <div className="flex gap-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                      <NewsImage news={item} sizes="112px" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <time
                        dateTime={formatDateTime(item.published_at)}
                        className="mb-2 text-xs text-eflavMetinAcik"
                      >
                        {formatDate(item.published_at)}
                      </time>
                      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-eflavAntrasit transition-colors group-hover:text-eflavBordo">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 text-sm text-eflavMetinAcik">
                        {item.summary}
                      </p>
                      <Button
                        href={`/haberler/${item.slug}`}
                        variant="text"
                        size="sm"
                        className="mt-4 self-start"
                      >
                        Detaylar →
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card hover={false}>
            <div className="py-6 text-center">
              <h3 className="font-bold text-eflavAntrasit">
                Henüz yayımlanmış haber bulunmuyor
              </h3>
              <p className="mt-2 text-sm text-eflavMetinAcik">
                Vakfımızdan güncel gelişmeler burada paylaşılacaktır.
              </p>
            </div>
          </Card>
        )}
      </Container>
    </section>
  );
}
