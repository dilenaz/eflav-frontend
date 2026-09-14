import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getAllActivities } from '@/lib/services/activity.service';

const statusLabels = { draft:'Taslak', published:'Yayında', archived:'Arşivlendi' };

export default async function ActivitiesAdminPage() {
  const items = await getAllActivities();
  return <section aria-labelledby="activities-admin-title">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div><h1 id="activities-admin-title" className="text-3xl font-black">Faaliyetler</h1><p className="mt-2 text-eflavMetinAcik">Faaliyet arşivini ve yayın sırasını yönetin.</p></div>
      <Button href="/admin/faaliyetler/yeni">Yeni Faaliyet</Button>
    </div>
    <div className="mt-8 grid gap-4">
      {items.map((item) => <Card key={item.id} hover={false} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="font-bold">{item.title}</h2><p className="mt-1 text-sm text-eflavMetinAcik">{statusLabels[item.status] || item.status} · Sıra {item.sort_order}</p></div>
        <Button href={`/admin/faaliyetler/${item.id}`} variant="outline" size="sm">Düzenle</Button>
      </Card>)}
      {!items.length && <Card hover={false} className="text-center text-eflavMetinAcik">Henüz faaliyet kaydı bulunmuyor.</Card>}
    </div>
  </section>;
}
