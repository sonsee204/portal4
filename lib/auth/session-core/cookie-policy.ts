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
  IS_OWNER?: string;
  PORTAL_CAPABILITIES?: string;
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
