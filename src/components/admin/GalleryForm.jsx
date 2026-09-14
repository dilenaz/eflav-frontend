'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import GalleryImagesDropzone from '@/components/admin/GalleryImagesDropzone';
import ImageDropzone from '@/components/admin/ImageDropzone';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { adminRequest } from '@/lib/admin-api-client';

const emptyForm = { title:'', slug:'', summary:'', content:'', coverImageUrl:'', coverImageAlt:'', status:'draft', publishedAt:null, images:[] };

function createSlug(value) {
  return value.toLocaleLowerCase('tr-TR')
    .replaceAll('ı','i').replaceAll('ğ','g').replaceAll('ü','u')
    .replaceAll('ş','s').replaceAll('ö','o').replaceAll('ç','c')
    .replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-');
}

function FieldError({ errors }) {
  return errors?.length ? <p className="mt-1 text-sm text-red-700">{errors[0]}</p> : null;
}

export default function GalleryForm({ id, initialData, canDelete = false }) {
  const router = useRouter();
  const isEditing = Boolean(id);
  const [form, setForm] = useState({ ...emptyForm, ...initialData });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [slugEdited, setSlugEdited] = useState(isEditing);
  const inputClassName = 'w-full rounded-xl border border-eflavSinir bg-white px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20';

  function change(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'slug' ? createSlug(value) : value, ...(name === 'title' && !slugEdited ? { slug:createSlug(value) } : {}) }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  }

  async function save(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setErrors({});
    try {
      await adminRequest(isEditing ? `/api/admin/gallery/${id}` : '/api/admin/gallery', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({
          ...form,
          coverImageUrl: form.coverImageUrl || null,
          coverImageAlt: form.coverImageAlt.trim() || null,
          publishedAt: form.status === 'published' ? form.publishedAt || new Date().toISOString() : null,
        }),
      }, 'Albüm kaydedilemedi.');
      router.push('/admin/galeri');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
      setErrors(error.errors || {});
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm('Bu albüm ve içindeki fotoğraf kayıtları kalıcı olarak silinsin mi?')) return;
    setBusy(true);
    setMessage('');
    try {
      await adminRequest(`/api/admin/gallery/${id}`, { method:'DELETE' }, 'Albüm silinemedi.');
      router.push('/admin/galeri');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  }

  return <Card hover={false}>
    <form onSubmit={save} className="space-y-6">
      <div><label htmlFor="title" className="mb-2 block text-sm font-semibold">Albüm başlığı</label><input id="title" name="title" required minLength={3} maxLength={255} value={form.title} onChange={change} aria-invalid={Boolean(errors.title)} className={inputClassName}/><FieldError errors={errors.title}/></div>
      <div><label htmlFor="slug" className="mb-2 block text-sm font-semibold">Bağlantı adresi</label><input id="slug" name="slug" required minLength={3} maxLength={255} value={form.slug} onChange={(event) => { setSlugEdited(true); change(event); }} aria-invalid={Boolean(errors.slug)} className={inputClassName}/><FieldError errors={errors.slug}/></div>
      <ImageDropzone label="Albüm Kapak Görseli" value={form.coverImageUrl} onChange={(coverImageUrl) => setForm((current) => ({ ...current, coverImageUrl }))}/>
      <div><label htmlFor="coverImageAlt" className="mb-2 block text-sm font-semibold">Kapak açıklaması <span className="font-normal text-eflavMetinAcik">(isteğe bağlı)</span></label><input id="coverImageAlt" name="coverImageAlt" maxLength={255} value={form.coverImageAlt} onChange={change} aria-invalid={Boolean(errors.coverImageAlt)} className={inputClassName}/><FieldError errors={errors.coverImageAlt}/></div>
      <div><label htmlFor="summary" className="mb-2 block text-sm font-semibold">Özet</label><textarea id="summary" name="summary" rows={4} required minLength={10} maxLength={500} value={form.summary} onChange={change} aria-invalid={Boolean(errors.summary)} className={inputClassName}/><FieldError errors={errors.summary}/></div>
      <div><label htmlFor="content" className="mb-2 block text-sm font-semibold">Albüm açıklaması</label><textarea id="content" name="content" rows={10} required minLength={20} value={form.content} onChange={change} aria-invalid={Boolean(errors.content)} className={inputClassName}/><FieldError errors={errors.content}/></div>
      <GalleryImagesDropzone images={form.images} defaultAlt={form.title} onChange={(images) => setForm((current) => ({ ...current, images }))}/>
      <FieldError errors={errors.images}/>
      <div><label htmlFor="status" className="mb-2 block text-sm font-semibold">Yayın durumu</label><select id="status" name="status" value={form.status} onChange={change} className={inputClassName}><option value="draft">Taslak</option><option value="published">Yayında</option><option value="archived">Arşivlendi</option></select></div>
      {message && <p role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">{message}</p>}
      <div className="flex flex-col-reverse gap-3 border-t border-eflavSinir pt-6 sm:flex-row sm:justify-end">
        {isEditing && canDelete && <Button type="button" variant="outline" disabled={busy} onClick={remove} className="border-red-700 text-red-700">Albümü Sil</Button>}
        <Button href="/admin/galeri" variant="ghost">Vazgeç</Button>
        <Button type="submit" disabled={busy}>{busy ? 'Kaydediliyor...' : 'Albümü Kaydet'}</Button>
      </div>
    </form>
  </Card>;
}
