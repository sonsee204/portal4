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

'use client';

import { useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  MY_SESSIONS,
  REVOKE_SESSION,
  REVOKE_OTHER_SESSIONS,
} from '@/graphql/auth/sessions';
import type { MySessionsQuery } from '@/graphql/generated';
import { setClientAccessToken } from '@/lib/apollo/client';
import { showError, showSuccess } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';

/** Fetch the current access token from the server cookie and hydrate the
 *  Apollo in-memory store. Returns `true` when the token was successfully
 *  synced so callers can gate mutations on it. */
async function syncTokenFromCookie(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'include' });
    if (!res.ok) return false;

    const payload = (await res.json()) as { accessToken?: string | null };
    if (payload.accessToken) {
      setClientAccessToken(payload.accessToken);
      return true;
    }
  } catch {
    // Ignore — fall back to whatever the Apollo client already has.
  }
  return false;
}

export function useSessions() {
  const { data, loading, error, refetch } = useQuery<MySessionsQuery>(
    MY_SESSIONS,
    { fetchPolicy: 'network-only' },
  );

  /** Whether the access token has been synced from the cookie at least once. */
  const tokenSyncedRef = useRef(false);

  useEffect(() => {
    void syncTokenFromCookie().then((synced) => {
      tokenSyncedRef.current = synced;
      if (synced) void refetch();
    });
  }, [refetch]);

  const [revokeSessionMut, { loading: revokingOne }] = useMutation(REVOKE_SESSION, {
    onCompleted: () => {
      showSuccess('Đã đăng xuất thiết bị');
      void refetch();
    },
    onError: (err) => showError(formatMutationError(err)),
  });

  const [revokeOthers, { loading: revokingOthers }] = useMutation(
    REVOKE_OTHER_SESSIONS,
    {
      onCompleted: () => {
        showSuccess('Đã đăng xuất tất cả thiết bị khác');
        void refetch();
      },
      onError: (err) => showError(formatMutationError(err)),
    },
  );

  const sessions = data?.mySessions ?? [];

  /** Before firing a destructive session mutation, always re-sync the access
   *  token so the Bearer header carries the correct session `sid`. */
  async function withFreshToken<T>(fn: () => Promise<T>): Promise<T> {
    await syncTokenFromCookie();
    return fn();
  }

  return {
    sessions,
    loading,
    error,
    refetch,
    revokeSessionById: (sessionId: string) =>
      withFreshToken(() => revokeSessionMut({ variables: { sessionId } })),
    revokeOtherSessions: () => withFreshToken(() => revokeOthers()),
    revoking: revokingOne || revokingOthers,
  };
}
