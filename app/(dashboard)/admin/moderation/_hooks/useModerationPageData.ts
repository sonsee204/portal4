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

import { useMemo, useState } from 'react';
import { PostReportStatus } from '@/graphql/generated';
import {
  useMessageReports,
  useMessageReportStats,
  usePostReports,
  usePostReportStats,
  useUserReports,
  useUserReportStats,
} from '@/hooks/admin';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import type {
  MessageReportStatus,
  UserReportStatus,
} from '../types';
import {
  PAGE_SIZE,
  type ReportTab,
} from './moderation-page.constants';
import {
  buildStatusFilter,
  findReportById,
  resolveEffectiveReportId,
} from './moderation-page.derived';

const REPORT_SORT_FIELDS = ['createdAt', 'status'] as const;

export function useModerationPageData() {
  const [activeTab, setActiveTab] = useState<ReportTab>('posts');

  const [statusFilter, setStatusFilter] = useState<PostReportStatus | 'ALL'>(
    PostReportStatus.Pending,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [userStatusFilter, setUserStatusFilter] = useState<
    UserReportStatus | 'ALL'
  >('PENDING');
  const [selectedUserReportId, setSelectedUserReportId] = useState<
    string | null
  >(null);

  const [msgStatusFilter, setMsgStatusFilter] = useState<
    MessageReportStatus | 'ALL'
  >('PENDING');
  const [selectedMsgReportId, setSelectedMsgReportId] = useState<string | null>(
    null,
  );

  const postSortState = useDataTableSortUrl({
    allowedFields: REPORT_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
    sortParam: 'postSort',
    dirParam: 'postDir',
  });
  const userSortState = useDataTableSortUrl({
    allowedFields: REPORT_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
    sortParam: 'userSort',
    dirParam: 'userDir',
  });
  const msgSortState = useDataTableSortUrl({
    allowedFields: REPORT_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
    sortParam: 'msgSort',
    dirParam: 'msgDir',
  });

  const postSort = useMemo(
    () => toSortByOrder(postSortState.sortField, postSortState.sortDir),
    [postSortState.sortField, postSortState.sortDir],
  );
  const userSort = useMemo(
    () => toSortByOrder(userSortState.sortField, userSortState.sortDir),
    [userSortState.sortField, userSortState.sortDir],
  );
  const msgSort = useMemo(
    () => toSortByOrder(msgSortState.sortField, msgSortState.sortDir),
    [msgSortState.sortField, msgSortState.sortDir],
  );

  const postFilterVar = buildStatusFilter(statusFilter);
  const postPaginationVar = { limit: PAGE_SIZE };

  const {
    reports,
    total: postTotal,
    totalCount: postTotalCount,
    hasNextPage: postHasNextPage,
    loadMore: loadMorePostReports,
    isLoadingMore: postIsLoadingMore,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = usePostReports(postFilterVar, postPaginationVar, postSort);
  const { stats: postStats } = usePostReportStats();

  const userFilterVar = buildStatusFilter(userStatusFilter);
  const userPaginationVar = { limit: PAGE_SIZE };

  const {
    reports: userReports,
    total: userTotal,
    totalCount: userTotalCount,
    hasNextPage: userHasNextPage,
    loadMore: loadMoreUserReports,
    isLoadingMore: userIsLoadingMore,
    loading: userReportsLoading,
    error: userReportsError,
    refetch: refetchUserReports,
  } = useUserReports(userFilterVar, userPaginationVar, userSort);
  const { stats: userStats } = useUserReportStats();

  const msgFilterVar = buildStatusFilter(msgStatusFilter);
  const msgPaginationVar = { limit: PAGE_SIZE };

  const {
    reports: msgReports,
    total: msgTotal,
    totalCount: msgTotalCount,
    hasNextPage: msgHasNextPage,
    loadMore: loadMoreMsgReports,
    isLoadingMore: msgIsLoadingMore,
    loading: msgReportsLoading,
    error: msgReportsError,
    refetch: refetchMsgReports,
  } = useMessageReports(msgFilterVar, msgPaginationVar, msgSort);
  const { stats: msgStats } = useMessageReportStats();

  const effectiveId = resolveEffectiveReportId(reports, selectedId);
  const selectedReport = findReportById(reports, effectiveId);

  const effectiveUserReportId = resolveEffectiveReportId(
    userReports,
    selectedUserReportId,
  );
  const selectedUserReport = findReportById(
    userReports,
    effectiveUserReportId,
  );

  const effectiveMsgReportId = resolveEffectiveReportId(
    msgReports,
    selectedMsgReportId,
  );
  const selectedMsgReport = findReportById(msgReports, effectiveMsgReportId);

  const activeStats = useMemo(
    () =>
      activeTab === 'posts'
        ? postStats
        : activeTab === 'users'
          ? userStats
          : msgStats,
    [activeTab, postStats, userStats, msgStats],
  );

  return {
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    selectedId,
    setSelectedId,
    userStatusFilter,
    setUserStatusFilter,
    selectedUserReportId,
    setSelectedUserReportId,
    msgStatusFilter,
    setMsgStatusFilter,
    selectedMsgReportId,
    setSelectedMsgReportId,
    postFilterVar,
    postPaginationVar,
    postSortField: postSortState.sortField,
    postSortDir: postSortState.sortDir,
    handlePostSort: postSortState.handleSort,
    reports,
    postTotal,
    postTotalCount,
    postHasNextPage,
    loadMorePostReports,
    postIsLoadingMore,
    reportsLoading,
    reportsError,
    refetchReports,
    postStats,
    userFilterVar,
    userPaginationVar,
    userSortField: userSortState.sortField,
    userSortDir: userSortState.sortDir,
    handleUserSort: userSortState.handleSort,
    userReports,
    userTotal,
    userTotalCount,
    userHasNextPage,
    loadMoreUserReports,
    userIsLoadingMore,
    userReportsLoading,
    userReportsError,
    refetchUserReports,
    userStats,
    msgFilterVar,
    msgPaginationVar,
    msgSortField: msgSortState.sortField,
    msgSortDir: msgSortState.sortDir,
    handleMsgSort: msgSortState.handleSort,
    msgReports,
    msgTotal,
    msgTotalCount,
    msgHasNextPage,
    loadMoreMsgReports,
    msgIsLoadingMore,
    msgReportsLoading,
    msgReportsError,
    refetchMsgReports,
    msgStats,
    effectiveId,
    selectedReport,
    effectiveUserReportId,
    selectedUserReport,
    effectiveMsgReportId,
    selectedMsgReport,
    activeStats,
  };
}

export type ModerationPageData = ReturnType<typeof useModerationPageData>;
