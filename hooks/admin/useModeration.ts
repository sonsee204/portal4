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
} from '@/graphql/moderation/queries';
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
} from '@/app/(dashboard)/admin/moderation/types';
import { usePagedConnectionQuery } from '@/hooks/shared/usePagedConnectionQuery';
import { mergeConnectionEdges, type LegacyPagePagination } from '@/hooks/shared/useCursorConnection';

export function usePostReports(
  filter?: { status?: PostReportStatus },
  pagination?: LegacyPagePagination,
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
    mergeConnection: (prev, next) => ({
      ...next,
      getPostReportsForAdminConnection: {
        ...next.getPostReportsForAdminConnection!,
        edges: mergeConnectionEdges(
          prev.getPostReportsForAdminConnection?.edges ?? [],
          next.getPostReportsForAdminConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    reports: result.items,
    total: result.total,
    totalCount: result.totalCount,
    hasMore: result.hasMore,
    hasNextPage: result.hasNextPage,
    loadMore: result.loadMore,
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
  pagination?: LegacyPagePagination,
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
    mergeConnection: (prev, next) => ({
      ...next,
      getUserReportsForAdminConnection: {
        ...next.getUserReportsForAdminConnection!,
        edges: mergeConnectionEdges(
          prev.getUserReportsForAdminConnection?.edges ?? [],
          next.getUserReportsForAdminConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    reports: result.items,
    total: result.total,
    totalCount: result.totalCount,
    hasMore: result.hasMore,
    hasNextPage: result.hasNextPage,
    loadMore: result.loadMore,
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
  pagination?: LegacyPagePagination,
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
    mergeConnection: (prev, next) => ({
      ...next,
      messageReportsConnection: {
        ...next.messageReportsConnection!,
        edges: mergeConnectionEdges(
          prev.messageReportsConnection?.edges ?? [],
          next.messageReportsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    reports: result.items,
    total: result.total,
    totalCount: result.totalCount,
    hasMore: result.hasMore,
    hasNextPage: result.hasNextPage,
    loadMore: result.loadMore,
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
