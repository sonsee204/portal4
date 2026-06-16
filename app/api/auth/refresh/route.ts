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
import { refreshSessionFromCookie } from '@/lib/auth/refresh-server';

// Never cache: rotates tokens, returns a per-user access token, sets cookies.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate, private',
} as const;

export async function POST() {
  const result = await refreshSessionFromCookie();

  if (result.ok) {
    return NextResponse.json(
      { accessToken: result.accessToken },
      { headers: NO_STORE_HEADERS },
    );
  }

  if (result.reason === 'auth_failure' || result.reason === 'no_refresh') {
    return NextResponse.json(
      { error: 'Refresh failed' },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json(
    { error: 'Refresh unavailable' },
    { status: 503, headers: NO_STORE_HEADERS },
  );
}
