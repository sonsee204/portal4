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
import { GET_PROMOTION_STATS } from '@/graphql/owner/promotions';
import type { GetPromotionStatsQuery } from '@/graphql/generated';

export function usePromotionStats(venueId: string | null) {
  const { data, loading, error, refetch } = useQuery<GetPromotionStatsQuery>(
    GET_PROMOTION_STATS,
    {
      variables: { venueId: venueId ?? '' },
      skip: !venueId,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    stats: data?.promotionStats ?? null,
    loading,
    error,
    refetch,
  };
}
