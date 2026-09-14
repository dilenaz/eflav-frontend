import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Container from '@/components/ui/Container';
import OptimizedImage from '@/components/ui/OptimizedImage';
import SectionTitle from '@/components/ui/SectionTitle';
import { toDateOnly } from '@/lib/date-only';
import { getPublishedActivities } from '@/lib/services/activity.service';
import { connection } from 'next/server';
import { isDatabaseUnavailableError } from '@/lib/db';

export const metadata = { title: 'Faaliyet Arşivi', description: 'Karabük Eflani Hayır Kervanı Vakfının geçmiş faaliyetleri ve tamamlanan çalışmaları.', alternates: { canonical: '/faaliyetler' } };
const dateFormatter = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export default async function Page() {
  await connection();
  let unavailable = false;
  let items = [];
  try {
    items = await getPublishedActivities();
  } catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    unavailable = true;
    console.warn('Faaliyetler: veritabanına ulaşılamadı.');
  }
  return <main className="min-h-screen bg-eflavKrem py-16"><Container>
    <SectionTitle eyebrow="Geçmişten Bugüne" title="Faaliyet Arşivi" subtitle="Vakfımızın tamamlanan çalışmalarını tarih sırasıyla inceleyin." titleAs="h1" />
    {unavailable ? <p role="status" className="mt-10 rounded-2xl border border-eflavSinir bg-white p-6 text-center text-eflavMetinAcik">Faaliyetler şu anda yüklenemiyor. Lütfen kısa süre sonra yeniden deneyin.</p> : <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">{items.map((item) => <Card key={item.id} padding="none" className="overflow-hidden">
      <div className="relative aspect-[16/10] bg-white"><OptimizedImage src={item.image_url} alt={item.image_alt || item.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fallbackSrc="/images/logo/eflanilogo.png" imageClassName="object-cover object-center" /></div>
      <div className="p-6"><time dateTime={toDateOnly(item.activity_date)} className="text-sm font-semibold text-eflavBordo">{dateFormatter.format(new Date(item.activity_date))}</time>
      <h2 className="mt-4 text-2xl font-bold">{item.title}</h2><p className="mt-3 text-eflavMetinAcik">{item.summary}</p>
      <Button href={`/faaliyetler/${item.slug}`} variant="text" className="mt-5">Faaliyeti incele →</Button></div>
    </Card>)}</div>}
  </Container></main>;
}
