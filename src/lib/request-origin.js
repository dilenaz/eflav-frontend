export function validateRequestOrigin(request) {
  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'cross-site') return false;

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const source = origin || referer;

  if (!source) return process.env.NODE_ENV !== 'production';

  const allowed = new Set();
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    try {
      allowed.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin);
    } catch {
      return false;
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    allowed.add(request.nextUrl.origin);
  }

  try {
    return allowed.has(new URL(source).origin);
  } catch {
    return false;
  }
}
