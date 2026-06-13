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

const LOCK_NAME = 'nalee-token-refresh';

let inFlightRefresh: Promise<RefreshApiResult> | null = null;

export type RefreshApiResult =
  | { status: 'success'; accessToken: string }
  | { status: 'auth_failed' }
  | { status: 'network_failed' };

async function executeRefresh(): Promise<RefreshApiResult> {
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (response.status === 401 || response.status === 403) {
    return { status: 'auth_failed' };
  }

  if (!response.ok) {
    return { status: 'network_failed' };
  }

  const data = (await response.json()) as { accessToken?: string };
  if (!data.accessToken) {
    return { status: 'auth_failed' };
  }

  return { status: 'success', accessToken: data.accessToken };
}

async function refreshWithInMemoryDedup(): Promise<RefreshApiResult> {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = executeRefresh().finally(() => {
    inFlightRefresh = null;
  });

  return inFlightRefresh;
}

/**
 * Ensures only one token refresh runs at a time (cross-tab when supported).
 */
export async function withRefreshMutex<T>(
  fn: () => Promise<T>,
): Promise<T> {
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.locks?.request === 'function'
  ) {
    return navigator.locks.request(LOCK_NAME, () => fn());
  }

  return fn();
}

/**
 * Client-side refresh via BFF route.
 */
export async function refreshViaApiRoute(): Promise<RefreshApiResult> {
  if (
    typeof navigator !== 'undefined' &&
    typeof navigator.locks?.request === 'function'
  ) {
    return navigator.locks.request(LOCK_NAME, () => refreshWithInMemoryDedup());
  }

  return refreshWithInMemoryDedup();
}
