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
