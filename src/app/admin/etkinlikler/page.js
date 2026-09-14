import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { toDateOnly } from '@/lib/date-only';
import { getAllEvents } from '@/lib/services/event.service';

const statusLabels = { draft:'Taslak', published:'Yayında', archived:'Arşivlendi' };
const dateFormatter = new Intl.DateTimeFormat('tr-TR', { dateStyle:'medium', timeZone:'Europe/Istanbul' });
function formatDate(value) { const dateOnly=toDateOnly(value); return dateOnly ? dateFormatter.format(new Date(`${dateOnly}T12:00:00+03:00`)) : '—'; }

export default async function EventsAdminPage() {
  const events = await getAllEvents();
  return <section aria-labelledby="events-admin-title">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 id="events-admin-title" className="text-3xl font-black text-eflavAntrasit">Etkinlikler</h1><p className="mt-2 text-eflavMetinAcik">Etkinlik takvimini yönetin.</p></div><Button href="/admin/etkinlikler/yeni">Yeni Etkinlik</Button></div>
    <Card padding="none" hover={false} className="mt-8 overflow-hidden"><div className="overflow-x-auto"><table className="min-w-full"><caption className="sr-only">Etkinlik kayıtları</caption><thead className="bg-eflavKrem"><tr>{['Başlık','Tarih','Konum','Durum','İşlem'].map((title)=><th key={title} scope="col" className="px-5 py-4 text-left text-sm font-bold">{title}</th>)}</tr></thead><tbody className="divide-y divide-eflavSinir">{events.map((item)=><tr key={item.id}><td className="px-5 py-4 font-semibold">{item.title}</td><td className="whitespace-nowrap px-5 py-4">{formatDate(item.event_date)}</td><td className="px-5 py-4">{item.location}</td><td className="whitespace-nowrap px-5 py-4">{statusLabels[item.status] || item.status}</td><td className="px-5 py-4"><Button href={`/admin/etkinlikler/${item.id}`} size="sm" variant="outline">Düzenle</Button></td></tr>)}{!events.length&&<tr><td colSpan={5} className="p-10 text-center text-eflavMetinAcik">Henüz etkinlik kaydı bulunmuyor.</td></tr>}</tbody></table></div></Card>
  </section>;
}
