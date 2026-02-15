'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApolloClient } from '@apollo/client/react';
import { useAuthStore } from '@/stores/auth';
import { setClientAccessToken } from '@/lib/apollo/client';
import { showSuccess } from '@/lib/toast';

/**
 * Client-side logout hook.
 *
 * Flow:
 * 1. POST /api/auth/logout  (clears cookies + calls backend signOut)
 * 2. Clear Apollo Client cache
 * 3. Clear Zustand auth store
 * 4. Clear the in-memory access token
 * 5. Show toast + redirect to /login
 */
export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const apolloClient = useApolloClient();

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Continue with client-side cleanup even if the API call fails
    }

    // Clear Apollo Client cache (removes all cached data from the previous user)
    try {
      await apolloClient.clearStore();
    } catch {
      // clearStore can throw if there are active queries; ignore
    }

    // Clear Zustand auth state
    useAuthStore.getState().clearAuth();

    // Clear in-memory token
    setClientAccessToken(null);

    showSuccess('Đã đăng xuất');

    router.push('/login');
  }, [isLoggingOut, apolloClient, router]);

  return { logout, isLoggingOut };
}
