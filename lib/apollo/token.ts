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

let _accessToken: string | null = null;
let _wsDispose: (() => void) | null = null;

export function setClientAccessToken(token: string | null) {
  _accessToken = token;
}

export function getClientAccessToken(): string | null {
  return _accessToken;
}

export function registerWsClientDisposer(dispose: () => void): void {
  _wsDispose = dispose;
}

export function reconnectWebSocket(): void {
  if (_wsDispose) {
    _wsDispose();
    _wsDispose = null;
  }
}

export function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  const redirect = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`,
  );
  window.location.href = `/login?redirect=${redirect}`;
}
