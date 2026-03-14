'use client';

import { useQuery } from '@apollo/client/react';
import { ADMIN_GET_SYSTEM_STATS } from '@/graphql/queries/admin';

export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  totalVenues: number;
  activeVenues: number;
  pendingVenues: number;
  totalBookings: number;
  totalRevenue: number;
}

export function useSystemStats() {
  const { data, loading, error, refetch } = useQuery<{
    adminGetSystemStats: SystemStats;
  }>(ADMIN_GET_SYSTEM_STATS);

  return {
    stats: data?.adminGetSystemStats,
    loading,
    error,
    refetch,
  };
}
