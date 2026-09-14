import NewsForm from '@/components/admin/NewsForm';

export default function NewNewsPage() {
  return (
    <section className="mx-auto max-w-4xl" aria-labelledby="new-news-title">
      <div className="mb-8">
        <h1 id="new-news-title" className="text-3xl font-black text-eflavAntrasit">
          Yeni Haber Oluştur
        </h1>
        <p className="mt-2 text-eflavMetinAcik">
          Yayınlanacak haber bilgilerini giriniz.
        </p>
      </div>

      <NewsForm />
    </section>
  );
}
