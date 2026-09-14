'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global uygulama hatası:', error);
  }, [error]);

  return (
    <html lang="tr">
      <body className="bg-eflavKrem text-eflavMetin">
        <main className="flex min-h-screen items-center justify-center px-4 py-20">
          <div className="w-full max-w-2xl rounded-3xl border border-eflavSinir bg-white p-10 text-center shadow-sm">
            <span className="text-6xl" aria-hidden="true">
              ⚠️
            </span>

            <h1 className="mt-6 text-3xl font-black text-eflavAntrasit">
              Uygulama yüklenemedi
            </h1>

            <p className="mt-5 leading-8 text-eflavMetinAcik">
              Beklenmeyen bir sistem hatası oluştu. Sayfayı yeniden yüklemeyi
              deneyebilirsiniz.
            </p>

            <button
              type="button"
              onClick={reset}
              className="mt-10 inline-flex min-h-11 items-center justify-center rounded-xl bg-eflavBordo px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-eflavBordoKoyu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-eflavBordo focus-visible:ring-offset-2"
            >
              Tekrar Dene
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}