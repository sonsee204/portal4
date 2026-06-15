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

import { jwtVerify, errors as joseErrors } from 'jose';
import type { NextRequest, NextResponse } from 'next/server';
import {
  buildSessionCookieOptions,
  isJwtExpired,
  performTokenRefresh,
} from '@/lib/auth/session-core';
import type {
  BaseCookieOptions,
  ClientSource,
  SessionCookieNames,
} from '@/lib/auth/session-core';

export interface MiddlewareAuthConfig {
  graphqlUrl: string;
  jwtSecret: Uint8Array;
  clientSource: ClientSource;
  cookieNames: SessionCookieNames;
  cookieBaseOptions: BaseCookieOptions;
}

export interface ResolvedAuthSession {
  accessToken: string | null;
  userId: string | null;
  role: string | null;
  refreshed: boolean;
  refreshTokens?: {
    accessToken: string;
    refreshToken: string;
    role: string;
  };
  authFailure: boolean;
  networkFailure: boolean;
}

function readTokens(
  request: NextRequest,
  cookieNames: SessionCookieNames,
): { accessToken?: string; refreshToken?: string; userRole?: string } {
  return {
    accessToken: request.cookies.get(cookieNames.ACCESS_TOKEN)?.value,
    refreshToken: request.cookies.get(cookieNames.REFRESH_TOKEN)?.value,
    userRole: request.cookies.get(cookieNames.USER_ROLE)?.value,
  };
}

function applySessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
  role: string,
  config: MiddlewareAuthConfig,
): void {
  const options = buildSessionCookieOptions(tokens, config.cookieBaseOptions);

  response.cookies.set(
    config.cookieNames.ACCESS_TOKEN,
    tokens.accessToken,
    options.access,
  );
  response.cookies.set(
    config.cookieNames.REFRESH_TOKEN,
    tokens.refreshToken,
    options.refresh,
  );
  response.cookies.set(config.cookieNames.USER_ROLE, role, options.role);
}

export function clearAuthCookies(
  response: NextResponse,
  cookieNames: SessionCookieNames,
): void {
  response.cookies.delete(cookieNames.ACCESS_TOKEN);
  response.cookies.delete(cookieNames.REFRESH_TOKEN);
  response.cookies.delete(cookieNames.USER_ROLE);
  if ('PORTAL_CAPABILITIES' in cookieNames) {
    response.cookies.delete(
      (cookieNames as { PORTAL_CAPABILITIES: string }).PORTAL_CAPABILITIES,
    );
  }
}

export async function resolveAuthSession(
  request: NextRequest,
  config: MiddlewareAuthConfig,
): Promise<ResolvedAuthSession> {
  const { accessToken, refreshToken, userRole } = readTokens(
    request,
    config.cookieNames,
  );

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, config.jwtSecret);
      const tokenPayload = payload as { sub?: string; role?: string };

      if (!isJwtExpired(accessToken, 0)) {
        return {
          accessToken,
          userId: tokenPayload.sub ?? null,
          role: tokenPayload.role ?? userRole ?? null,
          refreshed: false,
          authFailure: false,
          networkFailure: false,
        };
      }
    } catch (error) {
      if (!(error instanceof joseErrors.JWTExpired)) {
        return {
          accessToken: null,
          userId: null,
          role: null,
          refreshed: false,
          authFailure: true,
          networkFailure: false,
        };
      }
    }
  }

  if (!refreshToken) {
    return {
      accessToken: null,
      userId: null,
      role: userRole ?? null,
      refreshed: false,
      authFailure: !accessToken,
      networkFailure: false,
    };
  }

  const refreshResult = await performTokenRefresh(
    config.graphqlUrl,
    refreshToken,
    config.clientSource,
  );

  if (refreshResult.kind === 'success') {
    const { payload } = await jwtVerify(
      refreshResult.accessToken,
      config.jwtSecret,
    );
    const tokenPayload = payload as { sub?: string; role?: string };

    return {
      accessToken: refreshResult.accessToken,
      userId: tokenPayload.sub ?? refreshResult.user._id,
      role: tokenPayload.role ?? refreshResult.user.role,
      refreshed: true,
      refreshTokens: {
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.refreshToken,
        role: refreshResult.user.role,
      },
      authFailure: false,
      networkFailure: false,
    };
  }

  if (refreshResult.kind === 'auth_failure') {
    return {
      accessToken: null,
      userId: null,
      role: null,
      refreshed: false,
      authFailure: true,
      networkFailure: false,
    };
  }

  return {
    accessToken: accessToken ?? null,
    userId: null,
    role: userRole ?? null,
    refreshed: false,
    authFailure: false,
    networkFailure: true,
  };
}

export function enrichAuthResponse(
  response: NextResponse,
  session: ResolvedAuthSession,
  config: MiddlewareAuthConfig,
): NextResponse {
  if (session.refreshTokens) {
    applySessionCookies(
      response,
      {
        accessToken: session.refreshTokens.accessToken,
        refreshToken: session.refreshTokens.refreshToken,
      },
      session.refreshTokens.role,
      config,
    );
  }

  if (session.userId) {
    response.headers.set('x-user-id', session.userId);
  }
  if (session.role) {
    response.headers.set('x-user-role', session.role);
  }

  return response;
}
