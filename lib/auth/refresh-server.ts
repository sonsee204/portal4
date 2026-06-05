import { performTokenRefresh } from '@nalee-sports/auth/refresh-graphql';
import {
  clearSession,
  getRefreshToken,
  setSession,
} from './session';
import { GRAPHQL_URL } from './constants';

export type RefreshSessionResult =
  | { ok: true; accessToken: string }
  | { ok: false; reason: 'no_refresh' | 'auth_failure' | 'network_failure' };

export async function refreshSessionFromCookie(): Promise<RefreshSessionResult> {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return { ok: false, reason: 'no_refresh' };
  }

  const result = await performTokenRefresh(
    GRAPHQL_URL,
    refreshToken,
    'portal',
  );

  if (result.kind === 'success') {
    await setSession(
      {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
      result.user.role,
    );
    return { ok: true, accessToken: result.accessToken };
  }

  if (result.kind === 'auth_failure') {
    await clearSession();
    return { ok: false, reason: 'auth_failure' };
  }

  return { ok: false, reason: 'network_failure' };
}
