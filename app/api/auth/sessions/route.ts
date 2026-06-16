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
import { getAccessToken } from '@/lib/auth/session';
import { refreshSessionFromCookie } from '@/lib/auth/refresh-server';
import { getServerActionSessionHeaders } from '@/lib/auth/session-forward-headers';
import { isJwtExpired } from '@/lib/auth/session-core';
import { GRAPHQL_URL } from '@/lib/auth/constants';

/**
 * Device & session management is driven entirely from the HttpOnly cookie
 * access token resolved server-side. The cookie carries the authoritative
 * session `sid` for THIS browser and is never mutated by client JS, so it
 * cannot be contaminated by the in-memory Apollo token singleton (which is
 * shared per Next.js server process and therefore unsafe for deciding which
 * session is "current").
 */

// Never cache: uses per-user cookie token and may refresh/rotate cookies.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, max-age=0, must-revalidate, private',
} as const;

const PORTAL_GQL_HEADERS = {
  'Content-Type': 'application/json',
  'x-client-source': 'portal',
  'Apollo-Require-Preflight': 'true',
} as const;

const MY_SESSIONS_QUERY = `
  query MySessions {
    mySessions {
      id
      deviceName
      platform
      ipAddress
      loginLocation
      clientSource
      lastUsedAt
      createdAt
      isCurrent
      deviceInfo {
        deviceId
        deviceName
        platform
        osVersion
        appVersion
      }
    }
  }
`;

const REVOKE_OTHER_SESSIONS_MUTATION = `
  mutation RevokeOtherSessions {
    revokeOtherSessions
  }
`;

const REVOKE_SESSION_MUTATION = `
  mutation RevokeSession($sessionId: ID!) {
    revokeSession(sessionId: $sessionId)
  }
`;

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/** Resolve a valid access token from cookies, refreshing if necessary. */
async function resolveAccessToken(): Promise<string | null> {
  let accessToken = await getAccessToken();

  if (!accessToken || isJwtExpired(accessToken, 0)) {
    const refreshed = await refreshSessionFromCookie();
    if (!refreshed.ok) {
      return null;
    }
    accessToken = refreshed.accessToken;
  }

  return accessToken;
}

async function callGraphql<T>(
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
): Promise<GraphQLResponse<T>> {
  const sessionHeaders = await getServerActionSessionHeaders();
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      ...PORTAL_GQL_HEADERS,
      ...sessionHeaders,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  return (await res.json()) as GraphQLResponse<T>;
}

export async function GET() {
  const accessToken = await resolveAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const result = await callGraphql<{ mySessions: unknown[] }>(
    accessToken,
    MY_SESSIONS_QUERY,
  );

  if (result.errors?.length) {
    return NextResponse.json(
      { error: result.errors[0].message },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json(
    { sessions: result.data?.mySessions ?? [] },
    { headers: NO_STORE_HEADERS },
  );
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    mode?: 'others' | 'one';
    sessionId?: string;
  } | null;

  if (!body?.mode) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  if (body.mode === 'one' && !body.sessionId) {
    return NextResponse.json(
      { error: 'Missing sessionId' },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const accessToken = await resolveAccessToken();
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const result =
    body.mode === 'others'
      ? await callGraphql<{ revokeOtherSessions: boolean }>(
        accessToken,
        REVOKE_OTHER_SESSIONS_MUTATION,
      )
      : await callGraphql<{ revokeSession: boolean }>(
        accessToken,
        REVOKE_SESSION_MUTATION,
        { sessionId: body.sessionId },
      );

  if (result.errors?.length) {
    return NextResponse.json(
      { error: result.errors[0].message },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  return NextResponse.json({ success: true }, { headers: NO_STORE_HEADERS });
}
