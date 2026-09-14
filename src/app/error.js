'use client';

import { useEffect } from 'react';

import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Uygulama hatası:', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center bg-eflavKrem py-20">
      <Container>
        <div className="mx-auto max-w-2xl rounded-3xl border border-eflavSinir bg-white p-10 text-center shadow-sm">
          <span
            className="text-6xl"
            aria-hidden="true"
          >
            ⚠️
          </span>

          <h1 className="mt-6 text-3xl font-black text-eflavAntrasit">
            Bir hata oluştu
          </h1>

          <p className="mt-5 leading-8 text-eflavMetinAcik">
            İşleminiz sırasında beklenmeyen bir sorun oluştu. Lütfen tekrar
            deneyin veya ana sayfaya dönün.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              type="button"
              onClick={reset}
            >
              Tekrar Dene
            </Button>

            <Button
              href="/"
              variant="outline"
            >
              Ana Sayfaya Dön
            </Button>
          </div>
        </div>
      </Container>
    </main>
  );
}