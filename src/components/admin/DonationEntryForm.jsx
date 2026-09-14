'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminRequest } from '@/lib/admin-api-client';

const initialState = {
  campaignId:'', donationType:'Genel Bağış', paymentPeriod:'tek_seferlik', amount:'',
  senderName:'', transferDate:'', dedicationName:'', isAnonymous:false,
  paymentStatus:'paid', paymentReference:'',
};

export default function DonationEntryForm({ campaigns }) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const field = (name) => ({ value:form[name], onChange:(event) => setForm((current) => ({ ...current, [name]:event.target.value })) });

  async function submit(event) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);
    try {
      const result = await adminRequest('/api/admin/donations', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ ...form, campaignId:form.campaignId ? Number(form.campaignId) : null, amount:Number(form.amount) }),
      }, 'Bağış kaydı eklenemedi.');
      setMessage(result.message);
      setForm(initialState);
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  const inputClass = 'mt-2 w-full rounded-xl border border-eflavSinir bg-white px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/15';
  return <form onSubmit={submit} className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
    <label className="text-sm font-bold">Gönderen adı<input {...field('senderName')} maxLength={150} className={inputClass} placeholder="Ad soyad veya kurum" /></label>
    <label className="text-sm font-bold">Bağış türü<input {...field('donationType')} required minLength={3} maxLength={150} className={inputClass} /></label>
    <label className="text-sm font-bold">Tutar (₺)<input {...field('amount')} required type="number" min="0.01" max="100000000" step="0.01" className={inputClass} /></label>
    <label className="text-sm font-bold">Transfer tarihi<input {...field('transferDate')} type="date" className={inputClass} /></label>
    <label className="text-sm font-bold">Ödeme durumu<select {...field('paymentStatus')} className={inputClass}><option value="paid">Ödendi</option><option value="pending">Bekliyor</option><option value="failed">Başarısız</option><option value="cancelled">İptal</option></select></label>
    <label className="text-sm font-bold">Ödeme periyodu<select {...field('paymentPeriod')} className={inputClass}><option value="tek_seferlik">Tek seferlik</option><option value="aylik_duzenli">Aylık düzenli</option></select></label>
    <label className="text-sm font-bold">Kampanya<select {...field('campaignId')} className={inputClass}><option value="">Kampanyaya bağlı değil</option>{campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}{campaign.status !== 'active' ? ' (pasif)' : ''}</option>)}</select></label>
    <label className="text-sm font-bold">İthaf edilen kişi<input {...field('dedicationName')} maxLength={150} className={inputClass} /></label>
    <label className="text-sm font-bold">Dekont / referans<input {...field('paymentReference')} maxLength={255} className={inputClass} /></label>
    <label className="flex items-center gap-3 text-sm font-bold md:col-span-2"><input type="checkbox" checked={form.isAnonymous} onChange={(event) => setForm((current) => ({ ...current, isAnonymous:event.target.checked }))} className="h-5 w-5 accent-eflavBordo" />Bağışı anonim olarak işaretle</label>
    <div className="flex flex-wrap items-center gap-4 md:col-span-2 xl:col-span-3">
      <button disabled={isSaving} className="rounded-xl bg-eflavBordo px-6 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Kaydediliyor…' : 'Bağışı Kaydet'}</button>
      {message && <p role="status" className="text-sm font-semibold text-eflavMetinAcik">{message}</p>}
    </div>
  </form>;
}
