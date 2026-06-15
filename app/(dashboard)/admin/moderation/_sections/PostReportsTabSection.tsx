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
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { cn, formatDateTime } from '@/lib/utils';
import { ReportDetail } from '../_components/ReportDetail';
import {
  POST_FILTER_CHIPS,
} from '../_hooks/moderation-page.constants';
import { shortDisplayId, truncateText } from '../_hooks/moderation-page.derived';
import type { ModerationPageActions } from '../_hooks/useModerationPageActions';
import type { ModerationPageData } from '../_hooks/useModerationPageData';
import {
  POST_REPORT_REASON_LABELS,
  POST_REPORT_REASON_VARIANTS,
  POST_REPORT_STATUS_LABELS,
} from '../types';
import type { ModerationReport } from '../types';

interface PostReportsTabSectionProps {
  data: ModerationPageData;
  actions: ModerationPageActions;
}

export function PostReportsTabSection({
  data,
  actions,
}: PostReportsTabSectionProps) {
  const {
    statusFilter,
    reports,
    reportsLoading,
    reportsError,
    refetchReports,
    postTotal,
    postTotalCount,
    postHasNextPage,
    loadMorePostReports,
    setSelectedId,
    effectiveId,
    selectedReport,
  } = data;
  const {
    handleStatusFilterChange,
    handleUpdateStatus,
    handleDeletePost,
    handleSuspendUser,
    updatingStatus,
    suspendingUser,
    deletingPost,
  } = actions;

  return (
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
                r.reporter?.displayName || r.reporter?.userName || 'Ẩn danh';
              const content = r.post?.content || r.description || '';
              return (
                <tr
                  key={r._id}
                  onClick={() => setSelectedId(r._id)}
                  className={cn(
                    'border-surface-border cursor-pointer border-b transition-colors',
                    isActive ? 'bg-primary/10' : 'hover:bg-surface-hover',
                  )}
                >
                  <td className="text-faint px-4 py-3 font-mono text-xs">
                    {shortDisplayId(r._id)}
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
                    {truncateText(content, 60)}
                  </td>
                  <td className="text-body px-4 py-3 text-sm">@{authorName}</td>
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
        <ConnectionPager
          loadedCount={reports.length}
          totalCount={postTotalCount ?? postTotal}
          hasNextPage={postHasNextPage}
          onNext={() => {
            void loadMorePostReports();
            setSelectedId(null);
          }}
          loading={reportsLoading}
        />
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
  );
}
