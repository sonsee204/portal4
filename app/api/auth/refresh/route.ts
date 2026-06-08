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

export async function POST() {
  const result = await refreshSessionFromCookie();

  if (result.ok) {
    return NextResponse.json({ accessToken: result.accessToken });
  }

  if (result.reason === 'auth_failure' || result.reason === 'no_refresh') {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
  }

  return NextResponse.json({ error: 'Refresh unavailable' }, { status: 503 });
}
