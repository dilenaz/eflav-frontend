import StatusForm from '@/components/admin/StatusForm';
import DonationEntryForm from '@/components/admin/DonationEntryForm';
import Card from '@/components/ui/Card';
import { getDonationCampaigns, getDonations } from '@/lib/services/admin-records.service';

const statusOptions = [
  { value: 'pending', label: 'Bekliyor' },
  { value: 'paid', label: 'Ödendi' },
  { value: 'failed', label: 'Başarısız' },
  { value: 'cancelled', label: 'İptal' },
];
const dateFormatter = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' });
const currencyFormatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' });

export default async function AdminDonationsPage() {
  const [donations, campaigns] = await Promise.all([getDonations(), getDonationCampaigns()]);

  return (
    <section aria-labelledby="donations-title">
      <h1 id="donations-title" className="text-3xl font-black text-eflavAntrasit">Bağışlar</h1>
      <p className="mt-2 text-eflavMetinAcik">Banka hareketlerinden doğruladığınız bağışları elle kaydedin ve ödeme durumlarını yönetin.</p>
      <Card hover={false} className="mt-8">
        <h2 className="text-xl font-black text-eflavAntrasit">Yeni Bağış Kaydı</h2>
        <p className="mt-2 text-sm text-eflavMetinAcik">Dekont veya banka hareketiyle doğruladığınız bilgileri girin. Ödendi olarak kaydedilen kampanyalı bağışlar kampanya toplamına otomatik eklenir.</p>
        <DonationEntryForm campaigns={campaigns} />
      </Card>
      <h2 className="mt-10 text-xl font-black text-eflavAntrasit">Kayıtlı Bağışlar</h2>
      <Card padding="none" hover={false} className="mt-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <caption className="sr-only">Bağış kayıtları</caption>
            <thead className="bg-eflavKrem"><tr>
              {['Gönderen', 'Bağış Türü', 'Tutar', 'Periyot', 'Transfer', 'İthaf', 'Kayıt', 'Durum'].map((title) => (
                <th key={title} scope="col" className="px-5 py-4 text-left text-sm font-bold">{title}</th>
              ))}
            </tr></thead>
            <tbody className="divide-y divide-eflavSinir">
              {donations.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4 font-semibold">{item.sender_name || '—'}</td>
                  <td className="px-5 py-4 font-semibold">{item.donation_type}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-bold">{currencyFormatter.format(Number(item.amount))}</td>
                  <td className="px-5 py-4 text-sm">{item.payment_period === 'aylik_duzenli' ? 'Aylık' : 'Tek Seferlik'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm">{item.transfer_date ? dateFormatter.format(new Date(item.transfer_date)) : '—'}</td>
                  <td className="px-5 py-4 text-sm">{item.is_anonymous ? 'Anonim' : item.dedication_name || '—'}</td>
                  <td className="whitespace-nowrap px-5 py-4 text-sm">{dateFormatter.format(new Date(item.created_at))}</td>
                  <td className="px-5 py-4"><StatusForm endpoint={`/api/admin/donations/${item.id}`} initialStatus={item.payment_status} options={statusOptions} label={`${item.id} numaralı bağış durumu`} /></td>
                </tr>
              ))}
              {donations.length === 0 && <tr><td colSpan={8} className="px-6 py-12 text-center text-eflavMetinAcik">Henüz bağış kaydı bulunmuyor.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}
