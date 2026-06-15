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

import { useQuery, useMutation } from '@apollo/client/react';
import {
  MY_SESSIONS,
  REVOKE_SESSION,
  REVOKE_OTHER_SESSIONS,
} from '@/graphql/auth/sessions';
import type { MySessionsQuery } from '@/graphql/generated';
import { showError, showSuccess } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';

export function useSessions() {
  const { data, loading, error, refetch } = useQuery<MySessionsQuery>(
    MY_SESSIONS,
    { fetchPolicy: 'network-only' },
  );

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

  return {
    sessions,
    loading,
    error,
    refetch,
    revokeSessionById: (sessionId: string) =>
      revokeSessionMut({ variables: { sessionId } }),
    revokeOtherSessions: () => revokeOthers(),
    revoking: revokingOne || revokingOthers,
  };
}
