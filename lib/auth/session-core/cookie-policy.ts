import { accessTokenMaxAge, refreshTokenMaxAge } from './jwt';
import type { SessionTokens } from './types';

export interface CookieSetOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none';
  path?: string;
  maxAge: number;
}

export interface SessionCookieNames {
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  USER_ROLE: string;
}

export interface BaseCookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  path: string;
}

export function buildSessionCookieOptions(
  tokens: SessionTokens,
  baseOptions: BaseCookieOptions,
): {
  access: CookieSetOptions;
  refresh: CookieSetOptions;
  role: CookieSetOptions;
} {
  return {
    access: {
      ...baseOptions,
      maxAge: accessTokenMaxAge(tokens.accessToken),
    },
    refresh: {
      ...baseOptions,
      maxAge: refreshTokenMaxAge(tokens.refreshToken),
    },
    role: {
      ...baseOptions,
      httpOnly: false,
      maxAge: refreshTokenMaxAge(tokens.refreshToken),
    },
  };
}
