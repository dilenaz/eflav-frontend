import StatusForm from '@/components/admin/StatusForm';
import Card from '@/components/ui/Card';
import { getContactMessages } from '@/lib/services/contact.service';

const statusOptions = [
  { value: 'new', label: 'Yeni' },
  { value: 'in_progress', label: 'İşlemde' },
  { value: 'resolved', label: 'Yanıtlandı' },
  { value: 'spam', label: 'Spam' },
];
const dateFormatter = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short' });

export default async function AdminContactPage() {
  const messages = await getContactMessages();
  return (
    <section aria-labelledby="contact-messages-title">
      <h1 id="contact-messages-title" className="text-3xl font-black text-eflavAntrasit">İletişim Mesajları</h1>
      <p className="mt-2 text-eflavMetinAcik">Web sitesinden iletilen mesajları takip edin.</p>
      <div className="mt-8 space-y-5">
        {messages.map((item) => (
          <Card key={item.id} hover={false}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-bold text-eflavAntrasit">{item.subject}</h2>
                  <time className="text-xs text-eflavMetinAcik" dateTime={new Date(item.created_at).toISOString()}>{dateFormatter.format(new Date(item.created_at))}</time>
                </div>
                <p className="mt-2 text-sm"><span className="font-semibold">{item.full_name}</span> · <a href={`mailto:${item.email}`} className="text-eflavBordo underline">{item.email}</a></p>
                <p className="mt-4 whitespace-pre-line leading-7 text-eflavMetin">{item.message}</p>
              </div>
              <StatusForm endpoint={`/api/admin/contact/${item.id}`} initialStatus={item.status} options={statusOptions} label={`${item.subject} mesaj durumu`} />
            </div>
          </Card>
        ))}
        {messages.length === 0 && <Card hover={false} className="text-center text-eflavMetinAcik">Henüz iletişim mesajı bulunmuyor.</Card>}
      </div>
    </section>
  );
}
