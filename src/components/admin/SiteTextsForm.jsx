'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminRequest } from '@/lib/admin-api-client';

export default function SiteTextsForm({ initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const groups = [...new Set(items.map((item) => item.group_name))];

  function updateValue(key, value) {
    setItems((current) => current.map((item) => item.text_key === key ? { ...item, value } : item));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setIsSaving(true);
    try {
      const result = await adminRequest('/api/admin/site-texts', {
        method:'PATCH',
        headers:{ 'Content-Type':'application/json' },
        body:JSON.stringify({ items:items.map((item) => ({ key:item.text_key, value:item.value })) }),
      }, 'Site metinleri kaydedilemedi.');
      setMessage(result.message);
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return <form onSubmit={handleSubmit} className="mt-6 space-y-7">
    {groups.map((group) => <fieldset key={group} className="rounded-2xl border border-eflavSinir bg-white p-5">
      <legend className="px-2 text-lg font-black text-eflavAntrasit">{group}</legend>
      <div className="mt-2 grid gap-5 md:grid-cols-2">
        {items.filter((item) => item.group_name === group).map((item) => <label key={item.text_key} className={item.input_type === 'textarea' ? 'md:col-span-2' : ''}>
          <span className="mb-2 block text-sm font-bold text-eflavAntrasit">{item.label}</span>
          {item.input_type === 'textarea'
            ? <textarea required rows={3} maxLength={2000} value={item.value} onChange={(event) => updateValue(item.text_key, event.target.value)} className="w-full rounded-xl border border-eflavSinir px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/15" />
            : <input required maxLength={2000} value={item.value} onChange={(event) => updateValue(item.text_key, event.target.value)} className="w-full rounded-xl border border-eflavSinir px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/15" />}
        </label>)}
      </div>
    </fieldset>)}
    <div className="flex flex-wrap items-center gap-4">
      <button disabled={isSaving} className="rounded-xl bg-eflavBordo px-6 py-3 font-bold text-white disabled:opacity-60">{isSaving ? 'Kaydediliyor…' : 'Tüm Metinleri Kaydet'}</button>
      {message && <p role="status" className="text-sm font-semibold text-eflavMetinAcik">{message}</p>}
    </div>
  </form>;
}
