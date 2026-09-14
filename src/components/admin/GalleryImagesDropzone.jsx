'use client';

import { useRef, useState } from 'react';
import OptimizedImage from '@/components/ui/OptimizedImage';
import { adminRequest } from '@/lib/admin-api-client';

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';
const ALLOWED_TYPES = new Set(ACCEPT.split(','));
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function GalleryImagesDropzone({ images, onChange, defaultAlt }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  async function uploadFiles(fileList) {
    const files = [...(fileList || [])].slice(0, Math.max(0, 50 - images.length));
    if (!files.length || busy) return;
    const invalidType = files.find((file) => !ALLOWED_TYPES.has(file.type));
    if (invalidType) {
      setMessage(`${invalidType.name}: Yalnızca JPG, PNG, WEBP veya GIF yükleyebilirsiniz.`);
      return;
    }
    const oversized = files.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setMessage(`${oversized.name}: Dosya boyutu 5 MB sınırını aşıyor.`);
      return;
    }
    setBusy(true);
    setMessage('');
    const uploaded = [];
    try {
      for (const file of files) {
        const body = new FormData();
        body.append('file', file);
        const data = await adminRequest('/api/admin/uploads', { method:'POST', body }, `${file.name}: Yüklenemedi.`);
        uploaded.push({ url:data.url, alt:defaultAlt || file.name.replace(/\.[^.]+$/, '') });
      }
      onChange([...images, ...uploaded]);
      setMessage(`${uploaded.length} görsel başarıyla yüklendi.`);
    } catch (error) {
      if (uploaded.length) onChange([...images, ...uploaded]);
      setMessage(error.message || 'Görseller yüklenemedi.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return <section className="space-y-4">
    <div><h3 className="font-black">Albüm Görselleri</h3><p className="mt-1 text-sm text-eflavMetinAcik">Birden fazla görseli aynı anda seçebilir veya sürükleyebilirsiniz. En fazla 50 görsel.</p></div>
    <div onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); uploadFiles(event.dataTransfer.files); }} className={`rounded-2xl border-2 border-dashed p-6 text-center ${dragging ? 'border-eflavBordo bg-red-50' : 'border-eflavSinir bg-eflavKrem/40'}`}>
      <input ref={inputRef} type="file" multiple accept={ACCEPT} className="sr-only" onChange={(event) => uploadFiles(event.target.files)}/>
      <p className="font-semibold">Fotoğrafları buraya sürükleyip bırakın</p>
      <button type="button" disabled={busy || images.length >= 50} onClick={() => inputRef.current?.click()} className="mt-4 rounded-xl bg-eflavBordo px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{busy ? 'Yükleniyor...' : 'Fotoğraf Seç'}</button>
    </div>
    {message && <p role="status" className={`text-sm font-semibold ${message.includes('başarıyla') ? 'text-green-700' : 'text-red-700'}`}>{message}</p>}
    <div className="grid gap-5 sm:grid-cols-2">{images.map((image, index) => <article key={`${image.url}-${index}`} className="overflow-hidden rounded-2xl border border-eflavSinir bg-white"><div className="relative aspect-[4/3]"><OptimizedImage src={image.url} alt={image.alt || defaultAlt} fill sizes="(max-width: 640px) 100vw, 50vw"/></div><div className="space-y-3 p-4"><label className="block text-sm font-semibold">Görsel açıklaması<input value={image.alt} onChange={(event) => onChange(images.map((item, itemIndex) => itemIndex === index ? { ...item, alt:event.target.value } : item))} className="mt-1 w-full rounded-xl border border-eflavSinir px-3 py-2"/></label><button type="button" onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))} className="text-sm font-bold text-red-700">Görseli Kaldır</button></div></article>)}</div>
  </section>;
}
