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

/**
 * Environment variable validation and access
 */

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  return value ?? '';
}

export const env = {
  /** GraphQL API URL (backend) */
  graphqlUrl:
    getEnv('NEXT_PUBLIC_GRAPHQL_URL') ||
    (typeof window === 'undefined'
      ? process.env.NODE_ENV === 'development'
        ? 'http://localhost:4000/graphql'
        : '/graphql'
      : '/graphql'),
  /** Public site URL (for canonical, OG, etc.) */
  siteUrl: getEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3002'),
  /** Google Analytics ID (optional) */
  gaId: getEnv('NEXT_PUBLIC_GA_ID'),
} as const;
