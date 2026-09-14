import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getDashboardStats } from '@/lib/services/admin-records.service';
import { requireAdminPage } from '@/lib/admin-session';

const numberFormatter = new Intl.NumberFormat('tr-TR');
const currencyFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

export default async function AdminDashboard() {
  await requireAdminPage();
  const stats = await getDashboardStats();
  const dashboardItems = [
    {
      title: 'Bağışlar',
      value: numberFormatter.format(Number(stats.donations.total)),
      description: `${stats.donations.paid_count || 0} tamamlanan · ${currencyFormatter.format(Number(stats.donations.paid_amount))}`,
      href: '/admin/bagislar',
    },
    {
      title: 'Başvurular',
      value: numberFormatter.format(Number(stats.applications.total)),
      description: `${stats.applications.pending || 0} değerlendirme bekliyor`,
      href: '/admin/basvurular',
    },
    {
      title: 'Haberler',
      value: numberFormatter.format(Number(stats.news.total)),
      description: `${stats.news.published || 0} haber yayında`,
      href: '/admin/haberler',
    },
    {
      title: 'İletişim',
      value: numberFormatter.format(Number(stats.contact.total)),
      description: `${stats.contact.new_count || 0} yeni mesaj`,
      href: '/admin/iletisim',
    },
    {
      title: 'Faaliyetler',
      value: numberFormatter.format(Number(stats.activities.total)),
      description: `${stats.activities.published || 0} faaliyet yayında`,
      href: '/admin/faaliyetler',
    },
    {
      title: 'Galeri',
      value: numberFormatter.format(Number(stats.gallery.total)),
      description: `${stats.gallery.published || 0} albüm yayında`,
      href: '/admin/galeri',
    },
  ];

  return (
    <section aria-labelledby="admin-dashboard-title">
      <div className="mb-8">
        <h1 id="admin-dashboard-title" className="text-3xl font-black text-eflavAntrasit">
          Yönetim Paneli
        </h1>
        <p className="mt-2 text-eflavMetinAcik">
          Vakıf içeriklerini ve kayıtlarını güncel verilerle yönetin.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {dashboardItems.map((item) => (
          <Card key={item.href} hover={false} className="flex h-full flex-col">
            <h2 className="text-lg font-bold text-eflavAntrasit">{item.title}</h2>
            <p className="mt-4 text-4xl font-black text-eflavBordo">{item.value}</p>
            <p className="mt-2 flex-1 text-sm text-eflavMetinAcik">{item.description}</p>
            <Button href={item.href} variant="outline" size="sm" className="mt-6 w-full">
              Yönet
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}
