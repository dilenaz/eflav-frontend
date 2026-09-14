'use client';

import { useState } from 'react';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TurnstileWidget, { turnstileEnabled } from '@/components/security/TurnstileWidget';

const emptyForm = {
  fullName: '', tcIdentityNumber: '', phone: '',
  settlementType: 'eflani_merkez', settlementName: '',
  requestDetail: '', kvkkApproved: false,
};

const fieldClass = 'w-full rounded-lg border border-eflavSinir px-3 py-2 text-sm outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20';

function Field({ name, label, value, onChange, errors, type = 'text', ...props }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-xs font-bold uppercase text-eflavAntrasit">{label}</label>
      <input id={name} name={name} type={type} value={value} onChange={onChange} aria-invalid={Boolean(errors)} aria-describedby={errors ? `${name}-error` : undefined} className={fieldClass} {...props} />
      {errors && <p id={`${name}-error`} className="mt-1 text-xs text-red-700">{errors[0]}</p>}
    </div>
  );
}

export default function ApplicationForm({ type }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  function change(event) {
    const { name, value, type: inputType, checked } = event.target;
    setForm((current) => ({ ...current, [name]: inputType === 'checkbox' ? checked : value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    setErrors({}); setMessage(''); setTrackingNumber(''); setIsSubmitting(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationType: type, ...form,
          email: null,
          universityName: null,
          departmentName: null,
          captchaToken,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Başvuru kaydedilemedi.');
        setErrors(data.errors || {});
        return;
      }
      setTrackingNumber(data.trackingNumber);
      setMessage(data.message);
      setForm(emptyForm);
    } catch {
      setMessage('Sunucuya bağlanılamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
      setCaptchaResetKey((value) => value + 1);
    }
  }

  const fieldProps = (name) => ({ value: form[name], onChange: change, errors: errors[name] });

  return (
    <Card hover={false}>
      {trackingNumber ? (
        <div role="status" className="py-8 text-center">
          <h2 className="text-xl font-bold text-eflavAntrasit">Başvurunuz alındı</h2>
          <p className="mt-3 text-eflavMetinAcik">Takip numaranız:</p>
          <p className="mt-2 text-2xl font-black text-eflavBordo">{trackingNumber}</p>
          <p className="mt-4 text-sm text-eflavMetinAcik">Bu numarayı güvenli bir yerde saklayınız.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <Field name="fullName" label="Ad Soyad" {...fieldProps('fullName')} required maxLength={150} />
            <Field name="tcIdentityNumber" label="T.C. Kimlik Numarası" {...fieldProps('tcIdentityNumber')} inputMode="numeric" required minLength={11} maxLength={11} autoComplete="off" />
            <Field name="phone" label="Telefon" {...fieldProps('phone')} type="tel" required maxLength={20} autoComplete="tel" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="settlementType" className="mb-1 block text-xs font-bold uppercase text-eflavAntrasit">Yerleşim Türü</label>
              <select id="settlementType" name="settlementType" value={form.settlementType} onChange={change} className={fieldClass}>
                <option value="eflani_merkez">Eflani Merkez</option><option value="eflani_koyu">Eflani Köyü</option><option value="eflani_mahallesi">Eflani Mahallesi</option>
              </select>
            </div>
            <Field name="settlementName" label="Köy / Mahalle Adı" {...fieldProps('settlementName')} required maxLength={150} />
          </div>
          <div>
            <label htmlFor="requestDetail" className="mb-1 block text-xs font-bold uppercase text-eflavAntrasit">Talep edilen yardım ve açıklama</label>
            <textarea id="requestDetail" name="requestDetail" rows={5} required maxLength={5000} value={form.requestDetail} onChange={change} aria-invalid={Boolean(errors.requestDetail)} className={`${fieldClass} resize-y`} />
            {errors.requestDetail && <p className="mt-1 text-xs text-red-700">{errors.requestDetail[0]}</p>}
          </div>
          <label className="flex items-start gap-3 rounded-xl border border-eflavSinir p-4 text-sm">
            <input name="kvkkApproved" type="checkbox" checked={form.kvkkApproved} onChange={change} className="mt-1 accent-eflavBordo" />
            <span><Link href="/kvkk" target="_blank" className="font-semibold text-eflavBordo underline">KVKK Aydınlatma Metni</Link>’ni okudum ve kişisel verilerimin işlenmesi hakkında bilgi edindim.</span>
          </label>
          {errors.kvkkApproved && <p className="text-xs text-red-700">{errors.kvkkApproved[0]}</p>}
          <TurnstileWidget onVerify={setCaptchaToken} resetKey={captchaResetKey} />
          {message && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{message}</p>}
          <Button type="submit" disabled={isSubmitting || (turnstileEnabled && !captchaToken)} className="w-full">{isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Gönder'}</Button>
        </form>
      )}
    </Card>
  );
}
