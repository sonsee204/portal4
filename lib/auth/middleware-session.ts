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
import { buildSessionForwardHeadersFromNextRequest } from '@/lib/auth/session-forward-headers';
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
  isOwner: boolean;
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
  cookieNames: SessionCookieNames
): { accessToken?: string; refreshToken?: string; userRole?: string } {
  return {
    accessToken: request.cookies.get(cookieNames.ACCESS_TOKEN)?.value,
    refreshToken: request.cookies.get(cookieNames.REFRESH_TOKEN)?.value,
    userRole: request.cookies.get(cookieNames.USER_ROLE)?.value,
    isOwner: cookieNames.IS_OWNER
      ? request.cookies.get(cookieNames.IS_OWNER)?.value
      : undefined,
  };
}

function applySessionCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
  role: string,
  config: MiddlewareAuthConfig
): void {
  const options = buildSessionCookieOptions(tokens, config.cookieBaseOptions);

  response.cookies.set(
    config.cookieNames.ACCESS_TOKEN,
    tokens.accessToken,
    options.access
  );
  response.cookies.set(
    config.cookieNames.REFRESH_TOKEN,
    tokens.refreshToken,
    options.refresh
  );
  response.cookies.set(config.cookieNames.USER_ROLE, role, options.role);
}

/**
 * Mark a response as never-cacheable by any shared cache. MUST be applied to
 * every response that reads or mutates auth cookies — otherwise a CDN/edge
 * proxy can store a response carrying one user's `Set-Cookie` and replay it to
 * another user, which makes sessions bleed across devices.
 */
export function applyNoStore(response: NextResponse): void {
  response.headers.set(
    'Cache-Control',
    'private, no-store, no-cache, max-age=0, must-revalidate'
  );
  response.headers.set('CDN-Cache-Control', 'no-store');
  response.headers.set('Vercel-CDN-Cache-Control', 'no-store');
}

export function clearAuthCookies(
  response: NextResponse,
  cookieNames: SessionCookieNames
): void {
  response.cookies.delete(cookieNames.ACCESS_TOKEN);
  response.cookies.delete(cookieNames.REFRESH_TOKEN);
  response.cookies.delete(cookieNames.USER_ROLE);
  if (cookieNames.PORTAL_CAPABILITIES) {
    response.cookies.delete(cookieNames.PORTAL_CAPABILITIES);
  }
  if (cookieNames.IS_OWNER) {
    response.cookies.delete(cookieNames.IS_OWNER);
  }
  if (cookieNames.HAS_VENUE_ACCESS) {
    response.cookies.delete(cookieNames.HAS_VENUE_ACCESS);
  }
  applyNoStore(response);
}

export async function resolveAuthSession(
  request: NextRequest,
  config: MiddlewareAuthConfig
): Promise<ResolvedAuthSession> {
  const { accessToken, refreshToken, userRole, isOwner } = readTokens(
    request,
    config.cookieNames
  );
  const ownerFlag = isOwner === '1';

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(accessToken, config.jwtSecret);
      const tokenPayload = payload as { sub?: string; role?: string };

      if (!isJwtExpired(accessToken, 0)) {
        return {
          accessToken,
          userId: tokenPayload.sub ?? null,
          role: tokenPayload.role ?? userRole ?? null,
          isOwner: ownerFlag,
          refreshed: false,
          authFailure: false,
          networkFailure: false,
        };
      }
    } catch (error) {
      // Nếu lỗi chữ ký (secret không khớp), thử decode mà không verify để lấy payload
      if (error instanceof joseErrors.JWSSignatureVerificationFailed) {
        console.warn(
          '[Middleware] JWT signature verification failed – decoding without verify (dev mode)'
        );
        try {
          const decoded = JSON.parse(
            Buffer.from(accessToken.split('.')[1], 'base64').toString()
          );
          if (!isJwtExpired(accessToken, 0)) {
            return {
              accessToken,
              userId: decoded.sub ?? null,
              role: decoded.role ?? userRole ?? null,
              refreshed: false,
              authFailure: false,
              networkFailure: false,
            };
          }
          // Token hết hạn, tiếp tục xuống refresh bên dưới
        } catch (decodeError) {
          console.error(
            '[Middleware] Failed to decode accessToken',
            decodeError
          );
          return {
            accessToken: null,
            userId: null,
            role: null,
            refreshed: false,
            authFailure: true,
            networkFailure: false,
          };
        }
      } else if (!(error instanceof joseErrors.JWTExpired)) {
        return {
          accessToken: null,
          userId: null,
          role: null,
          isOwner: false,
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
      isOwner: ownerFlag,
      refreshed: false,
      authFailure: !accessToken,
      networkFailure: false,
    };
  }

  const refreshResult = await performTokenRefresh(
    config.graphqlUrl,
    refreshToken,
    config.clientSource
  );

  if (refreshResult.kind === 'success') {
    // Decode payload từ accessToken cũ (nếu có) để lấy sub/role, nhưng ưu tiên từ refreshResult
    let userId: string | null = null;
    let role: string | null = null;
    if (refreshResult.accessToken) {
      try {
        const decoded = JSON.parse(
          Buffer.from(
            refreshResult.accessToken.split('.')[1],
            'base64'
          ).toString()
        );
        userId = decoded.sub ?? null;
        role = decoded.role ?? null;
      } catch {
        // ignore
      }
    }
    userId = userId ?? refreshResult.user._id;
    role = role ?? refreshResult.user.role;

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
      isOwner: false,
      refreshed: false,
      authFailure: true,
      networkFailure: false,
    };
  }

  return {
    accessToken: accessToken ?? null,
    userId: null,
    role: userRole ?? null,
    isOwner: ownerFlag,
    refreshed: false,
    authFailure: false,
    networkFailure: true,
  };
}

export function enrichAuthResponse(
  response: NextResponse,
  session: ResolvedAuthSession,
  config: MiddlewareAuthConfig
): NextResponse {
  if (session.refreshTokens) {
    applySessionCookies(
      response,
      {
        accessToken: session.refreshTokens.accessToken,
        refreshToken: session.refreshTokens.refreshToken,
      },
      session.refreshTokens.role,
      config
    );
  }

  if (session.userId) {
    response.headers.set('x-user-id', session.userId);
  }
  if (session.role) {
    response.headers.set('x-user-role', session.role);
  }

  // Authenticated responses may carry refreshed `Set-Cookie` headers — never
  // let a shared cache store them.
  applyNoStore(response);

  return response;
}
