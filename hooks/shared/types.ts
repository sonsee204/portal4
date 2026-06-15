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

import type { ErrorLike } from '@apollo/client';

/** Standard return shape for mutation hooks */
export interface MutationHookResult<TFn> {
  execute: TFn;
  loading: boolean;
}

/** Standard return shape for query hooks */
export interface QueryHookResult<T> {
  data: T | undefined;
  loading: boolean;
  error?: ErrorLike;
  refetch: () => void;
}

/** Standard return shape for paginated query hooks */
export interface PaginatedQueryHookResult<T> extends QueryHookResult<T[]> {
  total: number;
  page: number;
  totalPages: number;
}
