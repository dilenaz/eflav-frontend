const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');
const { loadEnvConfig } = require('@next/env');

loadEnvConfig(process.cwd());

const errors = [];
const warnings = [];
const required = [
  'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'NEXT_PUBLIC_SITE_URL',
  'JWT_SECRET', 'DATA_ENCRYPTION_KEY', 'UPLOAD_DIR',
];

function isPlaceholder(value) {
  return /^(change-|example|replace-|your-|test|ci-)/i.test(value || '');
}

async function main() {
  for (const key of required) {
    if (!process.env[key]?.trim()) errors.push(`${key} tanımlı değil.`);
  }

  try {
    const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL);
    if (siteUrl.protocol !== 'https:') errors.push('NEXT_PUBLIC_SITE_URL HTTPS kullanmalı.');
    if (['localhost', '127.0.0.1', 'example.org'].includes(siteUrl.hostname)) {
      errors.push('NEXT_PUBLIC_SITE_URL gerçek production alan adı olmalı.');
    }
  } catch {
    errors.push('NEXT_PUBLIC_SITE_URL geçerli bir URL değil.');
  }

  const dbPort = Number(process.env.DB_PORT || 3306);
  if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
    errors.push('DB_PORT geçerli bir port olmalı.');
  }

  const jwt = process.env.JWT_SECRET || '';
  const encryption = process.env.DATA_ENCRYPTION_KEY || '';
  if (jwt.length < 32) errors.push('JWT_SECRET en az 32 karakter olmalı.');
  if (encryption.length < 32) errors.push('DATA_ENCRYPTION_KEY en az 32 karakter olmalı.');
  if (jwt && jwt === encryption) errors.push('JWT_SECRET ve DATA_ENCRYPTION_KEY farklı olmalı.');
  if (isPlaceholder(jwt)) errors.push('JWT_SECRET yer tutucu değer içeremez.');
  if (isPlaceholder(encryption)) errors.push('DATA_ENCRYPTION_KEY yer tutucu değer içeremez.');
  if (isPlaceholder(process.env.DB_PASSWORD)) errors.push('DB_PASSWORD yer tutucu değer içeremez.');

  for (const key of ['NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY']) {
    if (isPlaceholder(process.env[key])) errors.push(`${key} yer tutucu değer içeremez.`);
  }

  const uploadDir = process.env.UPLOAD_DIR || '';
  if (uploadDir && !path.isAbsolute(uploadDir)) errors.push('UPLOAD_DIR mutlak bir dosya yolu olmalı.');
  if (uploadDir) {
    try {
      fs.mkdirSync(uploadDir, { recursive: true });
      fs.accessSync(uploadDir, fs.constants.R_OK | fs.constants.W_OK);
    } catch {
      errors.push('UPLOAD_DIR oluşturulamıyor veya yazılabilir değil.');
    }
  }

  if (!process.env.TURNSTILE_SECRET_KEY || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    errors.push('Production ortamında Turnstile site ve secret anahtarları zorunlu.');
  }
  if (!process.env.ADMIN_NOTIFICATION_WEBHOOK_URL) {
    warnings.push('ADMIN_NOTIFICATION_WEBHOOK_URL eksik; yönetici bildirimleri gönderilmeyecek.');
  } else {
    try {
      const webhookUrl = new URL(process.env.ADMIN_NOTIFICATION_WEBHOOK_URL);
      if (webhookUrl.protocol !== 'https:') errors.push('ADMIN_NOTIFICATION_WEBHOOK_URL HTTPS kullanmalı.');
    } catch {
      errors.push('ADMIN_NOTIFICATION_WEBHOOK_URL geçerli bir URL değil.');
    }
  }
  if (process.env.INITIAL_ADMIN_PASSWORD) {
    warnings.push('INITIAL_ADMIN_PASSWORD ilk yönetici oluşturulduktan sonra environment içinden kaldırılmalı.');
  }

  if (!errors.some((error) => error.startsWith('DB_'))) {
    let connection;
    try {
      connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: dbPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        connectTimeout: 5000,
      });
      await connection.execute('SELECT 1');
    } catch (error) {
      errors.push(`MySQL bağlantısı başarısız (${error.code || 'bilinmeyen hata'}).`);
    } finally {
      await connection?.end().catch(() => {});
    }
  }

  for (const warning of warnings) console.warn(`UYARI: ${warning}`);
  if (errors.length) {
    for (const error of errors) console.error(`HATA: ${error}`);
    process.exitCode = 1;
  } else {
    console.log('Production environment ve servis kontrolü başarılı.');
  }
}

main().catch((error) => {
  console.error('HATA: Production kontrolü tamamlanamadı.', error);
  process.exitCode = 1;
});
