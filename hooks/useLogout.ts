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

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient, useMutation } from '@apollo/client/react';
import { useAuthStore } from '@/stores/auth';
import { setClientAccessToken } from '@/lib/apollo/client';
import { showSuccess } from '@/lib/toast';
import { AUTH } from '@/lib/strings';
import { REMOVE_FCM_TOKEN } from '@/graphql/mutations/notification';
import { getFcmToken, clearStoredFcmToken } from '@/hooks/notification';

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [removeFcmToken] = useMutation(REMOVE_FCM_TOKEN);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    const fcmToken = getFcmToken();
    if (fcmToken) {
      try {
        await removeFcmToken({ variables: { token: fcmToken } });
      } catch {
        // Non-critical
      }
      clearStoredFcmToken();
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continue with client-side cleanup even if the API call fails
    }

    try {
      await apolloClient.clearStore();
    } catch {
      // clearStore can throw if there are active queries; ignore
    }

    useAuthStore.getState().clearAuth();
    setClientAccessToken(null);

    showSuccess(AUTH.LOGOUT.SUCCESS);
    router.push('/login');
  }, [isLoggingOut, apolloClient, router, removeFcmToken]);

  return { logout, isLoggingOut };
}
