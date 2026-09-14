'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { adminRequest } from '@/lib/admin-api-client';

export default function LogoutButton() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function logout() {
    setIsSubmitting(true);
    setMessage('');
    try {
      await adminRequest('/api/admin/logout', { method: 'POST' }, 'Çıkış yapılamadı.');
      router.replace('/admin/giris');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return <div className="text-right"><Button type="button" variant="outline" size="sm" disabled={isSubmitting} onClick={logout}>{isSubmitting ? 'Çıkılıyor...' : 'Çıkış Yap'}</Button>{message && <p role="alert" className="mt-1 max-w-52 text-xs text-red-700">{message}</p>}</div>;
}
