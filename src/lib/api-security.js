import crypto from 'node:crypto';

import { db } from '@/lib/db';
export { validateRequestOrigin } from '@/lib/request-origin';

export function getClientIp(request) {
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwarded = request.headers.get('x-forwarded-for')
    ?.split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return forwarded?.at(-1) || 'unknown';
}

export async function parseJsonBody(request, maxBytes = 16_384) {
  const contentType = request.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
  if (contentType !== 'application/json') throw new ApiRequestError('Yalnızca JSON istekleri kabul edilir.', 415);
  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > maxBytes) throw new ApiRequestError('İstek gövdesi çok büyük.', 413);
  const text = await request.text();
  if (Buffer.byteLength(text, 'utf8') > maxBytes) throw new ApiRequestError('İstek gövdesi çok büyük.', 413);
  if (!text.trim()) throw new ApiRequestError('İstek gövdesi boş olamaz.', 400);
  try { return JSON.parse(text); }
  catch { throw new ApiRequestError('Geçersiz JSON isteği.', 400); }
}

export async function enforceRateLimit(request, scope, limit, windowSeconds) {
  const ip = getClientIp(request);
  const identifier = crypto.createHash('sha256').update(`${scope}|${ip}`).digest('hex');
  await db.execute(`
    INSERT INTO api_rate_limits (identifier_hash, request_count, window_started_at)
    VALUES (?, 1, NOW())
    ON DUPLICATE KEY UPDATE
      request_count = IF(window_started_at < DATE_SUB(NOW(), INTERVAL ? SECOND), 1, request_count + 1),
      window_started_at = IF(window_started_at < DATE_SUB(NOW(), INTERVAL ? SECOND), NOW(), window_started_at)
  `, [identifier, windowSeconds, windowSeconds]);
  const [rows] = await db.execute('SELECT request_count FROM api_rate_limits WHERE identifier_hash=?', [identifier]);
  if (Number(rows[0]?.request_count) > limit) throw new ApiRequestError('Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.', 429, windowSeconds);
}

export class ApiRequestError extends Error {
  constructor(message, status, retryAfter) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.retryAfter = retryAfter;
  }
}
