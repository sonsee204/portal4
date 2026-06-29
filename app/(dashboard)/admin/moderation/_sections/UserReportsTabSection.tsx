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

import { Badge } from '@/components/atoms/Badge';
import { EmptyState } from '@/components/molecules/EmptyState';
import { FilterChips } from '@/components/molecules/FilterChips';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { SearchInput } from '@/components/molecules/SearchInput';
import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionInfiniteScroll } from '@/components/molecules/ConnectionInfiniteScroll';
import { cn, formatDateTime } from '@/lib/utils';
import { UserReportDetail } from '../_components/UserReportDetail';
import { USER_FILTER_CHIPS } from '../_hooks/moderation-page.constants';
import { shortDisplayId } from '../_hooks/moderation-page.derived';
import type { ModerationPageActions } from '../_hooks/useModerationPageActions';
import type { ModerationPageData } from '../_hooks/useModerationPageData';
import {
  USER_REPORT_REASON_LABELS,
  USER_REPORT_REASON_VARIANTS,
  USER_REPORT_STATUS_LABELS,
} from '../types';
import type { UserModerationReport } from '../types';

interface UserReportsTabSectionProps {
  data: ModerationPageData;
  actions: ModerationPageActions;
}

export function UserReportsTabSection({
  data,
  actions,
}: UserReportsTabSectionProps) {
  const {
    userStatusFilter,
    userReports,
    userReportsLoading,
    userReportsError,
    refetchUserReports,
    userTotal,
    userTotalCount,
    userHasNextPage,
    loadMoreUserReports,
    userIsLoadingMore,
    setSelectedUserReportId,
    effectiveUserReportId,
    selectedUserReport,
    userSortField,
    userSortDir,
    handleUserSort,
  } = data;
  const {
    handleUserStatusFilterChange,
    handleUpdateUserReportStatus,
    handleSuspendUser,
    updatingUserStatus,
    suspendingUser,
  } = actions;

  return (
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
            !userReportsLoading && !userReportsError && userReports.length === 0
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
              { key: 'status', label: 'Trạng thái', sortable: true },
              { key: 'createdAt', label: 'Ngày tạo', sortable: true },
            ]}
            data={userReports}
            sortKey={userSortField}
            sortDir={userSortDir}
            onSort={handleUserSort}
            emptyTitle="Không có báo cáo người dùng nào"
            renderRow={(r: UserModerationReport) => {
              const isActive = r._id === effectiveUserReportId;
              const reportedName =
                r.reportedUser?.displayName || r.reportedUser?.userName || '—';
              const reporterName =
                r.reporter?.displayName || r.reporter?.userName || 'Ẩn danh';
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
                    {shortDisplayId(r._id)}
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
        <ConnectionInfiniteScroll
          loadedCount={userReports.length}
          totalCount={userTotalCount ?? userTotal}
          hasNextPage={userHasNextPage}
          onLoadMore={() => void loadMoreUserReports()}
          loading={userReportsLoading && userReports.length === 0}
          loadingMore={userIsLoadingMore}
        />
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
  );
}
