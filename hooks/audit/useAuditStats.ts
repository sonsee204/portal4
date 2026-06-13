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

import type { AuditStats } from '@/types';
import type { WatchQueryFetchPolicy } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import { AUDIT_GET_STATS } from '@/graphql/queries/audit';

export function useAuditStats(options?: {
  fetchPolicy?: WatchQueryFetchPolicy;
}) {
  const { data, loading, error, refetch } = useQuery<{ auditStats: AuditStats }>(
    AUDIT_GET_STATS,
    { fetchPolicy: options?.fetchPolicy },
  );

  return {
    stats: data?.auditStats,
    loading,
    error,
    refetch,
  };
}
