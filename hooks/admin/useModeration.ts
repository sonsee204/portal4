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
import type { PostReportStatus } from '@/graphql/generated';
import type {
  ModerationReport,
  UserModerationReport,
  UserReportStatus,
  MessageModerationReport,
  MessageReportStatus,
} from '@/app/(dashboard)/moderation/types';

// ---- Post Reports ----

interface PostReportsQueryData {
  getPostReportsForAdmin: {
    reports: ModerationReport[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface PostReportStatsQueryData {
  getPostReportStats: {
    totalReports: number;
    pendingReports: number;
    reviewedReports: number;
    resolvedReports: number;
    dismissedReports: number;
  };
}

export function usePostReports(
  filter?: { status?: PostReportStatus },
  pagination?: { page: number; limit: number },
) {
  const { data, loading, error, refetch } = useQuery<PostReportsQueryData>(
    GET_POST_REPORTS_FOR_ADMIN,
    {
      variables: { filter, pagination },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    reports: data?.getPostReportsForAdmin?.reports ?? [],
    total: data?.getPostReportsForAdmin?.total ?? 0,
    hasMore: data?.getPostReportsForAdmin?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}

export function usePostReportStats() {
  const { data, loading, error, refetch } =
    useQuery<PostReportStatsQueryData>(GET_POST_REPORT_STATS);

  return {
    stats: data?.getPostReportStats,
    loading,
    error,
    refetch,
  };
}

// ---- User Reports ----

interface UserReportsQueryData {
  getUserReportsForAdmin: {
    reports: UserModerationReport[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface UserReportStatsQueryData {
  getUserReportStats: {
    totalReports: number;
    pendingReports: number;
    reviewedReports: number;
    resolvedReports: number;
    dismissedReports: number;
  };
}

export function useUserReports(
  filter?: { status?: UserReportStatus },
  pagination?: { page: number; limit: number },
) {
  const { data, loading, error, refetch } = useQuery<UserReportsQueryData>(
    GET_USER_REPORTS_FOR_ADMIN,
    {
      variables: { filter, pagination },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    reports: data?.getUserReportsForAdmin?.reports ?? [],
    total: data?.getUserReportsForAdmin?.total ?? 0,
    hasMore: data?.getUserReportsForAdmin?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}

export function useUserReportStats() {
  const { data, loading, error, refetch } =
    useQuery<UserReportStatsQueryData>(GET_USER_REPORT_STATS);

  return {
    stats: data?.getUserReportStats,
    loading,
    error,
    refetch,
  };
}

// ---- Message Reports ----

interface MessageReportsQueryData {
  getMessageReportsForAdmin: {
    reports: MessageModerationReport[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface MessageReportStatsQueryData {
  getMessageReportStats: {
    totalReports: number;
    pendingReports: number;
    reviewedReports: number;
    resolvedReports: number;
    dismissedReports: number;
  };
}

export function useMessageReports(
  filter?: { status?: MessageReportStatus },
  pagination?: { page: number; limit: number },
) {
  const { data, loading, error, refetch } =
    useQuery<MessageReportsQueryData>(GET_MESSAGE_REPORTS_FOR_ADMIN, {
      variables: { filter, pagination },
      fetchPolicy: 'cache-and-network',
    });

  return {
    reports: data?.getMessageReportsForAdmin?.reports ?? [],
    total: data?.getMessageReportsForAdmin?.total ?? 0,
    hasMore: data?.getMessageReportsForAdmin?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}

export function useMessageReportStats() {
  const { data, loading, error, refetch } =
    useQuery<MessageReportStatsQueryData>(GET_MESSAGE_REPORT_STATS);

  return {
    stats: data?.getMessageReportStats,
    loading,
    error,
    refetch,
  };
}
