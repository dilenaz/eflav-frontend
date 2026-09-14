'use client';

import { useState } from 'react';
import Container from '@/components/ui/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import TurnstileWidget, { turnstileEnabled } from '@/components/security/TurnstileWidget';
import { contactSchema } from '@/lib/validations/contact.schema';

export default function IletisimPage() {
  const [formData, setFormData] = useState({ fullName: '', email: '', subject: '', message: '', website: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // İstemci Tarafı Zod Doğrulaması
    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setErrors(formattedErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Gelecekte API katmanına bağlanacak olan kısım
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      const data = await response.json().catch(() => null);
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ fullName: '', email: '', subject: '', message: '', website: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data?.message });
      }
    } catch {
      setSubmitStatus({ type: 'error' });
    } finally {
      setIsSubmitting(false);
      setCaptchaResetKey((value) => value + 1);
    }
  };

  return (
    <main className="py-16 bg-eflavKrem min-h-[80vh]">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <SectionTitle title="İletişim" subtitle="Bizimle İletişime Geçin" titleAs="h1" />
          <p className="text-eflavMetinAcik mt-2 text-sm sm:text-base">
            Vakıf faaliyetlerimiz hakkında bilgi almak, destek sağlamak veya önerilerinizi iletmek için formu doldurabilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
          {/* Sol Kolon: Kurumsal İletişim Bilgileri */}
          <div className="lg:col-span-5 space-y-6 bg-eflavAntrasit text-white p-8 rounded-xl shadow-sm">
            <h3 className="text-xl font-serif font-bold text-eflavAltin border-b border-white/10 pb-3">
              Karabük Eflani Hayır Kervanı Vakfı
            </h3>
            <div className="space-y-4 text-sm sm:text-base text-gray-300">
              <p className="flex items-start gap-3">
                <span aria-hidden="true">📍</span>
                <span>
                  Pelitli Mahallesi, Mollafenari Caddesi No:86, Gebze / Kocaeli
                  <br />
                  <span className="text-xs text-gray-400">Faaliyet odağı: Eflani / Karabük</span>
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span aria-hidden="true">☎</span>
                <a href="tel:+905453790306" className="font-semibold text-white hover:text-eflavAltin">+90 545 379 03 06</a>
              </p>
              <p className="flex items-start gap-3">
                <span aria-hidden="true">✉</span>
                <a href="mailto:karabukeflanivakfi@gmail.com" className="break-all font-semibold text-white hover:text-eflavAltin">karabukeflanivakfi@gmail.com</a>
              </p>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-eflavAltin">Ziraat Bankası IBAN</p>
                <p className="mt-2 break-words font-mono text-sm font-semibold text-white">TR66 0001 0026 2997 8393 0750 01</p>
              </div>
            </div>
          </div>

          {/* Sağ Kolon: Gelişmiş Validasyonlu Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-eflavSinir space-y-5" noValidate>
            {submitStatus === 'success' && (
              <div role="status" className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm font-medium">
                Mesajınız başarıyla iletildi. En kısa sürede geri dönüş sağlanacaktır.
              </div>
            )}
            {submitStatus?.type === 'error' && (
              <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm font-medium">
                {submitStatus.message || 'Mesaj iletilirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.'}
              </div>
            )}

            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-eflavAntrasit mb-1">Ad Soyad</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                autoComplete="name"
                minLength={3}
                maxLength={150}
                required
                aria-invalid={errors.fullName ? 'true' : 'false'}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-eflavBordo/20 text-eflavAntrasit ${errors.fullName ? 'border-red-500' : 'border-eflavSinir'}`}
              />
              {errors.fullName && <p id="fullName-error" className="text-red-600 text-xs mt-1 font-medium">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-eflavAntrasit mb-1">E-Posta Adresi</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                maxLength={190}
                required
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-eflavBordo/20 text-eflavAntrasit ${errors.email ? 'border-red-500' : 'border-eflavSinir'}`}
              />
              {errors.email && <p id="email-error" className="text-red-600 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-eflavAntrasit mb-1">Konu</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                minLength={5}
                maxLength={200}
                required
                aria-invalid={errors.subject ? 'true' : 'false'}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-eflavBordo/20 text-eflavAntrasit ${errors.subject ? 'border-red-500' : 'border-eflavSinir'}`}
              />
              {errors.subject && <p id="subject-error" className="text-red-600 text-xs mt-1 font-medium">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-eflavAntrasit mb-1">Mesajınız</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                minLength={10}
                maxLength={5000}
                required
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-eflavBordo/20 text-eflavAntrasit resize-none ${errors.message ? 'border-red-500' : 'border-eflavSinir'}`}
              />
              {errors.message && <p id="message-error" className="text-red-600 text-xs mt-1 font-medium">{errors.message}</p>}
            </div>

            <div hidden aria-hidden="true">
              <label htmlFor="website">Web sitesi</label>
              <input id="website" name="website" value={formData.website} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </div>
            <TurnstileWidget onVerify={setCaptchaToken} resetKey={captchaResetKey} />
            <p className="text-xs leading-5 text-eflavMetinAcik">Formu göndererek <Link href="/kvkk" target="_blank" rel="noopener noreferrer" className="font-semibold text-eflavBordo underline">KVKK Aydınlatma Metni</Link>’ni okuduğunuzu ve bilgi edindiğinizi beyan edersiniz.</p>
            <Button type="submit" variant="primary" className="w-full justify-center" disabled={isSubmitting || (turnstileEnabled && !captchaToken)}>
              {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
            </Button>
          </form>
        </div>
      </Container>
    </main>
  );
}
