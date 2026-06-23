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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionInfiniteScroll } from '@/components/molecules/ConnectionInfiniteScroll';
import { Badge } from '@/components/atoms/Badge';
import { cn, formatDateTime } from '@/lib/utils';
import { FILTER_CHIPS } from '../_hooks/venue-requests-page.constants';
import type { VenueRequestsPageActions } from '../_hooks/useVenueRequestsPageActions';
import type { VenueRequestsPageData } from '../_hooks/useVenueRequestsPageData';
import { VENUE_REQUEST_STATUS_LABELS, type VenueRequestItem } from '../types';

interface VenueRequestsTableSectionProps {
  data: VenueRequestsPageData;
  actions: VenueRequestsPageActions;
}

export function VenueRequestsTableSection({
  data,
  actions,
}: VenueRequestsTableSectionProps) {
  const {
    statusFilter,
    setSelectedId,
    requests,
    total,
    totalCount,
    hasNextPage,
    isLoadingMore,
    requestsLoading,
    requestsError,
    refetchRequests,
    effectiveId,
    sortField,
    sortDir,
    handleSort,
  } = data;
  const { handleStatusFilterChange, handleLoadMore } = actions;

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FilterChips
          chips={FILTER_CHIPS}
          active={statusFilter}
          onChange={handleStatusFilterChange}
        />
      </div>
      <QueryState
        loading={requestsLoading && requests.length === 0}
        error={requestsError}
        empty={!requestsLoading && !requestsError && requests.length === 0}
        emptyMessage="Không có yêu cầu nào."
        onRetry={() => {
          void refetchRequests();
        }}
      >
        <DataTable
          columns={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Tên sân' },
            { key: 'location', label: 'Địa chỉ' },
            { key: 'requester', label: 'Người đăng ký' },
            { key: 'sports', label: 'Loại sân' },
            { key: 'status', label: 'Trạng thái', sortable: true },
            { key: 'createdAt', label: 'Ngày gửi', sortable: true },
          ]}
          data={requests}
          sortKey={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          emptyTitle="Không có yêu cầu nào"
          renderRow={(r: VenueRequestItem) => {
            const isActive = r._id === effectiveId;
            const requesterName =
              r.requester?.displayName || r.requester?.userName || 'Ẩn danh';
            const location = [r.location.district, r.location.city]
              .filter(Boolean)
              .join(', ');
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
                <td className="text-body max-w-[180px] truncate px-4 py-3 text-sm font-medium">
                  {r.name}
                </td>
                <td className="text-body max-w-[160px] truncate px-4 py-3 text-sm">
                  {location || '—'}
                </td>
                <td className="text-body px-4 py-3 text-sm">
                  @{requesterName}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {r.sportTypes.slice(0, 2).map((s) => (
                      <Badge key={s} variant="info" className="text-[10px]">
                        {s}
                      </Badge>
                    ))}
                    {r.sportTypes.length > 2 && (
                      <Badge variant="neutral" className="text-[10px]">
                        +{r.sportTypes.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      r.status === 'PENDING'
                        ? 'warning'
                        : r.status === 'APPROVED'
                          ? 'success'
                          : r.status === 'REJECTED'
                            ? 'danger'
                            : 'neutral'
                    }
                    className="text-[10px]"
                  >
                    {VENUE_REQUEST_STATUS_LABELS[r.status]}
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
        loadedCount={requests.length}
        totalCount={totalCount ?? total}
        hasNextPage={hasNextPage}
        onLoadMore={handleLoadMore}
        loading={requestsLoading && requests.length === 0}
        loadingMore={isLoadingMore}
      />
    </GlassPanel>
  );
}
