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

import { useState, useMemo } from 'react';
import { useMutation } from '@apollo/client/react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { EmptyState } from '@/components/molecules/EmptyState';
import { StatCard } from '@/components/molecules/StatCard';
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionInfiniteScroll } from '@/components/molecules/ConnectionInfiniteScroll';
import { Badge } from '@/components/atoms/Badge';
import { ClaimRequestDetail } from './_components/ClaimRequestDetail';
import { cn, formatDateTime } from '@/lib/utils';
import {
  GET_CLAIM_REQUESTS,
  GET_CLAIM_REQUEST_STATS,
} from '@/graphql/claim-request/queries';
import { REVIEW_CLAIM_REQUEST } from '@/graphql/claim-request/mutations';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { useClaimRequests, useClaimRequestStats } from '@/hooks/admin';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import {
  CLAIM_REQUEST_STATUS_LABELS,
  type ClaimRequestItem,
  type ClaimRequestStatus,
} from './types';

const PAGE_SIZE = 20;
const CLAIM_REQUEST_SORT_FIELDS = ['createdAt', 'status'] as const;

const FILTER_CHIPS = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
  { label: 'Tất cả', value: 'ALL' },
];

export default function ClaimRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields: CLAIM_REQUEST_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

  const filterVar =
    statusFilter === 'ALL'
      ? undefined
      : { status: statusFilter as ClaimRequestStatus };

  const paginationVar = { limit: PAGE_SIZE };

  const {
    requests,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useClaimRequests(filterVar, paginationVar, sort);

  const { stats } = useClaimRequestStats();

  const [reviewClaim, { loading: reviewing }] = useMutation(
    REVIEW_CLAIM_REQUEST,
    createMutationOptions(
      'ReviewClaimRequest',
      'Cập nhật trạng thái thành công'
    )
  );

  const effectiveId =
    requests.find((r) => r._id === selectedId)?._id ?? requests[0]?._id ?? null;
  const selectedRequest = effectiveId
    ? requests.find((r) => r._id === effectiveId)
    : undefined;

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setSelectedId(null);
  };

  const refetchAll = [
    {
      query: GET_CLAIM_REQUESTS,
      variables: { filter: filterVar, pagination: paginationVar, sort },
    },
    { query: GET_CLAIM_REQUEST_STATS },
  ];

  const handleReview = async (
    claimRequestId: string,
    approved: boolean,
    rejectionReason?: string,
    adminNotes?: string
  ) => {
    await reviewClaim({
      variables: {
        input: { claimRequestId, approved, rejectionReason, adminNotes },
      },
      refetchQueries: refetchAll,
    });
  };

  return (
    <>
      <PageHeader
        title="Yêu cầu nhận sân"
        description="Duyệt và xử lý các yêu cầu nhận quyền quản lý sân."
      />

      {/* Stats */}
      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <StatCard
            icon="time-outline"
            iconColor="text-amber-400"
            label="Chờ duyệt"
            value={String(stats.pending)}
          />
          <StatCard
            icon="checkmark-circle-outline"
            iconColor="text-emerald-400"
            label="Đã duyệt"
            value={String(stats.approved)}
          />
          <StatCard
            icon="close-circle-outline"
            iconColor="text-red-400"
            label="Từ chối"
            value={String(stats.rejected)}
          />
          <StatCard
            icon="analytics-outline"
            iconColor="text-blue-400"
            label="Tổng yêu cầu"
            value={String(stats.total)}
          />
        </div>
      )}

      <div className="mt-6 space-y-6">
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
            emptyMessage="Không có yêu cầu nhận sân nào."
            onRetry={() => {
              void refetchRequests();
            }}
          >
            <DataTable
              columns={[
                { key: 'id', label: 'ID' },
                { key: 'venueName', label: 'Tên sân' },
                { key: 'venueAddress', label: 'Địa chỉ' },
                { key: 'claimant', label: 'Người yêu cầu' },
                { key: 'phone', label: 'SĐT' },
                { key: 'status', label: 'Trạng thái', sortable: true },
                {
                  key: 'createdAt',
                  label: 'Ngày gửi',
                  sortable: true,
                },
              ]}
              data={requests}
              sortKey={sortField}
              sortDir={sortDir}
              onSort={handleSort}
              emptyTitle="Không có yêu cầu nhận sân nào"
              renderRow={(r: ClaimRequestItem) => {
                const isActive = r._id === effectiveId;
                const claimantName =
                  r.user?.displayName || r.user?.userName || 'Ẩn danh';
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
                      {r.venueName}
                    </td>
                    <td className="text-body max-w-[160px] truncate px-4 py-3 text-sm">
                      {r.venueAddress || '—'}
                    </td>
                    <td className="text-body px-4 py-3 text-sm">
                      @{claimantName}
                    </td>
                    <td className="text-body px-4 py-3 text-sm">
                      {r.phoneNumber}
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
                        {CLAIM_REQUEST_STATUS_LABELS[r.status]}
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
            onLoadMore={() => void loadMore()}
            loading={requestsLoading && requests.length === 0}
            loadingMore={isLoadingMore}
          />
        </GlassPanel>

        {selectedRequest ? (
          <ClaimRequestDetail
            request={selectedRequest}
            onReview={handleReview}
            loading={reviewing}
          />
        ) : (
          <GlassPanel card>
            <EmptyState
              icon="hand-left-outline"
              title="Chọn yêu cầu"
              description="Chọn một yêu cầu nhận sân để xem chi tiết."
            />
          </GlassPanel>
        )}
      </div>
    </>
  );
}
