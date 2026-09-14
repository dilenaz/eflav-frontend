'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AdminError({ error, unstable_retry }) {
  useEffect(() => {
    console.error('Yönetim paneli sayfa hatası:', error);
  }, [error]);

  return <Card hover={false} className="mx-auto max-w-2xl">
    <div role="alert" className="text-center">
      <p className="text-sm font-bold uppercase tracking-wider text-red-700">İşlem tamamlanamadı</p>
      <h1 className="mt-3 text-2xl font-black text-eflavAntrasit">Yönetim paneli yüklenemedi</h1>
      <p className="mt-3 text-eflavMetinAcik">Veritabanı veya sunucu bağlantısında geçici bir sorun olabilir. Yeniden deneyebilir ya da genel bakışa dönebilirsiniz.</p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button type="button" onClick={() => unstable_retry()}>Yeniden Dene</Button>
        <Button href="/admin" variant="outline">Genel Bakışa Dön</Button>
      </div>
    </div>
  </Card>;
}
