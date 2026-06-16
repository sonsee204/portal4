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

import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth';
import type { AuthUser } from '@/types';
import { getCurrentUser } from '@/lib/auth/actions';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Initializes auth state by fetching the current user from the server.
 * Place this inside dashboard layout to auto-fetch user on mount.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setInitialized, setLoading } = useAuthStore();

  useEffect(() => {
    let cancelled = false;

    async function initAuth() {
      setLoading(true);
      try {
        const user = await getCurrentUser();
        if (!cancelled) {
          setUser(user as AuthUser | null);
          setInitialized(true);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setInitialized(true);
        }
      }
    }

    void initAuth();

    return () => {
      cancelled = true;
    };
  }, [setUser, setInitialized, setLoading]);

  return <>{children}</>;
}
