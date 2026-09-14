'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ImageDropzone from '@/components/admin/ImageDropzone';
import { adminRequest } from '@/lib/admin-api-client';

export default function ContentPageForm({ id, slug, initialData }) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const isBoard = slug === 'yonetim-kurulu';
  const isSeref = slug === 'seref-karakaya';
  const cls = 'w-full rounded-xl border border-eflavSinir bg-white px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20';

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updateMember = (index, field, value) => setForm((current) => ({
    ...current,
    members: current.members.map((member, memberIndex) => memberIndex === index ? { ...member, [field]: value } : member),
  }));
  const addMember = () => setForm((current) => ({ ...current, members: [...current.members, { fullName:'', roleTitle:'', imageUrl:'', imageAlt:'' }] }));
  const removeMember = (index) => setForm((current) => ({ ...current, members: current.members.filter((_, memberIndex) => memberIndex !== index) }));

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    setErrors({});
    try {
      await adminRequest(`/api/admin/content-pages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eyebrow: form.eyebrow || null, imageUrl: form.imageUrl || null, imageAlt: form.imageAlt || null }),
      }, 'Kurumsal içerik kaydedilemedi.');
      router.push('/admin/kurumsal-sayfalar');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
      setErrors(error.errors || {});
    } finally {
      setBusy(false);
    }
  }

  return <Card hover={false}><form onSubmit={submit} className="space-y-6">
    <div><label htmlFor="title" className="block font-semibold">Başlık</label><input id="title" name="title" required minLength={3} maxLength={255} value={form.title} onChange={change} aria-invalid={Boolean(errors.title)} className={cls}/>{errors.title && <p className="mt-1 text-sm text-red-700">{errors.title[0]}</p>}</div>
    <div><label htmlFor="eyebrow" className="block font-semibold">Üst etiket <span className="font-normal text-eflavMetinAcik">(isteğe bağlı)</span></label><input id="eyebrow" name="eyebrow" maxLength={100} value={form.eyebrow} onChange={change} className={cls}/></div>
    {(isSeref || form.imageUrl) && <><ImageDropzone label={isSeref ? 'Şeref Karakaya Profil Fotoğrafı' : 'Sayfa Görseli'} value={form.imageUrl} onChange={(imageUrl) => setForm((current) => ({ ...current, imageUrl }))}/><div><label htmlFor="imageAlt" className="block font-semibold">Fotoğraf açıklaması <span className="font-normal text-eflavMetinAcik">(isteğe bağlı)</span></label><input id="imageAlt" name="imageAlt" maxLength={255} value={form.imageAlt} onChange={change} className={cls}/></div></>}
    <div><label htmlFor="summary" className="block font-semibold">Kısa açıklama</label><textarea id="summary" name="summary" rows={3} required minLength={10} maxLength={500} value={form.summary} onChange={change} aria-invalid={Boolean(errors.summary)} className={cls}/>{errors.summary && <p className="mt-1 text-sm text-red-700">{errors.summary[0]}</p>}</div>
    <div><label htmlFor="content" className="block font-semibold">Sayfa içeriği</label><p className="mb-2 text-sm text-eflavMetinAcik">Paragrafları boş satırla ayırabilirsiniz.</p><textarea id="content" name="content" rows={18} required minLength={20} value={form.content} onChange={change} aria-invalid={Boolean(errors.content)} className={cls}/>{errors.content && <p className="mt-1 text-sm text-red-700">{errors.content[0]}</p>}</div>

    {isBoard && <section className="space-y-5 border-t border-eflavSinir pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-black">Yönetim Kurulu Üyeleri</h2><p className="mt-1 text-sm text-eflavMetinAcik">Kartların sırası aşağıdaki sıraya göre belirlenir.</p></div><Button type="button" variant="outline" onClick={addMember}>Üye Ekle</Button></div>
      {form.members.map((member, index) => <Card key={index} hover={false} className="space-y-4 bg-eflavKrem/40">
        <div className="flex items-center justify-between"><h3 className="font-black">Üye {index + 1}</h3><button type="button" onClick={() => removeMember(index)} className="text-sm font-bold text-red-700">Üyeyi Kaldır</button></div>
        <div className="grid gap-4 md:grid-cols-2"><div><label className="block text-sm font-semibold">Ad Soyad</label><input value={member.fullName} onChange={(event) => updateMember(index, 'fullName', event.target.value)} className={cls}/></div><div><label className="block text-sm font-semibold">Görevi</label><input value={member.roleTitle} onChange={(event) => updateMember(index, 'roleTitle', event.target.value)} className={cls}/></div></div>
        <ImageDropzone label={`${member.fullName || `Üye ${index + 1}`} Fotoğrafı`} value={member.imageUrl} onChange={(imageUrl) => updateMember(index, 'imageUrl', imageUrl)}/>
        <div><label className="block text-sm font-semibold">Fotoğraf açıklaması</label><input value={member.imageAlt} onChange={(event) => updateMember(index, 'imageAlt', event.target.value)} className={cls} placeholder={member.fullName}/></div>
      </Card>)}
      {!form.members.length && <p className="rounded-xl border border-dashed border-eflavSinir p-6 text-center text-eflavMetinAcik">Henüz yönetim kurulu üyesi eklenmedi.</p>}
      {errors.members && <p className="text-sm text-red-700">Yönetim kurulu bilgilerinde eksik veya geçersiz alan var.</p>}
    </section>}

    {message && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{message}</p>}
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button href="/admin/kurumsal-sayfalar" variant="ghost">Vazgeç</Button><Button type="submit" disabled={busy}>{busy ? 'Kaydediliyor...' : 'Kaydet'}</Button></div>
  </form></Card>;
}
