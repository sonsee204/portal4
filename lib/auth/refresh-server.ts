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

import { getServerActionSessionHeaders } from '@/lib/auth/session-forward-headers';
import { performTokenRefresh } from '@/lib/auth/session-core';
import {
  clearSession,
  getRefreshToken,
  setSession,
} from './session';
import { GRAPHQL_URL } from './constants';
import type { PortalCapability } from '@/lib/permissions/portal-permissions';

export type RefreshSessionResult =
  | { ok: true; accessToken: string }
  | { ok: false; reason: 'no_refresh' | 'auth_failure' | 'network_failure' };

const ME_CAPABILITIES_QUERY = `
  query MeCapabilities {
    me {
      role
      isOwner
      portalCapabilities
    }
  }
`;

async function fetchMeCapabilities(
  accessToken: string,
): Promise<{
  role: string;
  isOwner: boolean;
  portalCapabilities: PortalCapability[];
} | null> {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-source': 'portal',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query: ME_CAPABILITIES_QUERY }),
    });
    const result = (await response.json()) as {
      data?: {
        me: {
          role: string;
          isOwner: boolean;
          portalCapabilities: PortalCapability[];
        };
      };
    };
    return result.data?.me ?? null;
  } catch {
    return null;
  }
}

export async function refreshSessionFromCookie(): Promise<RefreshSessionResult> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return { ok: false, reason: 'no_refresh' };
  }

  const forwardHeaders = await getServerActionSessionHeaders();
  const result = await performTokenRefresh(
    GRAPHQL_URL,
    refreshToken,
    'portal',
    forwardHeaders,
  );

  if (result.kind === 'success') {
    const me = await fetchMeCapabilities(result.accessToken);
    await setSession(
      {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      me?.role ?? result.user.role,
      me?.portalCapabilities ?? [],
      me?.isOwner ?? false,
    );
    return { ok: true, accessToken: result.accessToken };
  }

  if (result.kind === 'auth_failure') {
    await clearSession();
    return { ok: false, reason: 'auth_failure' };
  }

  return { ok: false, reason: 'network_failure' };
}
