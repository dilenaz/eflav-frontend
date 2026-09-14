import { getPublishedNews } from '@/lib/services/news.service';
import { getPublishedActivities } from '@/lib/services/activity.service';
import { getAllAlbums } from '@/lib/services/gallery.service';

// Dynamic entries come from MySQL, which may not be available in the build
// environment. Generate the sitemap against live data at request time.
export const dynamic = 'force-dynamic';

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://eflanihayirkervanivakfi.com').replace(/\/$/, '');

export default async function sitemap() {
  const staticRoutes = [
    '', '/haberler', '/faaliyetler', '/fotograf-albumu',
    '/basvurular', '/iletisim', '/bagis', '/kvkk', '/gizlilik-politikasi',
    '/hakkimizda/amac', '/hakkimizda/misyon-vizyon', '/hakkimizda/tarihce',
    '/hakkimizda/tuzuk', '/hakkimizda/yonetim-kurulu',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/haberler' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : route === '/haberler' ? 0.9 : 0.7,
  }));

  let newsRoutes = [];
  let contentRoutes = [];
  try {
    const news = await getPublishedNews();
    newsRoutes = news.map((item) => ({
      url: `${baseUrl}/haberler/${item.slug}`,
      lastModified: item.published_at || new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap haberleri alınamadı:', error);
  }

  try {
    const [activities, albums] = await Promise.all([getPublishedActivities(), getAllAlbums(true)]);
    contentRoutes = [
      ...activities.map((item) => ({ url: `${baseUrl}/faaliyetler/${item.slug}`, lastModified: item.updated_at, changeFrequency: 'monthly', priority: 0.8 })),
      ...albums.map((item) => ({ url: `${baseUrl}/fotograf-albumu/${item.slug}`, lastModified: item.updated_at, changeFrequency: 'monthly', priority: 0.7 })),
    ];
  } catch (error) {
    console.error('Sitemap içerikleri alınamadı:', error);
  }

  return [...staticRoutes, ...newsRoutes, ...contentRoutes];
}
