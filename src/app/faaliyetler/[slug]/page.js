import { cache } from 'react';
import { notFound } from 'next/navigation';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import OptimizedImage from '@/components/ui/OptimizedImage';
import DataUnavailable from '@/components/ui/DataUnavailable';
import { toDateOnly } from '@/lib/date-only';
import { getActivityBySlug } from '@/lib/services/activity.service';
import { isDatabaseUnavailableError } from '@/lib/db';

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const getItem = cache(async (slug) => {
  try {
    return { item: await getActivityBySlug(slug, true), unavailable: false };
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return { item: null, unavailable: true };
  }
});

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { item, unavailable } = await getItem(slug);
  if (unavailable) return { title: 'Faaliyetler Geçici Olarak Kullanılamıyor', robots: { index: false } };
  return item
    ? { title: item.title, description: item.summary, alternates: { canonical: `/faaliyetler/${item.slug}` } }
    : { title: 'Faaliyet Bulunamadı', robots: { index: false } };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const { item, unavailable } = await getItem(slug);
  if (unavailable) return <DataUnavailable title="Faaliyet geçici olarak kullanılamıyor" backHref="/faaliyetler" backLabel="Faaliyetlere Dön" />;
  if (!item) notFound();

  return (
    <main className="min-h-screen bg-eflavKrem py-16">
      <Container>
        <Button href="/faaliyetler" variant="ghost" className="mb-8">← Faaliyetlere Dön</Button>
        <article className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-eflavSinir bg-white shadow-sm">
          <div className="relative h-80 md:h-[520px]">
            <OptimizedImage
              src={item.image_url}
              alt={item.image_alt || item.title}
              fill
              priority
              fallbackSrc="/images/logo/eflanilogo.png"
              imageClassName="object-cover"
            />
          </div>
          <div className="p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-3xl" aria-hidden="true">{item.icon}</span>
              <time className="rounded-full bg-eflavKrem px-4 py-2 text-sm font-bold text-eflavBordo" dateTime={toDateOnly(item.activity_date)}>
                {dateFormatter.format(new Date(item.activity_date))}
              </time>
            </div>
            <h1 className="mt-6 font-serif text-4xl font-black text-eflavAntrasit md:text-5xl">{item.title}</h1>
            <p className="mt-7 text-lg font-semibold leading-8 text-eflavMetin">{item.summary}</p>
            <div className="mt-10 whitespace-pre-line border-t border-eflavSinir pt-10 leading-8 text-eflavMetinAcik">{item.content}</div>
            {item.source_url && (
              <aside className="mt-10 rounded-2xl border border-eflavAltin/30 bg-eflavAltin/10 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-eflavBordo">Kaynak ve doğrulama</p>
                <a
                  href={item.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex font-bold text-eflavAntrasit underline decoration-eflavAltin decoration-2 underline-offset-4 hover:text-eflavBordo"
                >
                  {item.source_label || 'Kaynak paylaşımı'} ↗
                </a>
              </aside>
            )}
          </div>
        </article>
      </Container>
    </main>
  );
}
