/**
 * Auth cookie names and configuration constants
 */

export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'portal_access_token',
  REFRESH_TOKEN: 'portal_refresh_token',
  USER_ROLE: 'portal_user_role',
} as const;

/**
 * Cookie options
 */
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

/**
 * Token expiry durations (in seconds)
 */
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: 15 * 60, // 15 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days
} as const;

/**
 * Public routes that don't require authentication
 */
export const PUBLIC_ROUTES = ['/login', '/forgot-password', '/maintenance'] as const;

/**
 * Routes prefixes to skip in middleware
 * (Defense-in-depth — matcher config already excludes these,
 *  but keeps the function-level check as a safety net.)
 */
export const SKIP_MIDDLEWARE_PREFIXES = [
  '/_next',
  '/api',
  '/favicon.ico',
  '/svg', // public/svg/* is served at /svg/*
] as const;

/**
 * GraphQL API URL (server-side)
 */
export const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
