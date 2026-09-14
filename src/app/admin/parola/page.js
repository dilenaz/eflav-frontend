'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { adminRequest } from '@/lib/admin-api-client';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmation: '' });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event) {
    event.preventDefault(); setMessage(''); setErrors({});
    if (form.newPassword !== form.confirmation) { setErrors({ confirmation: ['Yeni parolalar eşleşmiyor.'] }); return; }
    setIsSubmitting(true);
    try {
      await adminRequest('/api/admin/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) }, 'Parola değiştirilemedi.');
      router.replace('/admin/giris'); router.refresh();
    } catch (error) { setMessage(error.message); setErrors(error.errors || {}); }
    finally { setIsSubmitting(false); }
  }

  const fields = [
    ['currentPassword', 'Mevcut Parola'], ['newPassword', 'Yeni Parola'], ['confirmation', 'Yeni Parola Tekrarı'],
  ];
  return (
    <section className="mx-auto max-w-xl">
      <h1 className="text-3xl font-black text-eflavAntrasit">Parola Değiştir</h1>
      <p className="mb-8 mt-2 text-eflavMetinAcik">Yeni parola en az 12 karakter; büyük/küçük harf, rakam ve özel karakter içermelidir.</p>
      <Card hover={false}><form onSubmit={submit} className="space-y-5">
        {fields.map(([name, label]) => <div key={name}><label htmlFor={name} className="mb-2 block text-sm font-semibold">{label}</label><input id={name} name={name} type="password" required autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'} value={form[name]} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} aria-invalid={Boolean(errors[name])} className="w-full rounded-xl border border-eflavSinir px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20" />{errors[name] && <p className="mt-1 text-xs text-red-700">{errors[name][0]}</p>}</div>)}
        {message && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message}</p>}
        <Button type="submit" disabled={isSubmitting} className="w-full">{isSubmitting ? 'Değiştiriliyor...' : 'Parolayı Değiştir'}</Button>
      </form></Card>
    </section>
  );
}
