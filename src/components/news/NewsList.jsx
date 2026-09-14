'use client';

import { useMemo, useState } from 'react';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import OptimizedImage from '@/components/ui/OptimizedImage';

const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function NewsList({ news }) {
  const [searchTerm, setSearchTerm] = useState('');
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase('tr-TR');
  const filteredNews = useMemo(
    () =>
      news.filter((item) =>
        `${item.title} ${item.summary}`
          .toLocaleLowerCase('tr-TR')
          .includes(normalizedSearch)
      ),
    [news, normalizedSearch]
  );

  return (
    <>
      <div className="mx-auto mb-12 max-w-md">
        <label htmlFor="news-search" className="sr-only">
          Haberlerde ara
        </label>
        <input
          id="news-search"
          type="search"
          placeholder="Haberlerde ara..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-xl border border-eflavSinir bg-white px-5 py-3 text-sm text-eflavAntrasit shadow-sm outline-none focus:border-eflavBordo focus:ring-2 focus:ring-eflavBordo/20"
        />
        {normalizedSearch && (
          <p aria-live="polite" className="mt-2 text-center text-xs text-eflavMetinAcik">
            “{searchTerm.trim()}” araması için {filteredNews.length} sonuç bulundu.
          </p>
        )}
      </div>

      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((item) => (
            <Card key={item.id} padding="none" className="flex h-full flex-col overflow-hidden">
              <div className="relative h-52 w-full bg-gray-100">
                <OptimizedImage
                  src={item.imageUrl}
                  alt={item.imageAlt || item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="/images/logo/eflanilogo.png"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <time
                  dateTime={item.publishedAt}
                  className="mb-2 block text-xs font-semibold uppercase tracking-wider text-eflavAltin"
                >
                  {dateFormatter.format(new Date(item.publishedAt))}
                </time>
                <h2 className="mb-3 line-clamp-2 text-lg font-bold text-eflavAntrasit">
                  {item.title}
                </h2>
                <p className="mb-6 line-clamp-3 flex-1 text-sm leading-relaxed text-eflavMetinAcik">
                  {item.summary}
                </p>
                <div className="mt-auto border-t border-eflavSinir pt-4">
                  <Button href={`/haberler/${item.slug}`} variant="text" size="sm">
                    Devamını Oku →
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card hover={false} className="mx-auto max-w-md text-center">
          <h2 className="font-bold text-eflavAntrasit">Haber bulunamadı</h2>
          <p className="mt-2 text-sm text-eflavMetinAcik">
            Arama ölçütlerinizi değiştirerek tekrar deneyebilirsiniz.
          </p>
        </Card>
      )}
    </>
  );
}
