'use client';

import { useQuery } from '@apollo/client/react';
import {
  GET_GROWTH_STATS,
  GET_PARTNER_LEADERBOARD,
} from '@/graphql/queries/referral';
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
