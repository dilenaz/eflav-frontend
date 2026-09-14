'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import { adminRequest } from '@/lib/admin-api-client';

export default function DeleteNewsButton({ newsId, newsTitle }) {
  const router = useRouter();
  const confirmButtonRef = useRef(null);
  const triggerButtonRef = useRef(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isConfirming) {
      confirmButtonRef.current?.focus();
    }
  }, [isConfirming]);

  function cancelDelete() {
    setIsConfirming(false);
    setMessage('');
    requestAnimationFrame(() => triggerButtonRef.current?.focus());
  }

  async function handleDelete() {
    setIsDeleting(true);
    setMessage('');

    try {
      await adminRequest(`/api/admin/news/${newsId}`, {
        method: 'DELETE',
      }, 'Haber silinemedi.');

      router.push('/admin/haberler');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsDeleting(false);
    }
  }

  if (!isConfirming) {
    return (
      <div className="mt-8 border-t border-eflavSinir pt-8">
        <h2 className="text-lg font-bold text-eflavAntrasit">Tehlikeli Bölge</h2>
        <p className="mt-1 text-sm text-eflavMetinAcik">
          Silinen haber geri alınamaz.
        </p>
        <Button
          ref={triggerButtonRef}
          type="button"
          variant="outline"
          className="mt-4 border-red-700 text-red-700 focus-visible:ring-red-700"
          onClick={() => setIsConfirming(true)}
        >
          Haberi Sil
        </Button>
      </div>
    );
  }

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-news-title"
      aria-describedby="delete-news-description"
      className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6"
    >
      <h2 id="delete-news-title" className="text-lg font-bold text-red-900">
        Haberi silmek istediğinizden emin misiniz?
      </h2>
      <p id="delete-news-description" className="mt-2 text-sm text-red-800">
        “{newsTitle}” kalıcı olarak silinecek. Bu işlem geri alınamaz.
      </p>

      {message && (
        <p role="alert" aria-live="assertive" className="mt-4 text-sm font-semibold text-red-800">
          {message}
        </p>
      )}

      <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isDeleting}
          onClick={cancelDelete}
        >
          Vazgeç
        </Button>
        <Button
          ref={confirmButtonRef}
          type="button"
          className="bg-red-700 focus-visible:ring-red-700"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          {isDeleting ? 'Siliniyor...' : 'Evet, Haberi Sil'}
        </Button>
      </div>
    </div>
  );
}
