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

import type { MiddlewareAuthConfig } from '@/lib/auth/middleware-session';
import { AUTH_COOKIES, COOKIE_OPTIONS, GRAPHQL_URL } from './constants';

export function getJwtAccessSecret(): string {
  return (
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    'nalee-sports-jwt-secret'
  );
}

export function createPortalMiddlewareAuthConfig(): MiddlewareAuthConfig {
  return {
    graphqlUrl: GRAPHQL_URL,
    jwtSecret: new TextEncoder().encode(getJwtAccessSecret()),
    clientSource: 'portal',
    cookieNames: AUTH_COOKIES,
    cookieBaseOptions: COOKIE_OPTIONS,
  };
}
