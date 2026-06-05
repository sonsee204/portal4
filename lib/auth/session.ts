import { cookies } from 'next/headers';
import { buildSessionCookieOptions } from '@nalee-sports/auth/cookie-policy';
import { AUTH_COOKIES, COOKIE_OPTIONS } from './constants';
import type { SessionTokens } from '@/types';

export type { SessionTokens };

export async function setSession(
  tokens: SessionTokens,
  userRole: string,
): Promise<void> {
  const cookieStore = await cookies();
  const options = buildSessionCookieOptions(tokens, COOKIE_OPTIONS);

  cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, tokens.accessToken, options.access);
  cookieStore.set(
    AUTH_COOKIES.REFRESH_TOKEN,
    tokens.refreshToken,
    options.refresh,
  );
  cookieStore.set(AUTH_COOKIES.USER_ROLE, userRole, options.role);
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value ?? null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.REFRESH_TOKEN)?.value ?? null;
}

export async function getUserRole(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIES.USER_ROLE)?.value ?? null;
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
  cookieStore.delete(AUTH_COOKIES.USER_ROLE);
}

export async function hasSession(): Promise<boolean> {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();
  return accessToken !== null || refreshToken !== null;
}
