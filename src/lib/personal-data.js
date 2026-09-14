import crypto from 'node:crypto';

const dataSecret = process.env.DATA_ENCRYPTION_KEY;
const jwtSecret = process.env.JWT_SECRET;
const secret = dataSecret || jwtSecret;

if (!secret) {
  throw new Error('DATA_ENCRYPTION_KEY veya JWT_SECRET tanımlı değil.');
}

if (process.env.NODE_ENV === 'production') {
  if (!dataSecret || dataSecret.length < 32) {
    throw new Error('DATA_ENCRYPTION_KEY production ortamında en az 32 karakter olmalı.');
  }
  if (dataSecret === jwtSecret) {
    throw new Error('DATA_ENCRYPTION_KEY ile JWT_SECRET farklı olmalı.');
  }
}

const encryptionKey = crypto.scryptSync(secret, 'eflav-personal-data-v1', 32);
const hashKey = crypto.scryptSync(secret, 'eflav-identity-hash-v1', 32);

export function encryptPersonalData(value) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `v1.${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`;
}

export function decryptPersonalData(value) {
  if (typeof value !== 'string' || !value.startsWith('v1.')) return value;

  const [, ivValue, tagValue, encryptedValue] = value.split('.');
  if (!ivValue || !tagValue || !encryptedValue) {
    throw new Error('Şifreli kişisel veri biçimi geçersiz.');
  }

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    encryptionKey,
    Buffer.from(ivValue, 'base64url')
  );
  decipher.setAuthTag(Buffer.from(tagValue, 'base64url'));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedValue, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

export function maskIdentityNumber(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length < 4) return 'Gizli';
  return `${'*'.repeat(Math.max(digits.length - 4, 0))}${digits.slice(-4)}`;
}

export function hashIdentityNumber(value) {
  return crypto.createHmac('sha256', hashKey).update(value).digest('hex');
}
