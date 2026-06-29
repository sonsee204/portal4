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

'use client';

import { resolveConnectionFirst, type LegacyPagePagination } from './useCursorConnection';

/** Build GraphQL variables for cursor pages — always includes sort for fetchMore parity. */
export function buildSortedConnectionVariables<TSort>(
  base: Record<string, unknown>,
  sort: TSort | undefined,
  pagination?: LegacyPagePagination,
  after?: string | null,
): Record<string, unknown> {
  const first = resolveConnectionFirst(pagination);
  return {
    ...base,
    sort,
    pagination: { first, after: after ?? null },
  };
}

export const SORTED_CONNECTION_FETCH_POLICY = 'cache-and-network' as const;
