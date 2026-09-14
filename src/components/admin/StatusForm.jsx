'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminRequest } from '@/lib/admin-api-client';

export default function StatusForm({ endpoint, initialStatus, options, label }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(event) {
    const nextStatus = event.target.value;
    const previousStatus = status;
    setStatus(nextStatus);
    setMessage('');
    setIsSaving(true);

    try {
      await adminRequest(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      }, 'Durum güncellenemedi.');
      router.refresh();
    } catch (error) {
      setStatus(previousStatus);
      setMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <label className="sr-only" htmlFor={`status-${endpoint.replaceAll('/', '-')}`}>
        {label}
      </label>
      <select
        id={`status-${endpoint.replaceAll('/', '-')}`}
        value={status}
        onChange={handleChange}
        disabled={isSaving}
        className="rounded-lg border border-eflavSinir bg-white px-3 py-2 text-sm outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20 disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {message && <p role="alert" className="mt-1 max-w-48 text-xs text-red-700">{message}</p>}
    </div>
  );
}
