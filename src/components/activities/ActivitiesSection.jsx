import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import OptimizedImage from '@/components/ui/OptimizedImage';
import SectionTitle from '@/components/ui/SectionTitle';
import { toDateOnly } from '@/lib/date-only';
import { getPublishedActivities } from '@/lib/services/activity.service';

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default async function ActivitiesSection({ texts = {} }) {
  let items = [];
  try {
    items = await getPublishedActivities(3);
  } catch {
    console.warn('Faaliyetler: veritabanına ulaşılamadı.');
  }

  if (!items.length) return null;

  return (
    <section className="border-y border-eflavSinir bg-eflavKrem py-20 md:py-24">
      <Container>
        <SectionTitle
          eyebrow={texts['home.activities.eyebrow'] || 'Doğrulanmış Çalışmalar'}
          title={texts['home.activities.title'] || 'Faaliyetlerimiz'}
          description={texts['home.activities.description'] || 'Vakfımızın gerçekleştirdiği ve kamuya açık kaynaklarla doğrulanabilen faaliyetleri inceleyin.'}
        />
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} padding="none" className="group overflow-hidden">
              <div className="relative aspect-[16/10] bg-white">
                <OptimizedImage
                  src={item.image_url}
                  alt={item.image_alt || item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="/images/logo/eflanilogo.png"
                  imageClassName="object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <time dateTime={toDateOnly(item.activity_date)} className="text-sm font-bold text-eflavBordo">
                    {dateFormatter.format(new Date(item.activity_date))}
                  </time>
                  {item.source_label && <span className="text-xs font-semibold text-eflavMetinAcik">{item.source_label}</span>}
                </div>
                <h3 className="mt-4 text-2xl font-black text-eflavAntrasit">{item.title}</h3>
                <p className="mt-3 line-clamp-3 leading-7 text-eflavMetinAcik">{item.summary}</p>
                <Button href={`/faaliyetler/${item.slug}`} variant="text" className="mt-6">Faaliyeti incele →</Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/faaliyetler" variant="outline">Tüm faaliyetleri görüntüle</Button>
        </div>
      </Container>
    </section>
  );
}
