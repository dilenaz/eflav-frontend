import { NextResponse } from 'next/server';

import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
} from '@/lib/auth';
import { validateRequestOrigin } from '@/lib/request-origin';

const MAX_ADMIN_REQUEST_BYTES = 6 * 1024 * 1024;

function apiError(message, status) {
  return NextResponse.json(
    { success: false, message },
    { status, headers: { 'Cache-Control': 'no-store' } }
  );
}

function secureAdminResponse(response) {
  response.headers.set('Cache-Control', 'private, no-store, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return response;
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith('/api/admin/');
  const isPublicAdminApi = pathname === '/api/admin/login';
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(request.method);

  if (isAdminApi && isMutation) {
    if (!validateRequestOrigin(request)) {
      return apiError('Geçersiz istek kaynağı.', 403);
    }
    const contentLength = Number(request.headers.get('content-length') || 0);
    if (!Number.isFinite(contentLength) || contentLength < 0 || contentLength > MAX_ADMIN_REQUEST_BYTES) {
      return apiError('İstek gövdesi çok büyük.', 413);
    }
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const payload = token ? verifyAdminToken(token) : null;

  if (isPublicAdminApi) {
    return secureAdminResponse(NextResponse.next());
  }

  if (isAdminApi && !isPublicAdminApi) {
    if (!payload) {
      const response = apiError('Yetkisiz işlem.', 401);
      if (token) response.cookies.delete(ADMIN_COOKIE_NAME);
      return response;
    }
    return secureAdminResponse(NextResponse.next());
  }

  if (pathname === '/admin/giris') {
    if (request.nextUrl.searchParams.has('reason')) {
      const response = NextResponse.next();
      if (token) response.cookies.delete(ADMIN_COOKIE_NAME);
      return secureAdminResponse(response);
    }
    const response = NextResponse.next();
    if (token && !payload) response.cookies.delete(ADMIN_COOKIE_NAME);
    return secureAdminResponse(response);
  }

  if (!payload) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/giris';
    const response = NextResponse.redirect(loginUrl);
    if (token) response.cookies.delete(ADMIN_COOKIE_NAME);

    return secureAdminResponse(response);
  }

  return secureAdminResponse(NextResponse.next());
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
