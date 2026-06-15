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

import { useEffect, useRef, type ReactNode } from 'react';
import { refreshViaApiRoute } from '@/lib/auth/session-core';
import {
  getClientAccessToken,
  reconnectWebSocket,
  setClientAccessToken,
} from '@/lib/apollo/client';
import { redirectToLogin } from '@/lib/apollo/token';
import { useAuthStore } from '@/stores/auth';
import { getGraphqlUrl } from '@/lib/apollo/urls';

const FALLBACK_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000;

/**
 * Interval for checking whether the current session is still alive on the
 * backend. This allows the portal to detect remote revocation (e.g. another
 * device called "revoke other sessions") within a reasonable time without
 * waiting for the access token to expire naturally.
 */
const SESSION_LIVENESS_CHECK_INTERVAL_MS = 60 * 1000;

const SESSION_LIVENESS_QUERY = JSON.stringify({
  query: 'query SessionPing { mySessions { id } }',
});

function scheduleDelay(accessExpiresAt: number | null): number {
  if (!accessExpiresAt) {
    return FALLBACK_REFRESH_INTERVAL_MS;
  }

  const expiresAtMs = accessExpiresAt * 1000;
  const delay = expiresAtMs - Date.now() - REFRESH_BEFORE_EXPIRY_MS;
  return delay > 60_000 ? delay : FALLBACK_REFRESH_INTERVAL_MS;
}

export function SessionRefreshProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const livenessRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!user) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (livenessRef.current) {
        clearInterval(livenessRef.current);
        livenessRef.current = null;
      }
      return;
    }

    let cancelled = false;

    async function scheduleNextRefresh() {
      if (cancelled) return;

      let accessExpiresAt: number | null = null;
      try {
        const res = await fetch('/api/auth/session', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = (await res.json()) as {
            accessExpiresAt?: number | null;
            accessToken?: string | null;
          };
          accessExpiresAt = data.accessExpiresAt ?? null;
          if (data.accessToken) {
            setClientAccessToken(data.accessToken);
          }
        }
      } catch {
        // Use fallback interval
      }

      const delay = scheduleDelay(accessExpiresAt);
      timerRef.current = setTimeout(() => {
        void runRefresh();
      }, delay);
    }

    async function runRefresh() {
      if (cancelled) return;

      const result = await refreshViaApiRoute();
      if (result.status === 'success') {
        setClientAccessToken(result.accessToken);
        reconnectWebSocket();
      } else if (result.status === 'auth_failed') {
        setClientAccessToken(null);
        redirectToLogin();
      }

      if (!cancelled) {
        void scheduleNextRefresh();
      }
    }

    /**
     * Periodically ping the backend with the current access token so that
     * JwtStrategy can detect a revoked session and return 401. The portal
     * then attempts a token refresh; if the refresh token is also revoked
     * the user is redirected to the login page.
     */
    async function checkSessionLiveness() {
      if (cancelled) return;

      const token = getClientAccessToken();
      if (!token) return;

      try {
        const res = await fetch(getGraphqlUrl(), {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'x-client-source': 'portal',
            'Apollo-Require-Preflight': 'true',
            Authorization: `Bearer ${token}`,
          },
          body: SESSION_LIVENESS_QUERY,
        });

        if (res.status === 401 || res.status === 403) {
          const result = await refreshViaApiRoute();
          if (result.status === 'success') {
            setClientAccessToken(result.accessToken);
            reconnectWebSocket();
          } else if (result.status === 'auth_failed') {
            setClientAccessToken(null);
            if (!cancelled) redirectToLogin();
          }
        }
      } catch {
        // Network error — do not log out, will retry on next interval.
      }
    }

    void scheduleNextRefresh();

    livenessRef.current = setInterval(() => {
      void checkSessionLiveness();
    }, SESSION_LIVENESS_CHECK_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (livenessRef.current) {
        clearInterval(livenessRef.current);
        livenessRef.current = null;
      }
    };
  }, [user]);

  return <>{children}</>;
}
