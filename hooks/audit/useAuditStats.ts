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
