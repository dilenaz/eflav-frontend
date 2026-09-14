'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ImageDropzone from '@/components/admin/ImageDropzone';
import { adminRequest } from '@/lib/admin-api-client';

function createSlug(value) {
  return value
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  content: '',
  category: 'Vakıf Haberleri',
  imageUrl: '',
  imageAlt: '',
  isFeatured: false,
  status: 'draft',
  publishedAt: null,
};

function FieldError({ id, errors }) {
  if (!errors?.length) {
    return null;
  }

  return (
    <p id={id} className="mt-2 text-sm text-red-600">
      {errors[0]}
    </p>
  );
}

export default function NewsForm({ mode = 'create', newsId, initialData }) {
  const router = useRouter();
  const isEdit = mode === 'edit';
  const [form, setForm] = useState({ ...emptyForm, ...initialData });
  const [slugEdited, setSlugEdited] = useState(isEdit);
  const [fieldErrors, setFieldErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearFieldError(name) {
    setFieldErrors((current) => ({ ...current, [name]: undefined }));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setForm((current) => ({
      ...current,
      [name]: fieldValue,
      ...(name === 'title' && !slugEdited
        ? { slug: createSlug(value) }
        : {}),
    }));
    clearFieldError(name);
  }

  function handleSlugChange(event) {
    setSlugEdited(true);
    setForm((current) => ({
      ...current,
      slug: createSlug(event.target.value),
    }));
    clearFieldError('slug');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setFieldErrors({});

    try {
      await adminRequest(
        isEdit ? `/api/admin/news/${newsId}` : '/api/admin/news',
        {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            imageUrl: form.imageUrl.trim() || null,
            imageAlt: form.imageAlt.trim() || null,
            publishedAt:
              form.status === 'published'
                ? form.publishedAt || new Date().toISOString()
                : null,
          }),
        },
        'Haber kaydedilemedi.'
      );

      router.push('/admin/haberler');
      router.refresh();
    } catch (error) {
      setMessage(error.message);
      setFieldErrors(error.errors || {});
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    'w-full rounded-xl border border-eflavSinir bg-white px-4 py-3 outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20';

  return (
    <Card hover={false}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-semibold">
            Haber Başlığı
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={5}
            maxLength={255}
            value={form.title}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.title)}
            aria-describedby={fieldErrors.title ? 'title-error' : undefined}
            className={inputClassName}
          />
          <FieldError id="title-error" errors={fieldErrors.title} />
        </div>

        <div>
          <label htmlFor="slug" className="mb-2 block text-sm font-semibold">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            type="text"
            required
            minLength={3}
            maxLength={255}
            value={form.slug}
            onChange={handleSlugChange}
            aria-invalid={Boolean(fieldErrors.slug)}
            aria-describedby={fieldErrors.slug ? 'slug-error' : 'slug-help'}
            className={inputClassName}
          />
          <p id="slug-help" className="mt-2 text-xs text-eflavMetinAcik">
            URL’de kullanılacak benzersiz haber adresidir.
          </p>
          <FieldError id="slug-error" errors={fieldErrors.slug} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="category" className="mb-2 block text-sm font-semibold">
              Kategori
            </label>
            <input
              id="category"
              name="category"
              type="text"
              required
              minLength={2}
              maxLength={100}
              value={form.category}
              onChange={handleChange}
              aria-invalid={Boolean(fieldErrors.category)}
              aria-describedby={fieldErrors.category ? 'category-error' : undefined}
              className={inputClassName}
            />
            <FieldError id="category-error" errors={fieldErrors.category} />
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-semibold">
              Yayın Durumu
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={inputClassName}
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
              <option value="archived">Arşivlendi</option>
            </select>
          </div>
        </div>

        <div>
          <ImageDropzone
            label="Kapak Görseli"
            value={form.imageUrl}
            onChange={(imageUrl) => {
              setForm((current) => ({ ...current, imageUrl }));
              clearFieldError('imageUrl');
            }}
          />
          <FieldError id="image-url-error" errors={fieldErrors.imageUrl} />
        </div>

        <div>
          <label htmlFor="imageAlt" className="mb-2 block text-sm font-semibold">
            Görsel Açıklaması
          </label>
          <input
            id="imageAlt"
            name="imageAlt"
            type="text"
            maxLength={255}
            value={form.imageAlt}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.imageAlt)}
            aria-describedby={fieldErrors.imageAlt ? 'image-alt-error' : undefined}
            className={inputClassName}
          />
          <FieldError id="image-alt-error" errors={fieldErrors.imageAlt} />
        </div>

        <div>
          <label htmlFor="summary" className="mb-2 block text-sm font-semibold">
            Kısa Özet
          </label>
          <textarea
            id="summary"
            name="summary"
            rows={4}
            required
            minLength={10}
            maxLength={500}
            value={form.summary}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.summary)}
            aria-describedby={fieldErrors.summary ? 'summary-error' : 'summary-count'}
            className={`${inputClassName} resize-y`}
          />
          <div className="mt-2 flex items-start justify-between gap-4">
            <FieldError id="summary-error" errors={fieldErrors.summary} />
            <p id="summary-count" className="ml-auto text-xs text-eflavMetinAcik">
              {form.summary.length}/500
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="mb-2 block text-sm font-semibold">
            Haber İçeriği
          </label>
          <textarea
            id="content"
            name="content"
            rows={14}
            required
            minLength={20}
            value={form.content}
            onChange={handleChange}
            aria-invalid={Boolean(fieldErrors.content)}
            aria-describedby={fieldErrors.content ? 'content-error' : undefined}
            className={`${inputClassName} resize-y`}
          />
          <FieldError id="content-error" errors={fieldErrors.content} />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-eflavSinir p-4">
          <input
            name="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={handleChange}
            className="mt-1 h-4 w-4 accent-eflavBordo"
          />
          <span>
            <span className="block font-semibold text-eflavAntrasit">
              Öne çıkan haber
            </span>
            <span className="mt-1 block text-sm text-eflavMetinAcik">
              Haber ana sayfada öne çıkarılmış içerik olarak gösterilir.
            </span>
          </span>
        </label>

        {message && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {message}
          </div>
        )}

        <div className="flex flex-col-reverse gap-4 border-t border-eflavSinir pt-6 sm:flex-row sm:justify-end">
          <Button href="/admin/haberler" variant="outline">
            Vazgeç
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Kaydediliyor...'
              : isEdit
                ? 'Değişiklikleri Kaydet'
                : 'Haberi Kaydet'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
