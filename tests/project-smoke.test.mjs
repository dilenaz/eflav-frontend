import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const fromRoot = (...parts) => path.join(root, ...parts);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));
  return files.flat();
}

test('kritik production dosyaları mevcut', async () => {
  const required = [
    '.env.example',
    'src/proxy.js',
    'src/app/api/applications/route.js',
    'src/app/api/contact/route.js',
    'src/app/api/admin/logout/route.js',
    'scripts/create-admin.js',
    'src/app/api/admin/uploads/route.js',
    'src/components/admin/ImageDropzone.jsx',
    'src/components/admin/GalleryImagesDropzone.jsx',
    'scripts/check-production.js',
    'scripts/setup-local-windows.ps1',
    'DEPLOYMENT.md',
    'deploy/nginx.conf.example',
    'deploy/eflav.service.example',
  ];
  await Promise.all(required.map((file) => access(fromRoot(file))));
});

test('Windows yerel kurulum aracı MySQL, migration ve doğrulama adımlarını içeriyor', async () => {
  const source = await readFile(fromRoot('scripts/setup-local-windows.ps1'), 'utf8');
  assert.match(source, /WindowsBuiltInRole.*Administrator/);
  assert.match(source, /Test-NetConnection/);
  assert.match(source, /Start-Service -Name 'MySQL80'/);
  assert.match(source, /run db:migrate/);
  assert.match(source, /run verify/);
});

test('kaynak kodda standart img etiketi kullanılmıyor', async () => {
  const files = (await walk(fromRoot('src'))).filter((file) => /\.(js|jsx)$/.test(file));
  const violations = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    if (/<img\b/i.test(source)) violations.push(path.relative(root, file));
  }
  assert.deepEqual(violations, []);
});

test('production test-db rotası ve varsayılan parola scripti bulunmuyor', async () => {
  await assert.rejects(access(fromRoot('src/app/api/test-db/route.js')));
  await assert.rejects(access(fromRoot('scripts/hash-password.js')));
});

test('ilk yönetici aracı sabit parola içermiyor', async () => {
  const source = await readFile(fromRoot('scripts/create-admin.js'), 'utf8');
  assert.match(source, /INITIAL_ADMIN_PASSWORD/);
  assert.match(source, /bcrypt\.hash\(password, 12\)/);
  assert.doesNotMatch(source, /Admin123|password\s*=\s*['"]/);
});

test('migration dosyaları benzersiz ve sıralı', async () => {
  const files = (await readdir(fromRoot('migrations'))).filter((file) => file.endsWith('.sql')).sort();
  assert.ok(files.length >= 3);
  const prefixes = files.map((file) => file.split('_')[0]);
  assert.equal(new Set(prefixes).size, prefixes.length);
  assert.deepEqual(prefixes, [...prefixes].sort());
});

test('hassas environment değerleri örnek dosyada yer tutucu', async () => {
  const source = await readFile(fromRoot('.env.example'), 'utf8');
  assert.match(source, /JWT_SECRET=change-/);
  assert.match(source, /DATA_ENCRYPTION_KEY=change-/);
  assert.doesNotMatch(source, /Admin123/);
});

test('yönetim paneli build sırasında veritabanına bağlanmıyor', async () => {
  const source = await readFile(fromRoot('src/app/admin/layout.js'), 'utf8');
  assert.match(source, /export const dynamic = ['"]force-dynamic['"]/);
});

test('dinamik sitemap build sırasında veritabanına bağlanmıyor', async () => {
  const source = await readFile(fromRoot('src/app/sitemap.js'), 'utf8');
  assert.match(source, /export const dynamic = ['"]force-dynamic['"]/);
});

test('admin girişi veritabanı kesintisini servis dışı olarak bildiriyor', async () => {
  const source = await readFile(fromRoot('src/app/api/admin/login/route.js'), 'utf8');
  assert.match(source, /isDatabaseUnavailableError/);
  assert.match(source, /status: 503/);
  assert.match(source, /Retry-After/);
});

test('production kontrolü gerçek MySQL bağlantısını ve yer tutucuları denetliyor', async () => {
  const source = await readFile(fromRoot('scripts/check-production.js'), 'utf8');
  assert.match(source, /mysql\.createConnection/);
  assert.match(source, /SELECT 1/);
  assert.match(source, /isPlaceholder/);
  assert.match(source, /connectTimeout: 5000/);
});

test('production formları Turnstile tokenı gönderiyor ve CSP gerekli kaynağa izin veriyor', async () => {
  const files = [
    'src/components/applications/ApplicationForm.jsx',
    'src/app/iletisim/page.js',
  ];
  for (const file of files) {
    const source = await readFile(fromRoot(file), 'utf8');
    assert.match(source, /TurnstileWidget/);
    assert.match(source, /captchaToken/);
  }
  const config = await readFile(fromRoot('next.config.mjs'), 'utf8');
  assert.match(config, /frame-src https:\/\/challenges\.cloudflare\.com/);
});

test('canlı ortam güvenlik kontrolleri sessizce devre dışı kalmıyor', async () => {
  const botProtection = await readFile(fromRoot('src/lib/bot-protection.js'), 'utf8');
  assert.match(botProtection, /NODE_ENV === 'production'/);
  assert.match(botProtection, /status|503/);

  const login = await readFile(fromRoot('src/app/api/admin/login/route.js'), 'utf8');
  assert.match(login, /validateRequestOrigin/);
  assert.match(login, /parseJsonBody\(request, 2_000\)/);
});

test('localhost yanıtları yalnızca HTTPS için geçerli başlıkları almıyor', async () => {
  const config = await readFile(fromRoot('next.config.mjs'), 'utf8');
  assert.match(config, /isProduction \? \["upgrade-insecure-requests"\] : \[\]/);
  assert.match(config, /isProduction \? \[\{ key: 'Strict-Transport-Security'/);
  assert.match(config, /poweredByHeader: false/);
});

test('veritabanı kesintisinde halka açık içerik ve formlar kontrollü çalışıyor', async () => {
  await access(fromRoot('src/data/fallback-content.js'));
  await access(fromRoot('src/components/ui/DataUnavailable.jsx'));

  const homepage = await readFile(fromRoot('src/app/page.js'), 'utf8');
  assert.match(homepage, /getFallbackContentPage/);

  for (const file of [
    'src/app/api/contact/route.js',
    'src/app/api/applications/route.js',
    'src/app/api/donations/route.js',
  ]) {
    const source = await readFile(fromRoot(file), 'utf8');
    assert.match(source, /isDatabaseUnavailableError/);
    assert.match(source, /status:503/);
    assert.match(source, /Retry-After/);
  }
});

test('upload ve health kontrolleri kalıcı UPLOAD_DIR dizinini kullanıyor', async () => {
  for (const file of ['src/app/api/admin/uploads/route.js', 'src/app/api/health/route.js']) {
    const source = await readFile(fromRoot(file), 'utf8');
    assert.match(source, /process\.env\.UPLOAD_DIR/);
  }
});

test('denetim kaydı hatası tamamlanmış yönetim işlemini başarısız göstermiyor', async () => {
  const source = await readFile(fromRoot('src/lib/services/audit.service.js'), 'utf8');
  assert.match(source, /catch \(error\)/);
  assert.match(source, /return false/);
});

test('genel layout iç içe main üretmiyor ve admin alanında site kabuğu gizleniyor', async () => {
  const layout = await readFile(fromRoot('src/app/layout.js'), 'utf8');
  const chrome = await readFile(fromRoot('src/components/SiteChrome.jsx'), 'utf8');
  assert.doesNotMatch(layout, /<main/);
  assert.match(chrome, /pathname\.startsWith\('\/admin\/'\)/);
  assert.match(chrome, /if \(isAdmin\) return children/);
});

test('teyitli telefon, e-posta, resmî adres ve iletişim formu kullanılıyor', async () => {
  const contact = await readFile(fromRoot('src/app/iletisim/page.js'), 'utf8');
  const footer = await readFile(fromRoot('src/components/Footer.jsx'), 'utf8');
  for (const source of [contact, footer]) {
    assert.match(source, /Pelitli Mahallesi, Mollafenari Caddesi No:86/);
    assert.match(source, /\+905453790306/);
    assert.match(source, /karabukeflanivakfi@gmail\.com/);
  }
  assert.match(contact, /TurnstileWidget/);
  assert.match(footer, /href="\/iletisim"/);
});

test('resmî vakıf kimliği, tarihçesi ve sosyal medya bağlantıları kullanılıyor', async () => {
  const fallback = await readFile(fromRoot('src/data/fallback-content.js'), 'utf8');
  const footer = await readFile(fromRoot('src/components/Footer.jsx'), 'utf8');
  const structuredData = await readFile(fromRoot('src/components/seo/OrganizationJsonLd.jsx'), 'utf8');
  const migration = await readFile(fromRoot('migrations/015_official_foundation_content.sql'), 'utf8');

  for (const source of [fallback, footer, structuredData, migration]) {
    assert.match(source, /Karabük Eflani Hayır Kervanı Vakfı/);
  }
  assert.match(fallback, /11 Ekim 2023/);
  assert.match(migration, /Pelitli Mahallesi, Mollafenari Caddesi No:86/);
  assert.match(footer, /instagram\.com\/karabukeflanivakfi/);
  assert.match(footer, /facebook\.com\/people\/Karab%C3%BCk-Eflani-Vakf%C4%B1\/100089528226678/);
});

test('ana sayfa kurumsal mesajı ve resmî faaliyet alanlarını gösteriyor', async () => {
  const about = await readFile(fromRoot('src/components/AboutPreview.jsx'), 'utf8');
  const hero = await readFile(fromRoot('src/components/Hero.jsx'), 'utf8');
  const fallback = await readFile(fromRoot('src/data/fallback-content.js'), 'utf8');
  const globalCss = await readFile(fromRoot('src/app/globals.css'), 'utf8');
  assert.match(about, /Kurumsal Mesaj/);
  assert.match(about, /getCorporateMessage/);
  assert.match(fallback, /İyilik, paylaşıldıkça büyüyen en değerli mirastır/);
  assert.match(hero, /hero-poster__quote-mark/);
  assert.match(hero, /hero-poster__quote-text/);
  assert.match(globalCss, /\.hero-poster__quote-mark\s*\{[^}]*display:\s*block/s);
  assert.doesNotMatch(globalCss, /\.hero-poster__quote-mark\s*\{[^}]*position:\s*absolute/s);
  for (const area of ['Eğitim', 'Sosyal yardım', 'Sağlık', 'Kültürel miras', 'Toplumsal kalkınma']) {
    assert.match(`${hero}\n${about}`, new RegExp(area, 'i'));
  }
});

test('halka açık sitede burs hizmeti veya doğrulanmamış sayısal iddia yer almıyor', async () => {
  const publicSources = [
    'src/app/basvurular/page.js',
    'src/app/hakkimizda/[slug]/page.js',
    'src/app/layout.js',
    'src/app/manifest.js',
    'src/components/AboutPreview.jsx',
    'src/components/ApplicationSection.jsx',
    'src/data/fallback-content.js',
  ];

  for (const file of publicSources) {
    const source = await readFile(fromRoot(file), 'utf8');
    assert.doesNotMatch(source, /burs(?:iyer)?/i);
  }

  await assert.rejects(access(fromRoot('src/app/basvurular/burs/page.js')));
  const schema = await readFile(fromRoot('src/lib/validations/application.schema.js'), 'utf8');
  assert.match(schema, /applicationType:\s*z\.literal\('yardim'\)/);
  const correction = await readFile(fromRoot('migrations/017_remove_scholarship_claims.sql'), 'utf8');
  assert.doesNotMatch(correction, /burs(?:iyer)?/i);
});

test('doğrulanmamış örnek içerikler arşivleniyor ve kaynaklı faaliyetler yayımlanıyor', async () => {
  const migration = await readFile(fromRoot('migrations/016_verified_public_content.sql'), 'utf8');
  const instagramMigration = await readFile(fromRoot('migrations/018_instagram_verified_activities.sql'), 'utf8');
  const detail = await readFile(fromRoot('src/app/faaliyetler/[slug]/page.js'), 'utf8');
  for (const slug of [
    'olagan-mutevelli-heyeti-toplantisi',
    'eflani-genclik-bulusmasi-ve-piknigi',
    'vakif-merkezi-acilis-toreni',
    'egitim-ve-burs',
  ]) {
    assert.match(migration, new RegExp(slug));
  }
  for (const activity of ['vakiflar-haftasi-programina-katilim', 'ankara-karabukluler-vakfi-ziyareti']) {
    assert.match(migration, new RegExp(activity));
  }
  assert.match(migration, /source_label/);
  assert.match(migration, /source_url/);
  assert.match(detail, /Kaynak ve doğrulama/);
  await access(fromRoot('public/images/activities/vakiflar-haftasi-programi.jpg'));
  await access(fromRoot('public/images/activities/vakiflar-haftasi-ankara.jpg'));
  for (const activity of ['karabuk-universitesi-istisare-toplantisi', 'kocaeli-derneklerinden-vakfimiza-ziyaret']) {
    assert.match(instagramMigration, new RegExp(activity));
  }
  assert.match(instagramMigration, /instagram\.com\/karabukeflanivakfi/);
  await access(fromRoot('public/images/activities/karabuk-universitesi-istisare-toplantisi.jpg'));
  await access(fromRoot('public/images/activities/kocaeli-dernekleri-vakif-ziyareti.jpg'));
});

test('paylaşılan yönetim ve danışmanlık kadrosu fotoğraflarıyla tanımlı', async () => {
  const migration = await readFile(fromRoot('migrations/015_official_foundation_content.sql'), 'utf8');
  const expected = [
    ['seref-karakaya.png', 'Şeref Karakaya'],
    ['cihan-bodur.png', 'Cihan Bodur'],
    ['necdet-unal.png', 'Necdet Ünal'],
    ['yuksel-keles.png', 'Yüksel Keleş'],
    ['yasar-kilic.png', 'Yaşar Kılıç'],
    ['burhan-ozdamar.png', 'Burhan Özdamar'],
    ['fatih-kocaturk.png', 'Fatih Kocatürk'],
  ];

  for (const [image, name] of expected) {
    await access(fromRoot('public', 'images', 'board', image));
    assert.match(migration, new RegExp(name));
    assert.match(migration, new RegExp(image.replace('.', '\\.')));
  }
});

test('halka açık sayfalar yanlış ana sayfa canonical adresini miras almıyor', async () => {
  const rootLayout = await readFile(fromRoot('src/app/layout.js'), 'utf8');
  assert.doesNotMatch(rootLayout, /canonical:\s*["']\/["']/);

  const canonicalFiles = [
    ['src/app/page.js', '/'],
    ['src/app/haberler/page.js', '/haberler'],
    ['src/app/etkinlikler/page.js', '/etkinlikler'],
    ['src/app/faaliyetler/page.js', '/faaliyetler'],
    ['src/app/fotograf-albumu/page.js', '/fotograf-albumu'],
    ['src/app/basvurular/page.js', '/basvurular'],
    ['src/app/iletisim/layout.js', '/iletisim'],
    ['src/app/bagis/page.js', '/bagis'],
  ];
  for (const [file, canonical] of canonicalFiles) {
    const source = await readFile(fromRoot(file), 'utf8');
    assert.match(source, new RegExp(`canonical:\\s*["']${canonical.replaceAll('/', '\\/')}["']`));
  }
});

test('gönüllülük sayfası çalışan ve korunan bir başvuru akışı sunuyor', async () => {
  const source = await readFile(fromRoot('src/app/basvurular/gonullu-ol/page.js'), 'utf8');
  assert.match(source, /fetch\(['"]\/api\/contact['"]/);
  assert.match(source, /TurnstileWidget/);
  assert.match(source, /captchaToken/);
  assert.match(source, /KVKK Aydınlatma Metni/);
  assert.doesNotMatch(source, /çok yakında dijital/);
});

test('klavye ve hareket hassasiyeti için temel erişilebilirlik önlemleri mevcut', async () => {
  const chrome = await readFile(fromRoot('src/components/SiteChrome.jsx'), 'utf8');
  const styles = await readFile(fromRoot('src/app/globals.css'), 'utf8');
  assert.match(chrome, /href="#ana-icerik"/);
  assert.match(chrome, /id="ana-icerik"/);
  assert.match(styles, /prefers-reduced-motion:\s*reduce/);
});

test('production kontrolü ve servis örneği yer tutucu secret ve işletim sistemi sınırlarını denetliyor', async () => {
  const productionCheck = await readFile(fromRoot('scripts/check-production.js'), 'utf8');
  const service = await readFile(fromRoot('deploy/eflav.service.example'), 'utf8');
  assert.match(productionCheck, /DB_PASSWORD yer tutucu/);
  assert.match(productionCheck, /TURNSTILE_SECRET_KEY/);
  assert.match(productionCheck, /ADMIN_NOTIFICATION_WEBHOOK_URL HTTPS/);
  assert.match(service, /ProtectSystem=strict/);
  assert.match(service, /ReadWritePaths=/);
  assert.match(service, /CapabilityBoundingSet=/);
});

test('teyitli banka bilgileri halka açık sayfada, kayıt altyapısı korunmuş', async () => {
  const form = await readFile(fromRoot('src/components/DonationSection.jsx'), 'utf8');
  const route = await readFile(fromRoot('src/app/api/donations/route.js'), 'utf8');
  const migration = await readFile(fromRoot('migrations/014_donation_reconciliation.sql'), 'utf8');

  for (const field of ['senderName', 'transferDate']) {
    assert.match(route, new RegExp(field));
  }
  assert.match(migration, /sender_name/);
  assert.match(migration, /transfer_date/);
  assert.match(form, /TR66 0001 0026 2997 8393 0750 01/);
  assert.match(form, /Ziraat Bankası/);
});

test('yönetici oturum çerezi gereksiz kişisel veri taşımıyor ve yüksek öncelikli', async () => {
  const source = await readFile(fromRoot('src/lib/auth.js'), 'utf8');
  assert.doesNotMatch(source, /fullName:\s*admin\./);
  assert.doesNotMatch(source, /email:\s*admin\./);
  assert.match(source, /priority:\s*['"]high['"]/);
});

test('istemci IP adresi sahte forwarding başlıklarıyla kolayca değiştirilemiyor', async () => {
  const security = await readFile(fromRoot('src/lib/api-security.js'), 'utf8');
  const login = await readFile(fromRoot('src/app/api/admin/login/route.js'), 'utf8');
  const nginx = await readFile(fromRoot('deploy/nginx.conf.example'), 'utf8');
  assert.match(security, /export function getClientIp/);
  assert.match(security, /\.at\(-1\)/);
  assert.match(login, /getClientIp\(request\)/);
  assert.match(nginx, /X-Forwarded-For \$remote_addr/);
  assert.doesNotMatch(nginx, /\$proxy_add_x_forwarded_for/);
});

test('ana liste ve form sayfaları tekil birinci seviye başlık tanımlıyor', async () => {
  for (const file of [
    'src/app/bagis/page.js',
    'src/app/haberler/page.js',
    'src/app/iletisim/page.js',
    'src/app/etkinlikler/page.js',
    'src/app/faaliyetler/page.js',
    'src/app/fotograf-albumu/page.js',
  ]) {
    const source = await readFile(fromRoot(file), 'utf8');
    assert.match(source, /titleAs=["']h1["']/);
  }
});

test('ana sayfa son üç içeriği ve faaliyet arşivi görsel kartları kullanıyor', async () => {
  const activities = await readFile(fromRoot('src/components/activities/ActivitiesSection.jsx'), 'utf8');
  const newsService = await readFile(fromRoot('src/lib/services/news.service.js'), 'utf8');
  const gallery = await readFile(fromRoot('src/components/GalleryPreview.jsx'), 'utf8');
  const archive = await readFile(fromRoot('src/app/faaliyetler/page.js'), 'utf8');
  const deed = await readFile(fromRoot('src/app/hakkimizda/[slug]/page.js'), 'utf8');

  assert.match(activities, /getPublishedActivities\(3\)/);
  assert.match(newsService, /ORDER BY published_at DESC, id DESC\s+LIMIT \$\{safeLimit\}/);
  assert.match(gallery, /slice\(0,3\)/);
  assert.match(archive, /OptimizedImage/);
  assert.match(archive, /fallbackSrc="\/images\/logo\/eflanilogo\.png"/);
  assert.doesNotMatch(archive, /item\.icon/);
  assert.doesNotMatch(deed, /senet fotoğrafı yayımlanmamaktadır/);
});

test('yönetim paneli tam gezinme, güvenli istek ve isteğe bağlı alan davranışı sunuyor', async () => {
  const layout = await readFile(fromRoot('src/app/admin/layout.js'), 'utf8');
  const activityForm = await readFile(fromRoot('src/components/admin/ActivityForm.jsx'), 'utf8');
  const eventForm = await readFile(fromRoot('src/components/admin/EventForm.jsx'), 'utf8');
  const galleryForm = await readFile(fromRoot('src/components/admin/GalleryForm.jsx'), 'utf8');
  const adminClient = await readFile(fromRoot('src/lib/admin-api-client.js'), 'utf8');

  for (const destination of ['/admin/bagislar', '/admin/basvurular', '/admin/haberler', '/admin/faaliyetler', '/admin/galeri', '/admin/iletisim']) {
    assert.match(layout, new RegExp(destination.replaceAll('/', '\\/')));
  }
  assert.doesNotMatch(layout, /\/admin\/etkinlikler/);
  assert.match(layout, /overflow-x-auto/);
  assert.match(adminClient, /response\.status === 401/);
  assert.match(adminClient, /session-expired/);
  assert.match(activityForm, /icon: null/);
  assert.match(activityForm, /required = false/);
  assert.match(activityForm, /textField\('imageAlt'/);
  assert.match(eventForm, /eventTime'.*required:false/s);
  assert.match(eventForm, /imageAlt'.*required:false/s);
  assert.match(galleryForm, /canDelete/);
});

test('ana sayfa kurumsal metinleri yönetilen içeriklerle aynı kaynaktan alıyor ve etkinlikleri göstermiyor', async () => {
  const homepage = await readFile(fromRoot('src/app/page.js'), 'utf8');
  const hero = await readFile(fromRoot('src/components/Hero.jsx'), 'utf8');
  const about = await readFile(fromRoot('src/components/AboutPreview.jsx'), 'utf8');
  const sitemap = await readFile(fromRoot('src/app/sitemap.js'), 'utf8');
  const publicEventsLayout = await readFile(fromRoot('src/app/etkinlikler/layout.js'), 'utf8');

  assert.match(homepage, /getContentPagesBySlugs/);
  assert.match(homepage, /corporateContent=\{corporateContent\}/);
  assert.match(homepage, /AboutPreview page=\{corporateContent\['ana-sayfa-hakkinda'\]\}/);
  assert.doesNotMatch(homepage, /EventsSection/);
  assert.match(hero, /getCorporateMessage/);
  assert.match(hero, /missionVisionPage/);
  assert.match(about, /page\.title/);
  assert.doesNotMatch(sitemap, /getPublishedEvents|\/etkinlikler/);
  assert.match(publicEventsLayout, /permanentRedirect\('\/faaliyetler'\)/);
});
