/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  clearAuthCookies,
  enrichAuthResponse,
  resolveAuthSession,
} from '@/lib/auth/middleware-session';
import {
  AUTH_COOKIES,
  PUBLIC_ROUTES,
  SKIP_MIDDLEWARE_PREFIXES,
} from '@/lib/auth/constants';
import { createPortalMiddlewareAuthConfig } from '@/lib/auth/middleware-config';

const ALLOWED_PORTAL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'FACILITY_OWNER'];
const middlewareAuthConfig = createPortalMiddlewareAuthConfig();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SKIP_MIDDLEWARE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const session = await resolveAuthSession(request, middlewareAuthConfig);

  if (session.authFailure) {
    if (isPublicRoute) {
      const response = NextResponse.next();
      clearAuthCookies(response, AUTH_COOKIES);
      return response;
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response, AUTH_COOKIES);
    return response;
  }

  if (!session.accessToken) {
    if (isPublicRoute || session.networkFailure) {
      return NextResponse.next();
    }

    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.role;

  if (role && !ALLOWED_PORTAL_ROLES.includes(role)) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      const response = NextResponse.redirect(loginUrl);
      clearAuthCookies(response, AUTH_COOKIES);
      return response;
    }
  }

  if (isPublicRoute && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();
  return enrichAuthResponse(response, session, middlewareAuthConfig);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|svg/)(?!.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot|map)$).*)',
  ],
};
