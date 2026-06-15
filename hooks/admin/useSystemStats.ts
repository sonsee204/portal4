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
import { ADMIN_GET_SYSTEM_STATS } from '@/graphql/admin/queries';

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
