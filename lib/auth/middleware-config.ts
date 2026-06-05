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
