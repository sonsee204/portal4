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
import { jwtVerify, errors as joseErrors } from 'jose';
import {
  AUTH_COOKIES,
  PUBLIC_ROUTES,
  SKIP_MIDDLEWARE_PREFIXES,
} from '@/lib/auth/constants';

/**
 * JWT secret for decoding (must match backend)
 * In Edge Runtime, we only decode to check expiry and extract claims.
 * Full verification happens on the backend.
 */
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'nalee-sports-jwt-secret',
);

/**
 * Roles allowed to access the portal
 */
const ALLOWED_PORTAL_ROLES = ['SUPER_ADMIN', 'ADMIN', 'FACILITY_OWNER'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets and API routes
  if (SKIP_MIDDLEWARE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Get tokens from cookies
  const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const userRole = request.cookies.get(AUTH_COOKIES.USER_ROLE)?.value;

  // If no access token and not on a public route, redirect to login
  if (!accessToken) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify token (check expiry and extract claims)
  let tokenPayload: { sub?: string; role?: string; exp?: number } | null =
    null;

  try {
    const { payload } = await jwtVerify(accessToken, JWT_SECRET);
    tokenPayload = payload as { sub?: string; role?: string; exp?: number };
  } catch (error) {
    // Token expired or invalid
    if (error instanceof joseErrors.JWTExpired) {
      // Token expired - let the client handle refresh
      const response = isPublicRoute
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/login', request.url));

      response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
      return response;
    }

    // Invalid token - clear everything and redirect
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
      response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN);
      response.cookies.delete(AUTH_COOKIES.USER_ROLE);
      return response;
    }

    return NextResponse.next();
  }

  // Check role from token or cookie
  const role = tokenPayload?.role || userRole;

  if (role && !ALLOWED_PORTAL_ROLES.includes(role)) {
    // Player or unknown role trying to access portal
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete(AUTH_COOKIES.ACCESS_TOKEN);
      response.cookies.delete(AUTH_COOKIES.REFRESH_TOKEN);
      response.cookies.delete(AUTH_COOKIES.USER_ROLE);
      return response;
    }
  }

  // Authenticated user trying to access login page - redirect to dashboard
  if (isPublicRoute && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Add user info to request headers for downstream use
  const response = NextResponse.next();
  if (tokenPayload?.sub) {
    response.headers.set('x-user-id', tokenPayload.sub);
  }
  if (role) {
    response.headers.set('x-user-role', role);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Run middleware on all paths EXCEPT:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico (browser default)
     * - svg/ (icon SVGs from public/svg/)
     * - Any file with a static-asset extension (.svg, .png, .jpg, …)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|svg/)(?!.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot|map)$).*)',
  ],
};
