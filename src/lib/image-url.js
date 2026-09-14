export const IMAGE_URL_MESSAGE =
  'Doğrudan bir görsel adresi kullanın. Google paylaşım/kısaltma bağlantıları desteklenmez.';

export function isAllowedImageUrl(value) {
  if (!value) return true;
  if (value.startsWith('/') && !value.startsWith('//')) return true;

  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'images.unsplash.com';
  } catch {
    return false;
  }
}

export function getSafeImageUrl(value, fallback) {
  return isAllowedImageUrl(value) ? value || fallback : fallback;
}
