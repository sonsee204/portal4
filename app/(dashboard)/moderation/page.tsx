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

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
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
import { MessageReportDetail } from './_components/MessageReportDetail';
import { cn, formatDateTime } from '@/lib/utils';
import {
  GET_POST_REPORTS_FOR_ADMIN,
  GET_POST_REPORT_STATS,
  GET_USER_REPORTS_FOR_ADMIN,
  GET_USER_REPORT_STATS,
  GET_MESSAGE_REPORTS_FOR_ADMIN,
  GET_MESSAGE_REPORT_STATS,
} from '@/graphql/queries/moderation';
import {
  UPDATE_REPORT_STATUS,
  UPDATE_USER_REPORT_STATUS,
  DELETE_POST_BY_ADMIN,
  UPDATE_MESSAGE_REPORT_STATUS,
  DELETE_MESSAGE_BY_ADMIN,
} from '@/graphql/mutations/moderation';
import { ADMIN_SUSPEND_USER } from '@/graphql/mutations/admin';
import { PostReportStatus } from '@/graphql/generated';
import {
  usePostReports,
  usePostReportStats,
  useUserReports,
  useUserReportStats,
  useMessageReports,
  useMessageReportStats,
} from '@/hooks/admin';
import {
  POST_REPORT_REASON_LABELS,
  POST_REPORT_REASON_VARIANTS,
  POST_REPORT_STATUS_LABELS,
  USER_REPORT_REASON_LABELS,
  USER_REPORT_REASON_VARIANTS,
  USER_REPORT_STATUS_LABELS,
  MESSAGE_REPORT_STATUS_LABELS,
} from './types';
import type {
  ModerationReport,
  UserModerationReport,
  UserReportStatus,
  MessageModerationReport,
  MessageReportStatus,
} from './types';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';

const PAGE_SIZE = 20;

type ReportTab = 'posts' | 'users' | 'messages';

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

const MESSAGE_FILTER_CHIPS = [
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đang xem xét', value: 'REVIEWED' },
  { label: 'Đã xử lý', value: 'RESOLVED' },
  { label: 'Bỏ qua', value: 'DISMISSED' },
  { label: 'Tất cả', value: 'ALL' },
];

export default function ModerationPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>('posts');

  // Post reports state
  const [statusFilter, setStatusFilter] = useState<PostReportStatus | 'ALL'>(
    PostReportStatus.Pending
  );
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // User reports state
  const [userStatusFilter, setUserStatusFilter] = useState<
    UserReportStatus | 'ALL'
  >('PENDING');
  const [userPage, setUserPage] = useState(1);
  const [selectedUserReportId, setSelectedUserReportId] = useState<
    string | null
  >(null);

  // Message reports state
  const [msgStatusFilter, setMsgStatusFilter] = useState<
    MessageReportStatus | 'ALL'
  >('PENDING');
  const [msgPage, setMsgPage] = useState(1);
  const [selectedMsgReportId, setSelectedMsgReportId] = useState<string | null>(
    null
  );

  // ---- Post Reports ----
  const postFilterVar =
    statusFilter === 'ALL' ? undefined : { status: statusFilter };

  const postPaginationVar = { page, limit: PAGE_SIZE };

  const {
    reports,
    total: postTotal,
    loading: reportsLoading,
    error: reportsError,
    refetch: refetchReports,
  } = usePostReports(postFilterVar, postPaginationVar);

  const { stats: postStats } = usePostReportStats();

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
    reports: userReports,
    total: userTotal,
    loading: userReportsLoading,
    error: userReportsError,
    refetch: refetchUserReports,
  } = useUserReports(userFilterVar, userPaginationVar);

  const { stats: userStats } = useUserReportStats();

  const [updateUserReportStatus, { loading: updatingUserStatus }] = useMutation(
    UPDATE_USER_REPORT_STATUS,
    createMutationOptions(
      'UpdateUserReportStatus',
      'Cập nhật trạng thái thành công'
    )
  );

  // ---- Message Reports ----
  const msgFilterVar =
    msgStatusFilter === 'ALL' ? undefined : { status: msgStatusFilter };

  const msgPaginationVar = { page: msgPage, limit: PAGE_SIZE };

  const {
    reports: msgReports,
    total: msgTotal,
    loading: msgReportsLoading,
    error: msgReportsError,
    refetch: refetchMsgReports,
  } = useMessageReports(msgFilterVar, msgPaginationVar);

  const { stats: msgStats } = useMessageReportStats();

  const [updateMsgReportStatus, { loading: updatingMsgStatus }] = useMutation(
    UPDATE_MESSAGE_REPORT_STATUS,
    createMutationOptions(
      'UpdateMessageReportStatus',
      'Cập nhật trạng thái thành công'
    )
  );

  const [deleteMessage, { loading: deletingMessage }] = useMutation(
    DELETE_MESSAGE_BY_ADMIN,
    createMutationOptions('DeleteMessageByAdmin', 'Tin nhắn đã được xóa')
  );

  // ---- Shared: Suspend user ----
  const [suspendUser, { loading: suspendingUser }] = useMutation(
    ADMIN_SUSPEND_USER,
    createMutationOptions('AdminSuspendUser', 'Khóa tài khoản thành công')
  );

  // ---- Derived state ----
  const postTotalPages = Math.ceil(postTotal / PAGE_SIZE);

  const effectiveId =
    reports.find((r) => r._id === selectedId)?._id ?? reports[0]?._id ?? null;
  const selectedReport = effectiveId
    ? reports.find((r) => r._id === effectiveId)
    : undefined;

  const userTotalPages = Math.ceil(userTotal / PAGE_SIZE);

  const effectiveUserReportId =
    userReports.find((r) => r._id === selectedUserReportId)?._id ??
    userReports[0]?._id ??
    null;
  const selectedUserReport = effectiveUserReportId
    ? userReports.find((r) => r._id === effectiveUserReportId)
    : undefined;

  const msgTotalPages = Math.ceil(msgTotal / PAGE_SIZE);

  const effectiveMsgReportId =
    msgReports.find((r) => r._id === selectedMsgReportId)?._id ??
    msgReports[0]?._id ??
    null;
  const selectedMsgReport = effectiveMsgReportId
    ? msgReports.find((r) => r._id === effectiveMsgReportId)
    : undefined;

  const activeStats =
    activeTab === 'posts'
      ? postStats
      : activeTab === 'users'
        ? userStats
        : msgStats;

  // ---- Handlers ----
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as PostReportStatus | 'ALL');
    setPage(1);
    setSelectedId(null);
  };

  const handleUserStatusFilterChange = (value: string) => {
    setUserStatusFilter(value as UserReportStatus | 'ALL');
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

  const handleMsgStatusFilterChange = (value: string) => {
    setMsgStatusFilter(value as MessageReportStatus | 'ALL');
    setMsgPage(1);
    setSelectedMsgReportId(null);
  };

  const handleUpdateMsgReportStatus = async (
    reportId: string,
    status: MessageReportStatus,
    notes?: string
  ) => {
    await updateMsgReportStatus({
      variables: { input: { reportId, status, notes } },
      refetchQueries: [
        {
          query: GET_MESSAGE_REPORTS_FOR_ADMIN,
          variables: { filter: msgFilterVar, pagination: msgPaginationVar },
        },
        { query: GET_MESSAGE_REPORT_STATS },
      ],
    });
  };

  const handleDeleteMessage = async (messageId: string) => {
    await deleteMessage({
      variables: { messageId },
      refetchQueries: [
        {
          query: GET_MESSAGE_REPORTS_FOR_ADMIN,
          variables: { filter: msgFilterVar, pagination: msgPaginationVar },
        },
        { query: GET_MESSAGE_REPORT_STATS },
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
        <button
          onClick={() => setActiveTab('messages')}
          className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'messages'
              ? 'bg-primary text-white'
              : 'bg-surface-hover text-muted hover:text-heading'
          }`}
        >
          Báo cáo tin nhắn
        </button>
      </div>

      {/* Content */}
      {activeTab === 'messages' && (
        <div className="mt-4 space-y-6">
          <GlassPanel card className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <FilterChips
                chips={MESSAGE_FILTER_CHIPS}
                active={msgStatusFilter}
                onChange={handleMsgStatusFilterChange}
              />
              <SearchInput placeholder="Tìm kiếm..." className="w-64" />
            </div>
            <QueryState
              loading={msgReportsLoading && msgReports.length === 0}
              error={msgReportsError}
              empty={
                !msgReportsLoading &&
                !msgReportsError &&
                msgReports.length === 0
              }
              emptyMessage="Không có báo cáo tin nhắn nào."
              onRetry={() => {
                void refetchMsgReports();
              }}
            >
              <DataTable
                columns={[
                  { key: 'id', label: 'ID' },
                  { key: 'reason', label: 'Lý do' },
                  { key: 'messageId', label: 'ID tin nhắn' },
                  { key: 'reporterId', label: 'ID người báo cáo' },
                  { key: 'status', label: 'Trạng thái' },
                  { key: 'createdAt', label: 'Ngày tạo' },
                ]}
                data={msgReports}
                emptyTitle="Không có báo cáo tin nhắn nào"
                renderRow={(r: MessageModerationReport) => {
                  const isActive = r._id === effectiveMsgReportId;
                  return (
                    <tr
                      key={r._id}
                      onClick={() => setSelectedMsgReportId(r._id)}
                      className={cn(
                        'border-surface-border cursor-pointer border-b transition-colors',
                        isActive ? 'bg-primary/10' : 'hover:bg-surface-hover'
                      )}
                    >
                      <td className="text-faint px-4 py-3 font-mono text-xs">
                        {r._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="text-body max-w-[200px] truncate px-4 py-3 text-sm">
                        {r.reason.length > 50
                          ? `${r.reason.slice(0, 50)}…`
                          : r.reason}
                      </td>
                      <td className="text-faint px-4 py-3 font-mono text-xs">
                        {r.messageId.slice(-6).toUpperCase()}
                      </td>
                      <td className="text-faint px-4 py-3 font-mono text-xs">
                        {r.reporterId.slice(-6).toUpperCase()}
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
                          {MESSAGE_REPORT_STATUS_LABELS[r.status]}
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
            {msgTotalPages > 1 && (
              <Pagination
                currentPage={msgPage}
                totalPages={msgTotalPages}
                totalItems={msgTotal}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => {
                  setMsgPage(p);
                  setSelectedMsgReportId(null);
                }}
              />
            )}
          </GlassPanel>

          {selectedMsgReport ? (
            <MessageReportDetail
              report={selectedMsgReport}
              onUpdateStatus={handleUpdateMsgReportStatus}
              onDeleteMessage={handleDeleteMessage}
              loading={updatingMsgStatus || deletingMessage}
            />
          ) : (
            <GlassPanel card>
              <EmptyState
                icon="chatbubble-ellipses-outline"
                title="Chọn báo cáo"
                description="Chọn một báo cáo tin nhắn để xem chi tiết."
              />
            </GlassPanel>
          )}
        </div>
      )}

      {activeTab === 'posts' && (
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
      )}

      {activeTab === 'users' && (
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
