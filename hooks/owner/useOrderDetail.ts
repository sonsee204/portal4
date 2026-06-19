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

import { useQuery } from '@apollo/client/react';
import { GET_ORDER } from '@/graphql/owner/queries';
import type { GetOrderQuery } from '@/graphql/generated';

export type OrderDetailNode = NonNullable<GetOrderQuery['order']>;

export function useOrderDetail(
  orderId: string | null,
  options?: { skip?: boolean },
) {
  const shouldSkip = !orderId || Boolean(options?.skip);

  const { data, loading, error, refetch } = useQuery<GetOrderQuery>(GET_ORDER, {
    variables: { orderId: orderId ?? '' },
    skip: shouldSkip,
  });

  return {
    order: data?.order ?? null,
    loading,
    error,
    refetch,
  };
}
