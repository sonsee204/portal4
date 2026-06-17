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
import {
  canAccessWorkspace,
  getHomePath,
  hasOrganizerCapability,
} from '@/lib/permissions/access';
import { matchRouteManifest } from '@/lib/permissions/route-manifest';
import type { PortalCapability } from '@/lib/permissions/portal-permissions';
import type { PortalWorkspace } from '@/lib/permissions/portal-permissions';
import type { UserRole } from '@/types';

const STAFF_PORTAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'FACILITY_OWNER',
];
const middlewareAuthConfig = createPortalMiddlewareAuthConfig();

function parsePortalCapabilitiesCookie(
  value?: string | null,
): PortalCapability[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((c) => c.trim())
    .filter((c): c is PortalCapability => c === 'TOURNAMENT_ORGANIZER');
}

function getWorkspaceFromPath(pathname: string): PortalWorkspace | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/owner')) return 'owner';
  if (pathname.startsWith('/organizer')) return 'organizer';
  if (pathname.startsWith('/shared') || pathname === '/forbidden') return 'shared';
  return null;
}

function canAccessPortal(
  role: UserRole,
  capabilities: PortalCapability[],
): boolean {
  if (STAFF_PORTAL_ROLES.includes(role)) return true;
  if (role === 'PLAYER' && hasOrganizerCapability(capabilities)) return true;
  return false;
}

function buildLoginRedirectUrl(request: NextRequest, pathname: string): URL {
  const loginUrl = new URL('/login', request.url);
  if (
    pathname !== '/forbidden' &&
    pathname !== '/login' &&
    !PUBLIC_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
  ) {
    loginUrl.searchParams.set('redirect', pathname);
  }
  return loginUrl;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (SKIP_MIDDLEWARE_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const session = await resolveAuthSession(request, middlewareAuthConfig);
  const capabilities = parsePortalCapabilitiesCookie(
    request.cookies.get(AUTH_COOKIES.PORTAL_CAPABILITIES)?.value,
  );
  const isOwner = request.cookies.get(AUTH_COOKIES.IS_OWNER)?.value === '1';
  const hasVenueAccess =
    request.cookies.get(AUTH_COOKIES.HAS_VENUE_ACCESS)?.value === '1';

  if (session.authFailure) {
    if (isPublicRoute) {
      const response = NextResponse.next();
      clearAuthCookies(response, AUTH_COOKIES);
      return response;
    }

    const loginUrl = buildLoginRedirectUrl(request, pathname);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response, AUTH_COOKIES);
    return response;
  }

  if (!session.accessToken) {
    if (isPublicRoute || session.networkFailure) {
      return NextResponse.next();
    }

    const loginUrl = buildLoginRedirectUrl(request, pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.role as UserRole | null;

  if (role && !canAccessPortal(role, capabilities)) {
    if (!isPublicRoute) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'unauthorized');
      const response = NextResponse.redirect(loginUrl);
      clearAuthCookies(response, AUTH_COOKIES);
      return response;
    }
  }

  if (isPublicRoute && pathname === '/login' && role) {
    const home = getHomePath(role, capabilities);
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname === '/' && role) {
    const home = getHomePath(role, capabilities);
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (pathname === '/calendar' && role) {
    if (hasVenueAccess || role === 'FACILITY_OWNER') {
      return NextResponse.redirect(new URL('/owner/calendar', request.url));
    }
    return NextResponse.redirect(
      new URL(getHomePath(role, capabilities), request.url),
    );
  }

  if (pathname.startsWith('/admin/tournaments')) {
    const suffix = pathname.slice('/admin/tournaments'.length);
    return NextResponse.redirect(
      new URL(`/organizer/tournaments${suffix}`, request.url),
    );
  }

  if (pathname === '/admin/finance' || pathname.startsWith('/admin/finance/')) {
    if (hasVenueAccess || role === 'FACILITY_OWNER') {
      return NextResponse.redirect(new URL('/owner/finance', request.url));
    }
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  if (
    pathname === '/admin/calendar' ||
    pathname.startsWith('/admin/calendar/')
  ) {
    if (hasVenueAccess || role === 'FACILITY_OWNER') {
      return NextResponse.redirect(new URL('/owner/calendar', request.url));
    }
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  const workspace = getWorkspaceFromPath(pathname);
  if (
    workspace &&
    role &&
    !canAccessWorkspace(role, workspace, capabilities, hasVenueAccess)
  ) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  const routeEntry = matchRouteManifest(pathname);
  if (routeEntry?.platformOwnerOnly && role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }
  if (routeEntry?.venueOwnerOnly && !isOwner) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }
  if (routeEntry?.ownerOnly && !isOwner) {
    return NextResponse.redirect(new URL('/forbidden', request.url));
  }

  const response = NextResponse.next();
  return enrichAuthResponse(response, session, middlewareAuthConfig);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|svg/)(?!.*\\.(?:svg|png|jpg|jpeg|gif|ico|webp|woff2?|ttf|eot|map)$).*)',
  ],
};
