import { create } from 'zustand';
import type { UserRole, AuthUser } from '@/types';

export type { UserRole, AuthUser };

interface AuthState {
  /** Current authenticated user */
  user: AuthUser | null;
  /** Whether auth state has been initialized */
  isInitialized: boolean;
  /** Whether a fetch is in progress */
  isLoading: boolean;

  /** Set the authenticated user */
  setUser: (user: AuthUser | null) => void;
  /** Mark auth as initialized */
  setInitialized: (initialized: boolean) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Clear auth state (logout) */
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isInitialized: false,
  isLoading: true,

  setUser: (user) => set({ user, isLoading: false }),
  setInitialized: (initialized) => set({ isInitialized: initialized }),
  setLoading: (loading) => set({ isLoading: loading }),
  clearAuth: () =>
    set({ user: null, isInitialized: true, isLoading: false }),
}));

/**
 * Helper selectors
 */
export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) =>
  state.user !== null;
export const selectUserRole = (state: AuthState) => state.user?.role ?? null;
export const selectIsAdmin = (state: AuthState) =>
  state.user?.role === 'ADMIN' || state.user?.role === 'SUPER_ADMIN';
export const selectIsSuperAdmin = (state: AuthState) =>
  state.user?.role === 'SUPER_ADMIN';
