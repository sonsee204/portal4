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
  GET_POST_REPORTS_FOR_ADMIN,
  GET_POST_REPORT_STATS,
  GET_USER_REPORTS_FOR_ADMIN,
  GET_USER_REPORT_STATS,
  GET_MESSAGE_REPORTS_FOR_ADMIN,
  GET_MESSAGE_REPORT_STATS,
} from '@/graphql/queries/moderation';
import type {
  GetMessageReportsForAdminQuery,
  GetPostReportsForAdminQuery,
  GetUserReportsForAdminQuery,
  PostReportStatus,
} from '@/graphql/generated';
import type {
  MessageModerationReport,
  MessageReportStatus,
  ModerationReport,
  UserModerationReport,
  UserReportStatus,
} from '@/app/(dashboard)/moderation/types';
import { usePagedConnectionQuery } from '@/hooks/shared/usePagedConnectionQuery';

export function usePostReports(
  filter?: { status?: PostReportStatus },
  pagination?: { page: number; limit: number },
) {
  const result = usePagedConnectionQuery<
    GetPostReportsForAdminQuery,
    ModerationReport,
    { filter?: { status?: PostReportStatus } }
  >({
    query: GET_POST_REPORTS_FOR_ADMIN,
    pagination,
    resetKey: JSON.stringify(filter ?? null),
    variables: { filter },
    getConnection: (data) => data?.getPostReportsForAdminConnection,
  });

  return {
    reports: result.items,
    total: result.total,
    hasMore: result.hasMore,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function usePostReportStats() {
  const { data, loading, error, refetch } = useQuery<{
    getPostReportStats: {
      totalReports: number;
      pendingReports: number;
      reviewedReports: number;
      resolvedReports: number;
      dismissedReports: number;
    };
  }>(GET_POST_REPORT_STATS);

  return { stats: data?.getPostReportStats, loading, error, refetch };
}

export function useUserReports(
  filter?: { status?: UserReportStatus },
  pagination?: { page: number; limit: number },
) {
  const result = usePagedConnectionQuery<
    GetUserReportsForAdminQuery,
    UserModerationReport,
    { filter?: { status?: UserReportStatus } }
  >({
    query: GET_USER_REPORTS_FOR_ADMIN,
    pagination,
    resetKey: JSON.stringify(filter ?? null),
    variables: { filter },
    getConnection: (data) => data?.getUserReportsForAdminConnection,
  });

  return {
    reports: result.items,
    total: result.total,
    hasMore: result.hasMore,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useUserReportStats() {
  const { data, loading, error, refetch } = useQuery<{
    getUserReportStats: {
      totalReports: number;
      pendingReports: number;
      reviewedReports: number;
      resolvedReports: number;
      dismissedReports: number;
    };
  }>(GET_USER_REPORT_STATS);

  return { stats: data?.getUserReportStats, loading, error, refetch };
}

export function useMessageReports(
  filter?: { status?: MessageReportStatus },
  pagination?: { page: number; limit: number },
) {
  const result = usePagedConnectionQuery<
    GetMessageReportsForAdminQuery,
    MessageModerationReport,
    { filter?: { status?: MessageReportStatus } }
  >({
    query: GET_MESSAGE_REPORTS_FOR_ADMIN,
    pagination,
    resetKey: JSON.stringify(filter ?? null),
    variables: { filter },
    getConnection: (data) => data?.messageReportsConnection,
  });

  return {
    reports: result.items,
    total: result.total,
    hasMore: result.hasMore,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useMessageReportStats() {
  const { data, loading, error, refetch } = useQuery<{
    getMessageReportStats: {
      totalReports: number;
      pendingReports: number;
      reviewedReports: number;
      resolvedReports: number;
      dismissedReports: number;
    };
  }>(GET_MESSAGE_REPORT_STATS);

  return { stats: data?.getMessageReportStats, loading, error, refetch };
}
