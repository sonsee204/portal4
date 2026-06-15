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

import { cookies } from 'next/headers';
import type { PortalCapability } from '@/lib/permissions/portal-permissions';
import { buildSessionCookieOptions } from '@/lib/auth/session-core';
import { AUTH_COOKIES, COOKIE_OPTIONS } from './constants';
import type { SessionTokens } from '@/types';

export type { SessionTokens };

export async function setSession(
  tokens: SessionTokens,
  userRole: string,
  portalCapabilities: PortalCapability[] = [],
): Promise<void> {
  const cookieStore = await cookies();
  const options = buildSessionCookieOptions(tokens, COOKIE_OPTIONS);

  cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken, options.access);
  cookieStore.set(
    AUTH_COOKIES.REFRESH_TOKEN,
    tokens.refreshToken,
    options.refresh,
  );
  cookieStore.set(AUTH_COOKIES.USER_ROLE, userRole, options.role);
  cookieStore.set(
    AUTH_COOKIES.PORTAL_CAPABILITIES,
    portalCapabilities.join(','),
    options.role,
  );
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.REFRESH_TOKEN)?.value ?? null;
}

export async function getUserRole(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.USER_ROLE)?.value ?? null;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
  cookieStore.delete(AUTH_COOKIES.USER_ROLE);
  cookieStore.delete(AUTH_COOKIES.PORTAL_CAPABILITIES);
}

export async function hasSession(): Promise<boolean> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  return accessToken !== null || refreshToken !== null;
}
