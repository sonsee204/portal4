'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { SearchInput } from '@/components/molecules/SearchInput';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StatCard } from '@/components/molecules/StatCard';
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { Pagination } from '@/components/organisms/Pagination';
import { Badge } from '@/components/atoms/Badge';
import { ReportDetail } from './_components/ReportDetail';
import { UserReportDetail } from './_components/UserReportDetail';
import { cn, formatDateTime } from '@/lib/utils';
import {
  GET_POST_REPORTS_FOR_ADMIN,
  GET_POST_REPORT_STATS,
  GET_USER_REPORTS_FOR_ADMIN,
  GET_USER_REPORT_STATS,
} from '@/graphql/queries/moderation';
import {
  UPDATE_REPORT_STATUS,
  UPDATE_USER_REPORT_STATUS,
  DELETE_POST_BY_ADMIN,
} from '@/graphql/mutations/moderation';
import { ADMIN_SUSPEND_USER } from '@/graphql/mutations/admin';
import { PostReportStatus } from '@/graphql/generated';
import {
  POST_REPORT_REASON_LABELS,
  POST_REPORT_REASON_VARIANTS,
  POST_REPORT_STATUS_LABELS,
  USER_REPORT_REASON_LABELS,
  USER_REPORT_REASON_VARIANTS,
  USER_REPORT_STATUS_LABELS,
} from './types';
import type {
  ModerationReport,
  UserModerationReport,
  UserReportStatus,
} from './types';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';

const PAGE_SIZE = 20;

type ReportTab = 'posts' | 'users';

interface ReportsQueryData {
  getPostReportsForAdmin: {
    reports: ModerationReport[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface PostStatsQueryData {
  getPostReportStats: {
    totalReports: number;
    pendingReports: number;
    reviewedReports: number;
    resolvedReports: number;
    dismissedReports: number;
  };
}

interface UserReportsQueryData {
  getUserReportsForAdmin: {
    reports: UserModerationReport[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface UserStatsQueryData {
  getUserReportStats: {
    totalReports: number;
    pendingReports: number;
    reviewedReports: number;
    resolvedReports: number;
    dismissedReports: number;
  };
}

const POST_FILTER_CHIPS = [
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đang xem xét', value: 'REVIEWED' },
  { label: 'Đã xử lý', value: 'RESOLVED' },
  { label: 'Bỏ qua', value: 'DISMISSED' },
  { label: 'Tất cả', value: 'ALL' },
];

const USER_FILTER_CHIPS = [
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đang xem xét', value: 'REVIEWED' },
  { label: 'Đã xử lý', value: 'RESOLVED' },
  { label: 'Bỏ qua', value: 'DISMISSED' },
  { label: 'Tất cả', value: 'ALL' },
];

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('posts');

  // Post reports state
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // User reports state
  const [userStatusFilter, setUserStatusFilter] = useState<string>('PENDING');
  const [userPage, setUserPage] = useState(1);
  const [selectedUserReportId, setSelectedUserReportId] = useState<
    string | null
  >(null);

  // ---- Post Reports ----
  const postFilterVar =
    statusFilter === 'ALL'
      ? undefined
      : { status: statusFilter as PostReportStatus };

  const postPaginationVar = { page, limit: PAGE_SIZE };

  const {
    data: reportsData,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = useQuery<ReportsQueryData>(GET_POST_REPORTS_FOR_ADMIN, {
    variables: { filter: postFilterVar, pagination: postPaginationVar },
    fetchPolicy: 'cache-and-network',
  });

  const { data: postStatsData } = useQuery<PostStatsQueryData>(
    GET_POST_REPORT_STATS
  );

  const [updateStatus, { loading: updatingStatus }] = useMutation(
    UPDATE_REPORT_STATUS,
    createMutationOptions(
      'UpdateReportStatus',
      'Cập nhật trạng thái thành công'
    )
  );

  const [deletePost, { loading: deletingPost }] = useMutation(
    DELETE_POST_BY_ADMIN,
    createMutationOptions('DeletePostByAdmin', 'Bài viết đã được xóa')
  );

  // ---- User Reports ----
  const userFilterVar =
    userStatusFilter === 'ALL' ? undefined : { status: userStatusFilter };

  const userPaginationVar = { page: userPage, limit: PAGE_SIZE };

  const {
    data: userReportsData,
    loading: userReportsLoading,
    error: userReportsError,
    refetch: refetchUserReports,
  } = useQuery<UserReportsQueryData>(GET_USER_REPORTS_FOR_ADMIN, {
    variables: { filter: userFilterVar, pagination: userPaginationVar },
    fetchPolicy: 'cache-and-network',
  });

  const { data: userStatsData } = useQuery<UserStatsQueryData>(
    GET_USER_REPORT_STATS
  );

  const [updateUserReportStatus, { loading: updatingUserStatus }] = useMutation(
    UPDATE_USER_REPORT_STATUS,
    createMutationOptions(
      'UpdateUserReportStatus',
      'Cập nhật trạng thái thành công'
    )
  );

  // ---- Shared: Suspend user ----
  const [suspendUser, { loading: suspendingUser }] = useMutation(
    ADMIN_SUSPEND_USER,
    createMutationOptions('AdminSuspendUser', 'Khóa tài khoản thành công')
  );

  // ---- Derived state ----
  const reports = reportsData?.getPostReportsForAdmin?.reports ?? [];
  const postTotal = reportsData?.getPostReportsForAdmin?.total ?? 0;
  const postTotalPages = Math.ceil(postTotal / PAGE_SIZE);
  const postStats = postStatsData?.getPostReportStats;

  const effectiveId =
    reports.find((r) => r._id === selectedId)?._id ?? reports[0]?._id ?? null;
  const selectedReport = effectiveId
    ? reports.find((r) => r._id === effectiveId)
    : undefined;

  const userReports = userReportsData?.getUserReportsForAdmin?.reports ?? [];
  const userTotal = userReportsData?.getUserReportsForAdmin?.total ?? 0;
  const userTotalPages = Math.ceil(userTotal / PAGE_SIZE);
  const userStats = userStatsData?.getUserReportStats;

  const effectiveUserReportId =
    userReports.find((r) => r._id === selectedUserReportId)?._id ??
    userReports[0]?._id ??
    null;
  const selectedUserReport = effectiveUserReportId
    ? userReports.find((r) => r._id === effectiveUserReportId)
    : undefined;

  const activeStats = activeTab === 'posts' ? postStats : userStats;

  // ---- Handlers ----
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
    setSelectedId(null);
  };

  const handleUserStatusFilterChange = (value: string) => {
    setUserStatusFilter(value);
    setUserPage(1);
    setSelectedUserReportId(null);
  };

  const handleUpdateStatus = async (
    reportId: string,
    status: PostReportStatus,
    notes?: string
  ) => {
    await updateStatus({
      variables: { input: { reportId, status, notes } },
      refetchQueries: [
        {
          query: GET_POST_REPORTS_FOR_ADMIN,
          variables: { filter: postFilterVar, pagination: postPaginationVar },
        },
        { query: GET_POST_REPORT_STATS },
      ],
    });
  };

  const handleUpdateUserReportStatus = async (
    reportId: string,
    status: UserReportStatus,
    notes?: string
  ) => {
    await updateUserReportStatus({
      variables: { input: { reportId, status, notes } },
      refetchQueries: [
        {
          query: GET_USER_REPORTS_FOR_ADMIN,
          variables: { filter: userFilterVar, pagination: userPaginationVar },
        },
        { query: GET_USER_REPORT_STATS },
      ],
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (
      !window.confirm(
        'Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.'
      )
    )
      return;
    await deletePost({
      variables: { postId },
      refetchQueries: [
        {
          query: GET_POST_REPORTS_FOR_ADMIN,
          variables: { filter: postFilterVar, pagination: postPaginationVar },
        },
        { query: GET_POST_REPORT_STATS },
      ],
    });
    setSelectedId(null);
  };

  const handleSuspendUser = async (userId: string, reason?: string) => {
    await suspendUser({
      variables: { userId, reason },
      refetchQueries: [
        {
          query: GET_POST_REPORTS_FOR_ADMIN,
          variables: { filter: postFilterVar, pagination: postPaginationVar },
        },
        {
          query: GET_USER_REPORTS_FOR_ADMIN,
          variables: { filter: userFilterVar, pagination: userPaginationVar },
        },
        { query: GET_POST_REPORT_STATS },
        { query: GET_USER_REPORT_STATS },
      ],
    });
  };

  return (
    <>
      <PageHeader
        title="Kiểm duyệt nội dung"
        description="Xem xét và xử lý các báo cáo từ cộng đồng."
      />

      {/* Stats */}
      {activeStats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <StatCard
            icon="flag-outline"
            iconColor="text-red-400"
            label="Chờ xử lý"
            value={String(activeStats.pendingReports)}
          />
          <StatCard
            icon="eye-outline"
            iconColor="text-amber-400"
            label="Đang xem xét"
            value={String(activeStats.reviewedReports)}
          />
          <StatCard
            icon="checkmark-circle-outline"
            iconColor="text-emerald-400"
            label="Đã xử lý"
            value={String(activeStats.resolvedReports)}
          />
          <StatCard
            icon="analytics-outline"
            iconColor="text-blue-400"
            label="Tổng báo cáo"
            value={String(activeStats.totalReports)}
          />
        </div>
      )}

      {/* Tab switcher */}
      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setActiveTab('posts')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'posts'
              ? 'bg-primary text-white'
              : 'bg-surface-hover text-muted hover:text-heading'
          }`}
        >
          Báo cáo bài viết
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'users'
              ? 'bg-primary text-white'
              : 'bg-surface-hover text-muted hover:text-heading'
          }`}
        >
          Báo cáo người dùng
        </button>
      </div>

      {/* Content */}
      {activeTab === 'posts' ? (
        <div className="mt-4 space-y-6">
          <GlassPanel card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FilterChips
                chips={POST_FILTER_CHIPS}
                active={statusFilter}
                onChange={handleStatusFilterChange}
              />
              <SearchInput placeholder="Tìm kiếm..." className="w-64" />
            </div>
            <QueryState
              loading={reportsLoading && reports.length === 0}
              error={reportsError}
              empty={!reportsLoading && !reportsError && reports.length === 0}
              emptyMessage="Không có báo cáo nào."
              onRetry={() => {
                void refetchReports();
              }}
            >
              <DataTable
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'reason', label: 'Lý do' },
                  { key: 'content', label: 'Nội dung' },
                  { key: 'author', label: 'Tác giả' },
                  { key: 'reporter', label: 'Người báo cáo' },
                  { key: 'status', label: 'Trạng thái' },
                  { key: 'createdAt', label: 'Ngày tạo' },
                ]}
                data={reports}
                emptyTitle="Không có báo cáo nào"
                renderRow={(r: ModerationReport) => {
                  const isActive = r._id === effectiveId;
                  const authorName =
                    r.post?.author?.displayName ||
                    r.post?.author?.userName ||
                    '—';
                  const reporterName =
                    r.reporter?.displayName ||
                    r.reporter?.userName ||
                    'Ẩn danh';
                  const content = r.post?.content || r.description || '';
                  return (
                    <tr
                      key={r._id}
                      onClick={() => setSelectedId(r._id)}
                      className={cn(
                        'border-surface-border cursor-pointer border-b transition-colors',
                        isActive ? 'bg-primary/10' : 'hover:bg-surface-hover'
                      )}
                    >
                      <td className="text-faint px-4 py-3 font-mono text-xs">
                        {r._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={POST_REPORT_REASON_VARIANTS[r.reason]}
                          className="text-[10px]"
                        >
                          {POST_REPORT_REASON_LABELS[r.reason]}
                        </Badge>
                      </td>
                      <td className="text-body max-w-[200px] truncate px-4 py-3 text-sm">
                        {content.length > 60
                          ? `${content.slice(0, 60)}…`
                          : content}
                      </td>
                      <td className="text-body px-4 py-3 text-sm">
                        @{authorName}
                      </td>
                      <td className="text-body px-4 py-3 text-sm">
                        @{reporterName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            r.status === 'PENDING'
                              ? 'warning'
                              : r.status === 'RESOLVED'
                                ? 'success'
                                : 'neutral'
                          }
                          className="text-[10px]"
                        >
                          {POST_REPORT_STATUS_LABELS[r.status]}
                        </Badge>
                      </td>
                      <td className="text-faint px-4 py-3 text-xs">
                        {formatDateTime(r.createdAt)}
                      </td>
                    </tr>
                  );
                }}
              />
            </QueryState>
            {postTotalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={postTotalPages}
                totalItems={postTotal}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setPage(p);
                  setSelectedId(null);
                }}
              />
            )}
          </GlassPanel>

          {selectedReport ? (
            <ReportDetail
              report={selectedReport}
              onUpdateStatus={handleUpdateStatus}
              onDeletePost={handleDeletePost}
              onSuspendUser={handleSuspendUser}
              loading={updatingStatus || suspendingUser || deletingPost}
            />
          ) : (
            <GlassPanel card>
              <EmptyState
                icon="document-text-outline"
                title="Chọn báo cáo"
                description="Chọn một báo cáo từ bảng bên trên để xem chi tiết."
              />
            </GlassPanel>
          )}
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          <GlassPanel card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FilterChips
                chips={USER_FILTER_CHIPS}
                active={userStatusFilter}
                onChange={handleUserStatusFilterChange}
              />
              <SearchInput placeholder="Tìm kiếm..." className="w-64" />
            </div>
            <QueryState
              loading={userReportsLoading && userReports.length === 0}
              error={userReportsError}
              empty={
                !userReportsLoading &&
                !userReportsError &&
                userReports.length === 0
              }
              emptyMessage="Không có báo cáo người dùng nào."
              onRetry={() => {
                void refetchUserReports();
              }}
            >
              <DataTable
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'reason', label: 'Lý do' },
                  { key: 'reportedUser', label: 'Người bị báo cáo' },
                  { key: 'reporter', label: 'Người báo cáo' },
                  { key: 'status', label: 'Trạng thái' },
                  { key: 'createdAt', label: 'Ngày tạo' },
                ]}
                data={userReports}
                emptyTitle="Không có báo cáo người dùng nào"
                renderRow={(r: UserModerationReport) => {
                  const isActive = r._id === effectiveUserReportId;
                  const reportedName =
                    r.reportedUser?.displayName ||
                    r.reportedUser?.userName ||
                    '—';
                  const reporterName =
                    r.reporter?.displayName ||
                    r.reporter?.userName ||
                    'Ẩn danh';
                  return (
                    <tr
                      key={r._id}
                      onClick={() => setSelectedUserReportId(r._id)}
                      className={cn(
                        'border-surface-border cursor-pointer border-b transition-colors',
                        isActive ? 'bg-primary/10' : 'hover:bg-surface-hover'
                      )}
                    >
                      <td className="text-faint px-4 py-3 font-mono text-xs">
                        {r._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={USER_REPORT_REASON_VARIANTS[r.reason]}
                          className="text-[10px]"
                        >
                          {USER_REPORT_REASON_LABELS[r.reason]}
                        </Badge>
                      </td>
                      <td className="text-body px-4 py-3 text-sm">
                        @{reportedName}
                      </td>
                      <td className="text-body px-4 py-3 text-sm">
                        @{reporterName}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            r.status === 'PENDING'
                              ? 'warning'
                              : r.status === 'RESOLVED'
                                ? 'success'
                                : 'neutral'
                          }
                          className="text-[10px]"
                        >
                          {USER_REPORT_STATUS_LABELS[r.status]}
                        </Badge>
                      </td>
                      <td className="text-faint px-4 py-3 text-xs">
                        {formatDateTime(r.createdAt)}
                      </td>
                    </tr>
                  );
                }}
              />
            </QueryState>
            {userTotalPages > 1 && (
              <Pagination
                currentPage={userPage}
                totalPages={userTotalPages}
                totalItems={userTotal}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setUserPage(p);
                  setSelectedUserReportId(null);
                }}
              />
            )}
          </GlassPanel>

          {selectedUserReport ? (
            <UserReportDetail
              report={selectedUserReport}
              onUpdateStatus={handleUpdateUserReportStatus}
              onSuspendUser={handleSuspendUser}
              loading={updatingUserStatus || suspendingUser}
            />
          ) : (
            <GlassPanel card>
              <EmptyState
                icon="person-outline"
                title="Chọn báo cáo"
                description="Chọn một báo cáo người dùng để xem chi tiết."
              />
            </GlassPanel>
          )}
        </div>
      )}
    </>
  );
}
