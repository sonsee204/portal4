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
import { reconnectWebSocket, setClientAccessToken } from '@/lib/apollo/client';
import { redirectToLogin } from '@/lib/apollo/token';
import { useAuthStore } from '@/stores/auth';

const FALLBACK_REFRESH_INTERVAL_MS = 10 * 60 * 1000;
const REFRESH_BEFORE_EXPIRY_MS = 2 * 60 * 1000;

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

  useEffect(() => {
    if (!user) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
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

    void scheduleNextRefresh();

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [user]);

  return <>{children}</>;
}
