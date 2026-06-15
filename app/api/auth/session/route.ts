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

import { NextResponse } from 'next/server';
import { decodeJwtExp, isJwtExpired } from '@/lib/auth/session-core';
import { getAccessToken, getRefreshToken } from '@/lib/auth/session';
import { refreshSessionFromCookie } from '@/lib/auth/refresh-server';

export async function GET() {
  let accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ isAuthenticated: false });
  }

  if (
    accessToken &&
    isJwtExpired(accessToken, 0) &&
    refreshToken
  ) {
    const refreshed = await refreshSessionFromCookie();
    if (refreshed.ok) {
      accessToken = refreshed.accessToken;
    }
  }

  if (!accessToken && refreshToken) {
    const refreshed = await refreshSessionFromCookie();
    if (refreshed.ok) {
      accessToken = refreshed.accessToken;
    }
  }

  const accessExpiresAt = accessToken
    ? (decodeJwtExp(accessToken) ?? null)
    : null;

  return NextResponse.json({
    isAuthenticated: Boolean(accessToken || refreshToken),
    accessToken: accessToken ?? null,
    accessExpiresAt,
    hasRefreshToken: Boolean(refreshToken),
  });
}
