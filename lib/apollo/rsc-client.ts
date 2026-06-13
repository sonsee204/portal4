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
 * Lightweight GraphQL client for Server Components (RSC).
 * Uses fetch directly - no Apollo Client in RSC.
 * Reads auth token from HttpOnly cookies.
 */

import { getAccessToken } from '@/lib/auth/session';

const getGraphqlUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (url) return url;
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000/graphql'
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002'}/graphql`;
};

export type RscGraphqlOptions = {
  revalidate?: number | false;
  cache?: RequestCache;
  /** If true, include auth token in request */
  authenticated?: boolean;
};

export async function rscGraphql<T = unknown>(
  query: string,
  variables?: Record<string, unknown>,
  options: RscGraphqlOptions = {},
): Promise<T> {
  const { revalidate = 60, cache = 'force-cache', authenticated = true } =
    options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Apollo-Require-Preflight': 'true',
    'x-client-source': 'portal',
  };

  // Include auth token if requested and available
  if (authenticated) {
    const accessToken = await getAccessToken();
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const res = await fetch(getGraphqlUrl(), {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    next: { revalidate, tags: ['graphql'] },
    cache,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL request failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(
      json.errors.map((e: { message: string }) => e.message).join('; '),
    );
  }
  return json.data as T;
}
