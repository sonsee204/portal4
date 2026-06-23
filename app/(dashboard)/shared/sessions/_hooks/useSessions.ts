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

import { useCallback, useEffect, useState } from 'react';
import type { ErrorLike } from '@apollo/client';
import { showError, showSuccess } from '@/lib/toast';

export interface SessionDeviceInfo {
  deviceId?: string | null;
  deviceName?: string | null;
  platform?: string | null;
  osVersion?: string | null;
  appVersion?: string | null;
}

export interface SessionItem {
  id: string;
  deviceName?: string | null;
  platform?: string | null;
  ipAddress?: string | null;
  loginLocation?: string | null;
  clientSource?: string | null;
  lastUsedAt?: string | null;
  createdAt: string;
  isCurrent: boolean;
  deviceInfo?: SessionDeviceInfo | null;
}

/**
 * Sessions are read and revoked exclusively through the BFF (`/api/auth/sessions`),
 * which uses the HttpOnly cookie access token server-side. This guarantees the
 * authoritative session `sid` for THIS browser is always used — both for the
 * `isCurrent` badge and for revoke operations — instead of the in-memory Apollo
 * token singleton, which can diverge or be contaminated across requests.
 */
export function useSessions() {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorLike | undefined>(undefined);
  const [revoking, setRevoking] = useState(false);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const res = await fetch('/api/auth/sessions', {
        credentials: 'include',
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error('Không thể tải danh sách phiên đăng nhập');
      }
      const payload = (await res.json()) as { sessions?: SessionItem[] };
      setSessions(payload.sessions ?? []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const revoke = useCallback(
    async (
      body: { mode: 'others' } | { mode: 'one'; sessionId: string },
      successMessage: string,
    ) => {
      setRevoking(true);
      try {
        const res = await fetch('/api/auth/sessions', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as {
            error?: string;
          } | null;
          throw new Error(payload?.error ?? 'Thao tác thất bại');
        }

        showSuccess(successMessage);
        await refetch();
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Thao tác thất bại');
      } finally {
        setRevoking(false);
      }
    },
    [refetch],
  );

  return {
    sessions,
    loading,
    error,
    refetch,
    revokeSessionById: (sessionId: string) =>
      revoke({ mode: 'one', sessionId }, 'Đã đăng xuất thiết bị'),
    revokeOtherSessions: () =>
      revoke({ mode: 'others' }, 'Đã đăng xuất tất cả thiết bị khác'),
    revoking,
  };
}
