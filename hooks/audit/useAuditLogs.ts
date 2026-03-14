'use client';

import type { AuditLog, AuditLogList, AuditFilterInput } from '@/types';
import type { WatchQueryFetchPolicy } from '@apollo/client';

import { useQuery } from '@apollo/client/react';
import { AUDIT_GET_LOGS } from '@/graphql/queries/audit';

export type AuditLogEntry = AuditLog;

interface AuditLogsResult {
  auditLogs: AuditLogList;
}

interface AuditLogsVariables {
  filter?: AuditFilterInput;
  pagination?: { page: number; limit: number };
}

export function useAuditLogs(
  variables: AuditLogsVariables,
  options?: { skip?: boolean; fetchPolicy?: WatchQueryFetchPolicy },
) {
  const { data, loading, error, refetch } = useQuery<AuditLogsResult>(
    AUDIT_GET_LOGS,
    {
      variables,
      skip: options?.skip,
      fetchPolicy: options?.fetchPolicy,
    },
  );

  const result = data?.auditLogs;

  return {
    logs: result?.logs ?? [],
    total: result?.total ?? 0,
    hasMore: result?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}
