import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SiteTextsForm from '@/components/admin/SiteTextsForm';
import { getContentPages } from '@/lib/services/content-page.service';
import { getSiteTexts } from '@/lib/services/site-text.service';

const dateFormatter = new Intl.DateTimeFormat('tr-TR', { dateStyle:'medium', timeStyle:'short' });

const pageDescriptions = {
  'ana-sayfa-hakkinda': 'Ana sayfada ziyaretçilere gösterilen vakıf tanıtımı.',
  amac: 'Vakfın kuruluş amacı ve çalışma yaklaşımı.',
  'misyon-vizyon': 'Misyon, vizyon ve temel ilkeler.',
  tarihce: 'Vakfın kuruluş tarihi ve gelişim süreci.',
  'yonetim-kurulu': 'Yönetim kurulu, danışmanlar ve üye fotoğrafları.',
  tuzuk: 'Vakıf senedinin halka açık özeti.',
  'seref-karakaya': 'Yönetim Kurulu Başkanı profil sayfası.',
};

function ContentCard({ item }) {
  const publicHref = item.slug === 'ana-sayfa-hakkinda' ? '/' : `/hakkimizda/${item.slug}`;
  return <Card hover={false} className="flex h-full flex-col">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-eflavBordo">{item.slug === 'ana-sayfa-hakkinda' ? 'Ana Sayfa' : 'Hakkımızda'}</p>
        <h3 className="mt-2 text-xl font-black text-eflavAntrasit">{item.title}</h3>
      </div>
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">Yayında</span>
    </div>
    <p className="mt-3 text-sm leading-6 text-eflavMetinAcik">{pageDescriptions[item.slug] || item.summary}</p>
    <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{item.summary}</p>
    <p className="mt-5 text-xs text-eflavMetinAcik">Son güncelleme: {dateFormatter.format(new Date(item.updated_at))}</p>
    <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row">
      <Button href={`/admin/kurumsal-sayfalar/${item.id}`} size="sm" className="flex-1">Düzenle</Button>
      <Button href={publicHref} variant="outline" size="sm" target="_blank" className="flex-1">Sayfayı Gör</Button>
    </div>
  </Card>;
}

export default async function CorporateContentAdminPage() {
  const [items, siteTexts] = await Promise.all([getContentPages(), getSiteTexts()]);
  const homepageItems = items.filter((item) => item.slug === 'ana-sayfa-hakkinda');
  const aboutItems = items.filter((item) => item.slug !== 'ana-sayfa-hakkinda');

  return <section aria-labelledby="corporate-content-title">
    <div className="rounded-3xl bg-gradient-to-br from-eflavAntrasit to-[#0b4a34] p-7 text-white shadow-lg md:p-10">
      <p className="text-xs font-black uppercase tracking-[.2em] text-eflavAltin">İçerik Yönetimi</p>
      <h1 id="corporate-content-title" className="mt-3 text-3xl font-black md:text-4xl">Kurumsal İçerikler</h1>
      <p className="mt-3 max-w-3xl leading-7 text-white/75">Ana sayfa tanıtımını, vakıf bilgilerini ve yönetim kadrosunu tek yerden güncelleyin. Değişiklikleri kaydetmeden önce ilgili sayfanın içeriğini gözden geçirin.</p>
    </div>

    {homepageItems.length > 0 && <section className="mt-10" aria-labelledby="homepage-content-title">
      <div><h2 id="homepage-content-title" className="text-2xl font-black text-eflavAntrasit">Ana Sayfa İçeriği</h2><p className="mt-1 text-sm text-eflavMetinAcik">Ana sayfadaki vakıf tanıtım alanı.</p></div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">{homepageItems.map((item) => <ContentCard key={item.id} item={item}/>)}</div>
    </section>}

    <section className="mt-10" aria-labelledby="about-content-title">
      <div><h2 id="about-content-title" className="text-2xl font-black text-eflavAntrasit">Hakkımızda Sayfaları</h2><p className="mt-1 text-sm text-eflavMetinAcik">Ziyaretçilerin kurumsal menüden eriştiği içerikler.</p></div>
      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{aboutItems.map((item) => <ContentCard key={item.id} item={item}/>)}</div>
    </section>

    <section className="mt-12" aria-labelledby="site-texts-title">
      <div>
        <h2 id="site-texts-title" className="text-2xl font-black text-eflavAntrasit">Site ve Ana Sayfa Metinleri</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-eflavMetinAcik">Ana sayfadaki bölüm başlıklarını, tanıtım cümlelerini ve bağış bilgilerini anlaşılır gruplar halinde buradan yönetin. Yasal metinler ve işlem uyarıları güvenlik için uygulama içinde sabit tutulur.</p>
      </div>
      <SiteTextsForm initialItems={siteTexts} />
    </section>

    {!items.length && <Card hover={false} className="mt-8 text-center text-eflavMetinAcik">Düzenlenebilir kurumsal içerik bulunmuyor.</Card>}
  </section>;
}
