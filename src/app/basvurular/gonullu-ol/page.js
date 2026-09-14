'use client';

import { useState } from 'react';
import Link from 'next/link';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import TurnstileWidget, { turnstileEnabled } from '@/components/security/TurnstileWidget';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  interests: '',
  note: '',
  website: '',
};

const fieldClass = 'w-full rounded-xl border border-eflavSinir bg-white px-4 py-3 text-eflavAntrasit outline-none transition focus:border-eflavBordo focus:ring-4 focus:ring-eflavBordo/10 disabled:cursor-not-allowed disabled:opacity-60';

export default function GonulluOlPage() {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFeedback(null);
  }

  async function submit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          subject: 'Gönüllülük Başvurusu',
          message: [
            `Telefon: ${form.phone}`,
            `İlgilendiği alanlar: ${form.interests}`,
            form.note ? `Ek not: ${form.note}` : null,
          ].filter(Boolean).join('\n'),
          website: form.website,
          captchaToken,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setFeedback({
          type: 'error',
          message: data?.message || 'Başvurunuz gönderilemedi. Lütfen daha sonra yeniden deneyin.',
        });
        return;
      }

      setForm(emptyForm);
      setFeedback({
        type: 'success',
        message: `Gönüllülük başvurunuz alındı${data?.referenceNumber ? ` (${data.referenceNumber})` : ''}. En kısa sürede sizinle iletişime geçeceğiz.`,
      });
    } catch {
      setFeedback({
        type: 'error',
        message: 'Sunucuya bağlanılamadı. Lütfen daha sonra yeniden deneyin.',
      });
    } finally {
      setIsSubmitting(false);
      setCaptchaResetKey((value) => value + 1);
    }
  }

  return (
    <main className="min-h-[80vh] bg-eflavKrem py-12">
      <div className="mx-auto max-w-3xl px-4">
        <header className="mb-8 text-center">
          <span className="text-5xl" aria-hidden="true">🌱</span>
          <h1 className="mt-5 text-3xl font-extrabold text-eflavAntrasit sm:text-4xl">
            Vakıf Gönüllüsü Olun
          </h1>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-eflavMetinAcik">
            Sosyal yardım, eğitim, kültür ve organizasyon çalışmalarımızda katkı sunmak istediğiniz alanları bize iletin.
          </p>
        </header>

        <Card hover={false}>
          <form onSubmit={submit} className="space-y-5" noValidate>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="volunteer-full-name" className="mb-2 block text-sm font-semibold">Ad Soyad</label>
                <input id="volunteer-full-name" name="fullName" value={form.fullName} onChange={change} className={fieldClass} autoComplete="name" minLength={3} maxLength={150} required disabled={isSubmitting} />
              </div>
              <div>
                <label htmlFor="volunteer-email" className="mb-2 block text-sm font-semibold">E-posta</label>
                <input id="volunteer-email" name="email" type="email" value={form.email} onChange={change} className={fieldClass} autoComplete="email" maxLength={190} required disabled={isSubmitting} />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="volunteer-phone" className="mb-2 block text-sm font-semibold">Telefon</label>
                <input id="volunteer-phone" name="phone" type="tel" value={form.phone} onChange={change} className={fieldClass} autoComplete="tel" maxLength={20} required disabled={isSubmitting} />
              </div>
              <div>
                <label htmlFor="volunteer-interests" className="mb-2 block text-sm font-semibold">Katkı sunmak istediğiniz alanlar</label>
                <input id="volunteer-interests" name="interests" value={form.interests} onChange={change} className={fieldClass} maxLength={300} placeholder="Örn. eğitim, saha çalışması, organizasyon" required disabled={isSubmitting} />
              </div>
            </div>

            <div>
              <label htmlFor="volunteer-note" className="mb-2 block text-sm font-semibold">Eklemek istedikleriniz <span className="font-normal text-eflavMetinAcik">(isteğe bağlı)</span></label>
              <textarea id="volunteer-note" name="note" rows={5} value={form.note} onChange={change} className={`${fieldClass} resize-y`} maxLength={4000} disabled={isSubmitting} />
            </div>

            <div hidden aria-hidden="true">
              <label htmlFor="volunteer-website">Web sitesi</label>
              <input id="volunteer-website" name="website" value={form.website} onChange={change} tabIndex={-1} autoComplete="off" />
            </div>

            <TurnstileWidget onVerify={setCaptchaToken} resetKey={captchaResetKey} />

            <p className="text-xs leading-5 text-eflavMetinAcik">
              Başvuruyu göndererek <Link href="/kvkk" target="_blank" rel="noopener noreferrer" className="font-semibold text-eflavBordo underline">KVKK Aydınlatma Metni</Link>’ni okuduğunuzu ve bilgi edindiğinizi beyan edersiniz.
            </p>

            {feedback && (
              <p role={feedback.type === 'error' ? 'alert' : 'status'} className={`rounded-xl border p-4 text-sm ${feedback.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>
                {feedback.message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting || (turnstileEnabled && !captchaToken)}>
              {isSubmitting ? 'Gönderiliyor...' : 'Gönüllülük Başvurusunu Gönder'}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
