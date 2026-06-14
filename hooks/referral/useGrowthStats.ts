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
import {
  GET_GROWTH_STATS,
  GET_PARTNER_LEADERBOARD,
} from '@/graphql/referral/queries';
import type {
  GrowthStats,
  PartnerLeaderboard,
  ReferralFilterInput,
} from '@/types';

export function useGrowthStats(filter?: ReferralFilterInput) {
  const variables = filter ? { filter } : {};

  const { data, loading, error, refetch } = useQuery<{
    getGrowthStats: GrowthStats;
  }>(GET_GROWTH_STATS, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return {
    stats: data?.getGrowthStats,
    loading,
    error,
    refetch,
  };
}

export function usePartnerLeaderboard(filter?: ReferralFilterInput) {
  const variables = filter ? { filter } : {};

  const { data, loading, error, refetch } = useQuery<{
    getPartnerLeaderboard: PartnerLeaderboard;
  }>(GET_PARTNER_LEADERBOARD, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return {
    leaderboard: data?.getPartnerLeaderboard,
    loading,
    error,
    refetch,
  };
}
