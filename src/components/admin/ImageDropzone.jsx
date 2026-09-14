'use client';

import { useRef, useState } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { adminRequest } from '@/lib/admin-api-client';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const ALLOWED_TYPES = new Set(ACCEPT.split(','));
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function ImageDropzone({ value, onChange, label = 'Görsel' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [uploaded, setUploaded] = useState(false);

  async function upload(file) {
    if (!file || busy) return;
    if (!ALLOWED_TYPES.has(file.type)) {
      setMessage('Yalnızca JPG, PNG, WEBP veya GIF yükleyebilirsiniz.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setMessage('Görsel boyutu 5 MB sınırını aşıyor.');
      return;
    }
    setBusy(true);
    setMessage('');
    setUploaded(false);
    try {
      const body = new FormData();
      body.append('file', file);
      const data = await adminRequest('/api/admin/uploads', { method: 'POST', body }, 'Görsel yüklenemedi.');
      onChange(data.url);
      setUploaded(true);
    } catch (error) {
      setMessage(error.message || 'Görsel yüklenemedi.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragging(false);
    upload(event.dataTransfer.files?.[0]);
  }

  return (
    <div>
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <div
        onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-5 text-center transition ${dragging ? 'border-eflavBordo bg-red-50' : 'border-eflavSinir bg-eflavKrem/40'}`}
      >
          {value && <div className="relative mx-auto mb-4 h-48 max-w-md overflow-hidden rounded-xl border border-eflavSinir"><OptimizedImage key={value} src={value} alt="Yüklenen görsel önizlemesi" fill sizes="448px" /></div>}
        <input ref={inputRef} type="file" accept={ACCEPT} className="sr-only" onChange={(event) => upload(event.target.files?.[0])} />
        <p className="font-semibold">Görseli buraya sürükleyip bırakın</p>
        <p className="mt-1 text-xs text-eflavMetinAcik">JPG, PNG, WEBP veya GIF · en fazla 5 MB</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="rounded-xl bg-eflavBordo px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Yükleniyor...' : 'Dosya Seç'}</button>
          {value && <button type="button" disabled={busy} onClick={() => { onChange(''); setUploaded(false); }} className="rounded-xl border border-eflavSinir bg-white px-4 py-2 text-sm font-semibold">Görseli Kaldır</button>}
        </div>
      </div>
      {uploaded && <p role="status" className="mt-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">✓ Görsel başarıyla yüklendi ve önizlemeye eklendi.</p>}
      {message && <p role="alert" className="mt-2 text-sm text-red-700">{message}</p>}
    </div>
  );
}
