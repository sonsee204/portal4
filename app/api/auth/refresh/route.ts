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
import { getRefreshToken, setSession, clearSession } from '@/lib/auth/session';
import { GRAPHQL_URL } from '@/lib/auth/constants';

/**
 * API route to refresh access token.
 * Used by Apollo Client error link when a 401 is received.
 */
export async function POST() {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
  }

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
        'x-client-source': 'portal',
        'Apollo-Require-Preflight': 'true',
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken {
            refreshToken {
              accessToken
              refreshToken
              user {
                _id
                role
              }
            }
          }
        `,
      }),
    });

    const result = (await response.json()) as {
      data?: {
        refreshToken: {
          accessToken: string;
          refreshToken: string;
          user: { _id: string; role: string };
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (result.errors || !result.data?.refreshToken) {
      await clearSession();
      return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      user,
    } = result.data.refreshToken;

    await setSession(
      { accessToken, refreshToken: newRefreshToken },
      user.role,
    );

    return NextResponse.json({ accessToken });
  } catch {
    await clearSession();
    return NextResponse.json({ error: 'Refresh failed' }, { status: 500 });
  }
}
