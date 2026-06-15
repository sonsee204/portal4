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

export function getGraphqlUrl(): string {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (url) return url;
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/graphql'
      : '/graphql';
  }
  return '/graphql';
}

export function getGraphqlWsUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL;
  if (explicit) return explicit;

  const httpUrl = getGraphqlUrl();
  if (httpUrl.startsWith('http://') || httpUrl.startsWith('https://')) {
    return httpUrl.replace(/^http/, 'ws');
  }
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${httpUrl}`;
  }
  return 'ws://localhost:4000/graphql';
}
