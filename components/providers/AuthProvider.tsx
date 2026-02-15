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
  const { setUser, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) return;

    let cancelled = false;

    async function initAuth() {
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
  }, [isInitialized, setUser, setInitialized]);

  return <>{children}</>;
}
