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
import { MessageReportDetail } from '../_components/MessageReportDetail';
import { MESSAGE_FILTER_CHIPS } from '../_hooks/moderation-page.constants';
import {
  shortDisplayId,
  truncateText,
} from '../_hooks/moderation-page.derived';
import type { ModerationPageActions } from '../_hooks/useModerationPageActions';
import type { ModerationPageData } from '../_hooks/useModerationPageData';
import { MESSAGE_REPORT_STATUS_LABELS } from '../types';
import type { MessageModerationReport } from '../types';

interface MessageReportsTabSectionProps {
  data: ModerationPageData;
  actions: ModerationPageActions;
}

export function MessageReportsTabSection({
  data,
  actions,
}: MessageReportsTabSectionProps) {
  const {
    msgStatusFilter,
    msgReports,
    msgReportsLoading,
    msgReportsError,
    refetchMsgReports,
    msgTotal,
    msgTotalCount,
    msgHasNextPage,
    loadMoreMsgReports,
    msgIsLoadingMore,
    setSelectedMsgReportId,
    effectiveMsgReportId,
    selectedMsgReport,
    msgSortField,
    msgSortDir,
    handleMsgSort,
  } = data;
  const {
    handleMsgStatusFilterChange,
    handleUpdateMsgReportStatus,
    handleDeleteMessage,
    updatingMsgStatus,
    deletingMessage,
  } = actions;

  return (
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
            !msgReportsLoading && !msgReportsError && msgReports.length === 0
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
              { key: 'status', label: 'Trạng thái', sortable: true },
              { key: 'createdAt', label: 'Ngày tạo', sortable: true },
            ]}
            data={msgReports}
            sortKey={msgSortField}
            sortDir={msgSortDir}
            onSort={handleMsgSort}
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
                    {shortDisplayId(r._id)}
                  </td>
                  <td className="text-body max-w-[200px] truncate px-4 py-3 text-sm">
                    {truncateText(r.reason, 50)}
                  </td>
                  <td className="text-faint px-4 py-3 font-mono text-xs">
                    {shortDisplayId(r.messageId)}
                  </td>
                  <td className="text-faint px-4 py-3 font-mono text-xs">
                    {shortDisplayId(r.reporterId)}
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
        <ConnectionInfiniteScroll
          loadedCount={msgReports.length}
          totalCount={msgTotalCount ?? msgTotal}
          hasNextPage={msgHasNextPage}
          onLoadMore={() => void loadMoreMsgReports()}
          loading={msgReportsLoading && msgReports.length === 0}
          loadingMore={msgIsLoadingMore}
        />
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
  );
}
