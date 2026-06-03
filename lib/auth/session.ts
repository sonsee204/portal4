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
import { AUTH_COOKIES, COOKIE_OPTIONS, TOKEN_EXPIRY } from './constants';
import type { SessionTokens } from '@/types';

export type { SessionTokens };

/**
 * Set auth tokens in HttpOnly cookies (Server Action only)
 */
export async function setSession(
  tokens: SessionTokens,
  userRole: string,
): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: TOKEN_EXPIRY.ACCESS_TOKEN,
  });

  cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: TOKEN_EXPIRY.REFRESH_TOKEN,
  });

  // Store role in a separate cookie for middleware access (not httpOnly so middleware can read)
  cookieStore.set(AUTH_COOKIES.USER_ROLE, userRole, {
    ...COOKIE_OPTIONS,
    httpOnly: false, // Middleware needs to read this
    maxAge: TOKEN_EXPIRY.REFRESH_TOKEN,
  });
}

/**
 * Get the access token from cookies (Server Action / RSC only)
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value ?? null;
}

/**
 * Get the refresh token from cookies (Server Action only)
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.REFRESH_TOKEN)?.value ?? null;
}

/**
 * Get user role from cookies
 */
export async function getUserRole(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.USER_ROLE)?.value ?? null;
}

/**
 * Clear all auth cookies (Server Action only)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
  cookieStore.delete(AUTH_COOKIES.USER_ROLE);
}

/**
 * Check if user has an active session (has access token)
 */
export async function hasSession(): Promise<boolean> {
  const token = await getAccessToken();
  return token !== null;
}
