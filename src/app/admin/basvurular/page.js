import StatusForm from '@/components/admin/StatusForm';
import Card from '@/components/ui/Card';
import { getApplications } from '@/lib/services/admin-records.service';

const statusOptions = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'approved', label: 'Onaylandı' },
  { value: 'rejected', label: 'Reddedildi' },
];
const dateFormatter = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' });

export default async function AdminApplicationsPage() {
  const applications = await getApplications();

  return (
    <section aria-labelledby="applications-title">
      <h1 id="applications-title" className="text-3xl font-black text-eflavAntrasit">Başvurular</h1>
      <p className="mt-2 text-eflavMetinAcik">Sosyal yardım başvurularını değerlendirin. Önceki dönemlere ait farklı başvuru kayıtları yalnız arşiv amacıyla görüntülenebilir.</p>
      <Card padding="none" hover={false} className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <caption className="sr-only">Başvuru kayıtları</caption>
            <thead className="bg-eflavKrem"><tr>
              {['Başvuru Sahibi', 'Tür', 'İletişim / Yerleşim', 'Kimlik', 'Detay', 'Tarih', 'Durum'].map((title) => (
                <th key={title} scope="col" className="px-5 py-4 text-left text-sm font-bold">{title}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-eflavSinir">
              {applications.map((item) => (
                <tr key={item.id} className="align-top">
                  <td className="px-5 py-4 font-semibold">{item.full_name}</td>
                  <td className="px-5 py-4">{item.application_type === 'yardim' ? 'Sosyal Yardım' : 'Arşiv Kaydı'}</td>
                  <td className="px-5 py-4 text-sm"><div>{item.phone}</div>{item.email && <div className="mt-1">{item.email}</div>}<div className="mt-1 text-eflavMetinAcik">{item.settlement_name}</div></td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-sm">{item.masked_identity_number}</td>
                  <td className="max-w-72 px-5 py-4 text-sm text-eflavMetinAcik">{item.university_name || item.request_detail || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm">{dateFormatter.format(new Date(item.created_at))}</td>
                  <td className="px-5 py-4"><StatusForm endpoint={`/api/admin/applications/${item.id}`} initialStatus={item.application_status} options={statusOptions} label={`${item.full_name} başvuru durumu`} /></td>
                </tr>
              ))}
              {applications.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-eflavMetinAcik">Henüz başvuru bulunmuyor.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
