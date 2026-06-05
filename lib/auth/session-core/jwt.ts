import {
  COOKIE_EXPIRY_BUFFER_SECONDS,
  DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS,
  DEFAULT_REFRESH_TOKEN_MAX_AGE_SECONDS,
} from './constants';

interface JwtPayloadBase {
  exp?: number;
  sub?: string;
  role?: string;
}

/**
 * Decode JWT payload without verification (for exp / claims only).
 * Edge-safe — uses atob only.
 */
export function decodeJwtPayload(token: string): JwtPayloadBase | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    if (typeof atob === 'undefined') {
      return null;
    }

    const json = atob(padded);

    return JSON.parse(json) as JwtPayloadBase;
  } catch {
    return null;
  }
}

export function decodeJwtExp(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === 'number' ? payload.exp : null;
}

export function isJwtExpired(
  token: string,
  bufferSeconds = COOKIE_EXPIRY_BUFFER_SECONDS,
): boolean {
  const exp = decodeJwtExp(token);
  if (exp === null) {
    return true;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  return exp <= nowSeconds + bufferSeconds;
}

export function secondsUntilExpiry(
  token: string,
  fallbackSeconds: number,
  bufferSeconds = COOKIE_EXPIRY_BUFFER_SECONDS,
): number {
  const exp = decodeJwtExp(token);
  if (exp === null) {
    return fallbackSeconds;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const remaining = exp - nowSeconds - bufferSeconds;
  return remaining > 0 ? remaining : fallbackSeconds;
}

export function accessTokenMaxAge(token: string): number {
  return secondsUntilExpiry(
    token,
    DEFAULT_ACCESS_TOKEN_MAX_AGE_SECONDS,
    COOKIE_EXPIRY_BUFFER_SECONDS,
  );
}

export function refreshTokenMaxAge(token: string): number {
  return secondsUntilExpiry(
    token,
    DEFAULT_REFRESH_TOKEN_MAX_AGE_SECONDS,
    COOKIE_EXPIRY_BUFFER_SECONDS,
  );
}
