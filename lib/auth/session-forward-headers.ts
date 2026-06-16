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

import type { NextRequest } from 'next/server';

/** Headers forwarded to GraphQL so backend can resolve device/IP for sessions. */
const SESSION_FORWARD_HEADERS = [
  'user-agent',
  'x-forwarded-for',
  'x-real-ip',
  'cf-connecting-ip',
  'x-device-id',
  'x-device-name',
  'x-app-version',
] as const;

function readHeaderValue(
  value: string | string[] | null | undefined,
): string | undefined {
  if (!value) return undefined;
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed || undefined;
}

export function buildSessionForwardHeaders(
  source: Headers | Record<string, string | string[] | undefined | null>,
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const name of SESSION_FORWARD_HEADERS) {
    let value: string | undefined;

    if (source instanceof Headers) {
      value = source.get(name) ?? undefined;
    } else {
      const key = name in source ? name : name.toLowerCase();
      value = readHeaderValue(source[key] ?? source[name]);
    }

    if (value) {
      out[name] = value;
    }
  }

  return out;
}

export function buildSessionForwardHeadersFromNextRequest(
  request: NextRequest,
): Record<string, string> {
  return buildSessionForwardHeaders(request.headers);
}

/** Read incoming browser headers in a Server Action / RSC context. */
export async function getServerActionSessionHeaders(): Promise<
  Record<string, string>
> {
  const { headers } = await import('next/headers');
  const headerStore = await headers();
  const out = buildSessionForwardHeaders(headerStore);

  if (!out['x-forwarded-for'] && out['x-real-ip']) {
    out['x-forwarded-for'] = out['x-real-ip'];
  }

  if (!out['x-forwarded-for']) {
    const host = headerStore.get('host');
    if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
      out['x-forwarded-for'] = '127.0.0.1';
    }
  }

  return out;
}
