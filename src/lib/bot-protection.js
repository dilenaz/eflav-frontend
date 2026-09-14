import { ApiRequestError, getClientIp } from '@/lib/api-security';

export async function verifyCaptcha(request, token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new ApiRequestError('Güvenlik doğrulaması şu anda kullanılamıyor.', 503, 30);
    }
    return;
  }
  if (!token) throw new ApiRequestError('Lütfen robot olmadığınızı doğrulayın.', 400);
  const remoteip = getClientIp(request);
  const body = new URLSearchParams({ secret, response: token });
  if (remoteip !== 'unknown') body.set('remoteip', remoteip);
  let result;
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`Turnstile HTTP ${response.status}`);
    result = await response.json();
  } catch (error) {
    console.error('Turnstile doğrulama servisine ulaşılamadı:', error);
    throw new ApiRequestError('Güvenlik doğrulaması şu anda kullanılamıyor.', 503, 30);
  }

  if (!result?.success) {
    throw new ApiRequestError('Güvenlik doğrulaması başarısız oldu. Lütfen yeniden deneyin.', 403);
  }

  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_URL) {
    const expectedHostname = new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname;
    if (result.hostname !== expectedHostname) {
      console.warn('Turnstile alan adı uyuşmazlığı.');
      throw new ApiRequestError('Güvenlik doğrulaması başarısız oldu. Lütfen yeniden deneyin.', 403);
    }
  }
}
