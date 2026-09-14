import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { getAllNews } from '@/lib/services/news.service';

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const statusDetails = {
  draft: {
    label: 'Taslak',
    className: 'bg-amber-100 text-amber-800',
  },
  published: {
    label: 'Yayında',
    className: 'bg-emerald-100 text-emerald-800',
  },
  archived: {
    label: 'Arşivlendi',
    className: 'bg-slate-200 text-slate-700',
  },
};

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date);
}

function StatusBadge({ status }) {
  const details = statusDetails[status] ?? {
    label: 'Bilinmiyor',
    className: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${details.className}`}
    >
      {details.label}
    </span>
  );
}

export default async function AdminNewsPage() {
  let news = [];
  let hasError = false;

  try {
    news = await getAllNews();
  } catch (error) {
    hasError = true;
    console.error('Admin haber listesi yüklenemedi:', error);
  }

  return (
    <section aria-labelledby="admin-news-title">
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id="admin-news-title"
            className="text-3xl font-black text-eflavAntrasit"
          >
            Haber Yönetimi
          </h1>
          <p className="mt-2 text-eflavMetinAcik">
            Sistemde kayıtlı haberleri görüntüleyin ve yönetin.
          </p>
        </div>

        <Button href="/admin/haberler/yeni">Yeni Haber</Button>
      </div>

      {hasError ? (
        <Card hover={false}>
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
          >
            <h2 className="font-bold">Haberler yüklenemedi</h2>
            <p className="mt-1 text-sm">
              Haber kayıtlarına şu anda erişilemiyor. Lütfen daha sonra tekrar
              deneyin.
            </p>
          </div>
        </Card>
      ) : (
        <Card padding="none" hover={false}>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <caption className="sr-only">Sistemde kayıtlı haberler</caption>
              <thead className="bg-eflavKrem text-eflavAntrasit">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold">
                    Başlık
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold">
                    Kategori
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold">
                    Durum
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-bold">
                    Yayın Tarihi
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-bold">
                    İşlem
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-eflavSinir">
                {news.length > 0 ? (
                  news.map((item) => (
                    <tr key={item.id} className="text-eflavMetin">
                      <td className="px-6 py-5 font-semibold text-eflavAntrasit">
                        {item.title}
                      </td>
                      <td className="px-6 py-5">{item.category || '—'}</td>
                      <td className="px-6 py-5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        {formatDate(item.published_at)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Button
                          href={`/admin/haberler/${item.id}`}
                          variant="outline"
                          size="sm"
                          aria-label={`${item.title} haberini düzenle`}
                        >
                          Düzenle
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center">
                      <p className="font-semibold text-eflavAntrasit">
                        Henüz haber bulunmuyor.
                      </p>
                      <p className="mt-1 text-sm text-eflavMetinAcik">
                        İlk haber kaydını oluşturmak için “Yeni Haber” butonunu
                        kullanabilirsiniz.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </section>
  );
}
