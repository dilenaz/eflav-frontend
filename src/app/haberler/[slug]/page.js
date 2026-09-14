import { cache } from 'react';
import { notFound } from 'next/navigation';

import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';
import OptimizedImage from '@/components/ui/OptimizedImage';
import JsonLd, { breadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getPublishedNewsBySlug } from '@/lib/services/news.service';
import { isDatabaseUnavailableError } from '@/lib/db';
import DataUnavailable from '@/components/ui/DataUnavailable';

const getArticle = cache(async (slug) => {
  try { return { item: await getPublishedNewsBySlug(slug), unavailable: false }; }
  catch (error) {
    if (!isDatabaseUnavailableError(error)) throw error;
    return { item: null, unavailable: true };
  }
});
const dateFormatter = new Intl.DateTimeFormat('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function getValidDate(value) {
  const date = value ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime()) ? date : null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { item: article, unavailable } = await getArticle(slug);

  if (unavailable) return { title: 'Haberler Geçici Olarak Kullanılamıyor', robots: { index: false } };

  if (!article) {
    return {
      title: 'Haber Bulunamadı',
      robots: { index: false, follow: false },
    };
  }

  const images = article.image_url
    ? [{ url: article.image_url, alt: article.image_alt || article.title }]
    : undefined;

  return {
    title: article.title,
    description: article.summary,
    alternates: {
      canonical: `/haberler/${article.slug}`,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.summary,
      url: `/haberler/${article.slug}`,
      publishedTime: getValidDate(article.published_at)?.toISOString(),
      modifiedTime: getValidDate(article.updated_at)?.toISOString(),
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.image_url ? [article.image_url] : undefined,
    },
  };
}

export default async function NewsDetailPage({ params }) {
  const { slug } = await params;
  const { item: article, unavailable } = await getArticle(slug);

  if (unavailable) return <DataUnavailable title="Haber geçici olarak kullanılamıyor" backHref="/haberler" backLabel="Haberlere Dön" />;

  if (!article) {
    notFound();
  }

  const publishedDate = getValidDate(article.published_at);
  const modifiedDate = getValidDate(article.updated_at);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eflanihayirkervanivakfi.com';
  const articleUrl = `${baseUrl}/haberler/${article.slug}`;
  const articleJsonLd = {
    '@context':'https://schema.org', '@type':'NewsArticle', headline:article.title,
    description:article.summary, datePublished:publishedDate?.toISOString(),
    dateModified:modifiedDate?.toISOString() || publishedDate?.toISOString(),
    mainEntityOfPage:articleUrl,
    image:article.image_url ? [new URL(article.image_url, baseUrl).toString()] : undefined,
    author:{'@type':'Organization',name:'Karabük Eflani Hayır Kervanı Vakfı',url:baseUrl},
    publisher:{'@type':'Organization',name:'Karabük Eflani Hayır Kervanı Vakfı',url:baseUrl},
  };

  return (
    <main className="min-h-screen bg-eflavKrem py-16">
      <Container>
        <JsonLd data={articleJsonLd} />
        <JsonLd data={breadcrumbJsonLd([{name:'Ana Sayfa',url:baseUrl},{name:'Haberler',url:`${baseUrl}/haberler`},{name:article.title,url:articleUrl}])} />
        <Button href="/haberler" variant="ghost" className="mb-8">
          ← Haberlere Dön
        </Button>

        <article className="overflow-hidden rounded-3xl border border-eflavSinir bg-white shadow-sm">
          <div className="relative h-[320px] md:h-[520px]">
            <OptimizedImage
              src={article.image_url}
              alt={article.image_alt || article.title}
              fill
              priority
              sizes="100vw"
              fallbackSrc="/images/logo/eflanilogo.png"
            />
          </div>

          <div className="p-8 md:p-12">
            <span className="rounded-full bg-eflavAltin/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-eflavBordo">
              {article.category}
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight text-eflavAntrasit">
              {article.title}
            </h1>

            {publishedDate && (
              <time
                className="mt-4 block text-sm text-eflavMetinAcik"
                dateTime={publishedDate.toISOString()}
              >
                {dateFormatter.format(publishedDate)}
              </time>
            )}

            <p className="mt-8 text-lg leading-8 text-eflavMetin">
              {article.summary}
            </p>

            <div className="mt-10 border-t border-eflavSinir pt-10">
              <p className="whitespace-pre-line leading-8 text-eflavMetin">
                {article.content}
              </p>
            </div>
          </div>
        </article>
      </Container>
    </main>
  );
}
