'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { publicJsonRequest } from '@/lib/admin-api-client';

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      await publicJsonRequest('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLocaleLowerCase('tr-TR'),
          password,
        }),
      }, 'Giriş başarısız.');

      router.replace('/admin');
      router.refresh();
    } catch (requestError) {
      setError(requestError.message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <Card
        hover={false}
        className="w-full max-w-md"
      >
        <h1 className="text-center text-3xl font-black text-eflavAntrasit">
          Yönetici Girişi
        </h1>

        <p className="mt-3 text-center text-sm text-eflavMetinAcik">
          Karabük Eflani Hayır Kervanı Vakfı Yönetim Paneli
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold"
            >
              E-posta
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-eflavSinir px-4 py-3 outline-none focus:border-eflavBordo"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold"
            >
              Şifre
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-eflavSinir px-4 py-3 outline-none focus:border-eflavBordo"
            />
          </div>

          {error && (
            <div role="alert" aria-live="assertive" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
