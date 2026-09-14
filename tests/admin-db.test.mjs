import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (...parts) => readFile(path.join(root, ...parts), 'utf8');

test('kişisel veri şifreleme ve maskeleme geri dönüşümlü çalışıyor', async () => {
  process.env.JWT_SECRET ||= 'test-only-jwt-secret-with-at-least-32-characters';
  process.env.DATA_ENCRYPTION_KEY ||= 'test-only-data-secret-with-at-least-32-characters';

  const {
    decryptPersonalData,
    encryptPersonalData,
    maskIdentityNumber,
  } = await import('../src/lib/personal-data.js');

  const encrypted = encryptPersonalData('12345678901');
  assert.notEqual(encrypted, '12345678901');
  assert.equal(decryptPersonalData(encrypted), '12345678901');
  assert.equal(maskIdentityNumber('12345678901'), '*******8901');
});

test('parola değişikliği bütün eski yönetici oturumlarını geçersiz kılıyor', async () => {
  const migration = await source('migrations', '019_admin_session_version.sql');
  const auth = await source('src', 'lib', 'auth.js');
  const session = await source('src', 'lib', 'admin-session.js');
  const passwordRoute = await source('src', 'app', 'api', 'admin', 'change-password', 'route.js');

  assert.match(migration, /session_version/);
  assert.match(auth, /sessionVersion:\s*Number\(admin\.session_version\)/);
  assert.match(session, /payload\.sessionVersion/);
  assert.match(passwordRoute, /session_version=session_version\+1/);
});

test('yönetici sayfaları canlı hesap doğrulamasını veri erişimine yakın yapıyor', async () => {
  const protectedSections = [
    'bagislar',
    'basvurular',
    'iletisim',
    'haberler',
    'faaliyetler',
    'galeri',
    'kurumsal-sayfalar',
    'parola',
  ];

  for (const section of protectedSections) {
    const layout = await source('src', 'app', 'admin', section, 'layout.js');
    assert.match(layout, /requireAdminPage/);
  }

  const eventsLayout = await source('src', 'app', 'admin', 'etkinlikler', 'layout.js');
  assert.match(eventsLayout, /permanentRedirect\('\/admin\/faaliyetler'\)/);

  const auditLayout = await source('src', 'app', 'admin', 'denetim-kaydi', 'layout.js');
  assert.match(auditLayout, /requireAdminPage\(\['admin'\]\)/);

  const loginLayout = await source('src', 'app', 'admin', 'giris', 'layout.js');
  const proxy = await source('src', 'proxy.js');
  assert.match(loginLayout, /getAuthenticatedAdmin/);
  assert.doesNotMatch(proxy, /pathname === '\/admin\/giris'[\s\S]*dashboardUrl/);
});

test('migration aracı eşzamanlı çalışmayı kilitliyor ve değiştirilmiş dosyayı reddediyor', async () => {
  const migrationRunner = await source('scripts', 'migrate.js');
  assert.match(migrationRunner, /GET_LOCK/);
  assert.match(migrationRunner, /RELEASE_LOCK/);
  assert.match(migrationRunner, /rows\[0\]\.checksum !== checksum/);
  assert.doesNotMatch(migrationRunner, /beginTransaction/);
});

test('bağış mutabakatı kampanya toplamını transaction içinde yeniden hesaplıyor', async () => {
  const records = await source('src', 'lib', 'services', 'admin-records.service.js');
  assert.match(records, /SELECT campaign_id FROM donations WHERE id=\? FOR UPDATE/);
  assert.match(records, /SUM\(amount\)/);
  assert.match(records, /payment_status='paid'/);
  assert.match(records, /connection\.commit\(\)/);
});
