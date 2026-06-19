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
import { GET_PROMOTION } from '@/graphql/owner/promotions';
import type { GetPromotionQuery } from '@/graphql/generated';

export type PromotionDetailNode = NonNullable<GetPromotionQuery['promotion']>;

export function usePromotion(promotionId: string | null) {
  const { data, loading, error, refetch } = useQuery<GetPromotionQuery>(
    GET_PROMOTION,
    {
      variables: { id: promotionId ?? '' },
      skip: !promotionId,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    promotion: data?.promotion ?? null,
    loading,
    error,
    refetch,
  };
}
