'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import ImageDropzone from '@/components/admin/ImageDropzone';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { adminRequest } from '@/lib/admin-api-client';

const emptyForm = { title:'', slug:'', summary:'', content:'', eventDate:'', eventTime:'', location:'', imageUrl:'', imageAlt:'', status:'draft' };

function createSlug(value) {
  return value.toLocaleLowerCase('tr-TR')
    .replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ü','u')
    .replaceAll('ş','s').replaceAll('ö','o').replaceAll('ç','c')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');
}

function FieldError({ errors }) {
  return errors?.length ? <p className="mt-1 text-sm text-red-700">{errors[0]}</p> : null;
}

export default function EventForm({ eventId, initialData, canDelete = false }) {
  const router = useRouter();
  const isEditing = Boolean(eventId);
  const [form, setForm] = useState({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const inputClassName = 'w-full rounded-xl border border-eflavSinir bg-white px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20';

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'slug' ? createSlug(value) : value, ...(name === 'title' && !slugEdited ? { slug: createSlug(value) } : {}) }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setErrors({});
    try {
      await adminRequest(isEditing ? `/api/admin/events/${eventId}` : '/api/admin/events', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventTime: form.eventTime || null, imageUrl: form.imageUrl || null, imageAlt: form.imageAlt.trim() || null }),
      }, 'Etkinlik kaydedilemedi.');
      router.push('/admin/etkinlikler');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
      setErrors(error.errors || {});
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm('Bu etkinlik kalıcı olarak silinsin mi?')) return;
    setBusy(true);
    setMessage('');
    try {
      await adminRequest(`/api/admin/events/${eventId}`, { method:'DELETE' }, 'Etkinlik silinemedi.');
      router.push('/admin/etkinlikler');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  function field(name, label, { type='text', required=true, minLength, maxLength } = {}) {
    return <div>
      <label htmlFor={name} className="mb-2 block text-sm font-semibold">{label}{!required && <span className="ml-1 font-normal text-eflavMetinAcik">(isteğe bağlı)</span>}</label>
      <input id={name} name={name} type={type} required={required} minLength={minLength} maxLength={maxLength} value={form[name]} onChange={(event) => { if (name === 'slug') setSlugEdited(true); change(event); }} aria-invalid={Boolean(errors[name])} className={inputClassName} />
      <FieldError errors={errors[name]} />
    </div>;
  }

  return <Card hover={false}>
    <form onSubmit={submit} className="space-y-6">
      {field('title','Başlık',{ minLength:5, maxLength:255 })}
      {field('slug','Bağlantı adresi',{ minLength:3, maxLength:255 })}
      <div className="grid gap-5 md:grid-cols-2">
        {field('eventDate','Tarih',{ type:'date' })}
        {field('eventTime','Saat',{ type:'time', required:false })}
      </div>
      {field('location','Konum',{ minLength:2, maxLength:255 })}
      <div><label htmlFor="summary" className="mb-2 block text-sm font-semibold">Özet</label><textarea id="summary" name="summary" rows={4} required minLength={10} maxLength={500} value={form.summary} onChange={change} aria-invalid={Boolean(errors.summary)} className={inputClassName}/><FieldError errors={errors.summary}/></div>
      <div><label htmlFor="content" className="mb-2 block text-sm font-semibold">İçerik</label><textarea id="content" name="content" rows={12} required minLength={20} value={form.content} onChange={change} aria-invalid={Boolean(errors.content)} className={inputClassName}/><FieldError errors={errors.content}/></div>
      <ImageDropzone value={form.imageUrl} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}/>
      {field('imageAlt','Görsel açıklaması',{ required:false, maxLength:255 })}
      <div><label htmlFor="status" className="mb-2 block text-sm font-semibold">Yayın durumu</label><select id="status" name="status" value={form.status} onChange={change} className={inputClassName}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="archived">Arşivlendi</option></select></div>
      {message && <p role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{message}</p>}
      <div className="flex flex-col-reverse gap-3 border-t border-eflavSinir pt-6 sm:flex-row sm:justify-end">
        {isEditing && canDelete && <Button type="button" variant="outline" disabled={busy} onClick={remove} className="border-red-700 text-red-700">Etkinliği Sil</Button>}
        <Button href="/admin/etkinlikler" variant="ghost">Vazgeç</Button>
        <Button type="submit" disabled={busy}>{busy ? 'Kaydediliyor...' : 'Etkinliği Kaydet'}</Button>
      </div>
    </form>
  </Card>;
}
