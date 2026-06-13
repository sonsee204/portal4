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
import { decodeJwtExp } from '@/lib/auth/session-core';
import { getAccessToken, getRefreshToken } from '@/lib/auth/session';

export async function GET() {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ isAuthenticated: false });
  }

  const accessExpiresAt = accessToken
    ? (decodeJwtExp(accessToken) ?? null)
    : null;

  return NextResponse.json({
    isAuthenticated: Boolean(accessToken || refreshToken),
    accessExpiresAt,
    hasRefreshToken: Boolean(refreshToken),
  });
}
