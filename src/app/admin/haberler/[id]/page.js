import { notFound } from 'next/navigation';

import DeleteNewsButton from '@/components/admin/DeleteNewsButton';
import NewsForm from '@/components/admin/NewsForm';
import { requireAdminPage } from '@/lib/admin-session';
import { getNewsById } from '@/lib/services/news.service';

export default async function EditNewsPage({ params }) {
  const admin = await requireAdminPage();
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const newsId = Number(id);

  if (!Number.isSafeInteger(newsId) || newsId < 1) {
    notFound();
  }

  const news = await getNewsById(newsId);

  if (!news) {
    notFound();
  }

  const initialData = {
    title: news.title,
    slug: news.slug,
    summary: news.summary,
    content: news.content,
    category: news.category,
    imageUrl: news.image_url || '',
    imageAlt: news.image_alt || '',
    isFeatured: Boolean(news.is_featured),
    status: news.status,
    publishedAt: news.published_at
      ? new Date(news.published_at).toISOString()
      : null,
  };

  return (
    <section className="mx-auto max-w-4xl" aria-labelledby="edit-news-title">
      <div className="mb-8">
        <h1 id="edit-news-title" className="text-3xl font-black text-eflavAntrasit">
          Haberi Düzenle
        </h1>
        <p className="mt-2 text-eflavMetinAcik">
          Haber bilgilerini güncelleyin ve değişiklikleri kaydedin.
        </p>
      </div>

      <NewsForm mode="edit" newsId={newsId} initialData={initialData} />
      {admin.role === 'admin' && <DeleteNewsButton newsId={newsId} newsTitle={news.title} />}
    </section>
  );
}
