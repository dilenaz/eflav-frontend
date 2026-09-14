import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const source = (file) => readFile(path.join(root, file), 'utf8');

test('admin API proxy applies optimistic auth, origin, and request-size checks', async () => {
  const proxy = await source('src/proxy.js');
  assert.match(proxy, /\/api\/admin\/:path\*/);
  assert.match(proxy, /validateRequestOrigin\(request\)/);
  assert.match(proxy, /MAX_ADMIN_REQUEST_BYTES/);
  assert.match(proxy, /isPublicAdminApi = pathname === '\/api\/admin\/login'/);
  assert.match(proxy, /if \(isPublicAdminApi\) \{\s+return secureAdminResponse\(NextResponse\.next\(\)\);\s+\}/);
  assert.match(proxy, /Cache-Control', 'private, no-store/);
  assert.match(proxy, /X-Robots-Tag', 'noindex, nofollow, noarchive/);
  assert.match(proxy, /verifyAdminToken/);
});

test('production mutations require a trusted site origin', async () => {
  const origin = await source('src/lib/request-origin.js');
  assert.match(origin, /sec-fetch-site/);
  assert.match(origin, /cross-site/);
  assert.match(origin, /NODE_ENV !== 'production'/);
  assert.match(origin, /NEXT_PUBLIC_SITE_URL/);
});

test('Turnstile verification fails closed with timeout and hostname binding', async () => {
  const bot = await source('src/lib/bot-protection.js');
  assert.match(bot, /AbortSignal\.timeout\(5_000\)/);
  assert.match(bot, /result\.hostname !== expectedHostname/);
  assert.match(bot, /ApiRequestError\(.+503, 30\)/s);
});

test('admin login and content ingestion have bounded resource usage', async () => {
  const login = await source('src/app/api/admin/login/route.js');
  assert.match(login, /enforceRateLimit\(request, 'admin-login-ip', 30, 900\)/);

  const upload = await source('src/app/api/admin/uploads/route.js');
  assert.match(upload, /multipart\/form-data/);
  assert.match(upload, /MAX_FILE_SIZE \+ 256 \* 1024/);

  for (const file of [
    'src/lib/validations/news.schema.js',
    'src/lib/validations/event.schema.js',
    'src/lib/validations/activity.schema.js',
    'src/lib/validations/gallery.schema.js',
  ]) {
    assert.match(await source(file), /content:.+\.max\(100000\)/s);
  }
});

test('donation validation rejects impossible dates and sub-cent amounts', async () => {
  const donation = await source('src/lib/validations/donation.schema.js');
  assert.match(donation, /toISOString\(\)\.slice\(0, 10\) === value/);
  assert.match(donation, /timeZone: 'Europe\/Istanbul'/);
  assert.match(donation, /\.multipleOf\(0\.01/);
});
