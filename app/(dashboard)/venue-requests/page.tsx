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
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { Badge } from '@/components/atoms/Badge';
import { VenueRequestDetail } from './_components/VenueRequestDetail';
import { cn, formatDateTime } from '@/lib/utils';
import {
  GET_ALL_VENUE_REQUESTS,
  GET_VENUE_REQUEST_STATS,
} from '@/graphql/queries/venue-requests';
import {
  APPROVE_VENUE_REQUEST,
  REJECT_VENUE_REQUEST,
} from '@/graphql/mutations/venue-requests';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { useVenueRequests, useVenueRequestStats } from '@/hooks/admin';
import {
  VENUE_REQUEST_STATUS_LABELS,
  type VenueRequestItem,
  type VenueRequestStatus,
} from './types';

const PAGE_SIZE = 20;

const FILTER_CHIPS = [
  { label: 'Chờ duyệt', value: 'PENDING' },
  { label: 'Đã duyệt', value: 'APPROVED' },
  { label: 'Từ chối', value: 'REJECTED' },
  { label: 'Đã huỷ', value: 'CANCELLED' },
  { label: 'Tất cả', value: 'ALL' },
];

export default function VenueRequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filterVar =
    statusFilter === 'ALL' ? undefined : (statusFilter as VenueRequestStatus);

  const paginationVar = { limit: PAGE_SIZE };

  const {
    requests,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useVenueRequests(filterVar, paginationVar);

  const { stats } = useVenueRequestStats();

  const effectiveId =
    requests.find((r) => r._id === selectedId)?._id ?? requests[0]?._id ?? null;
  const selectedRequest = effectiveId
    ? requests.find((r) => r._id === effectiveId)
    : undefined;

  const [approveRequest, { loading: approving }] = useMutation(
    APPROVE_VENUE_REQUEST,
    createMutationOptions('ApproveVenueRequest', 'Đã duyệt yêu cầu thành công')
  );

  const [rejectRequest, { loading: rejecting }] = useMutation(
    REJECT_VENUE_REQUEST,
    createMutationOptions('RejectVenueRequest', 'Đã từ chối yêu cầu')
  );

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setSelectedId(null);
  };

  const refetchAll = [
    {
      query: GET_ALL_VENUE_REQUESTS,
      variables: { status: filterVar, pagination: paginationVar },
    },
    { query: GET_VENUE_REQUEST_STATS },
  ];

  const handleApprove = async (requestId: string, adminNote?: string) => {
    await approveRequest({
      variables: { requestId, adminNote },
      refetchQueries: refetchAll,
    });
  };

  const handleReject = async (requestId: string, reason: string) => {
    await rejectRequest({
      variables: { requestId, rejectionReason: reason },
      refetchQueries: refetchAll,
    });
  };

  return (
    <>
      <PageHeader
        title="Yêu cầu đăng ký sân"
        description="Duyệt và xử lý các yêu cầu đăng ký cụm sân mới từ cộng đồng."
      />

      {/* Stats */}
      {stats && (
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <StatCard
            icon="time-outline"
            iconColor="text-amber-400"
            label="Chờ duyệt"
            value={String(stats.pendingRequests)}
          />
          <StatCard
            icon="checkmark-circle-outline"
            iconColor="text-emerald-400"
            label="Đã duyệt"
            value={String(stats.approvedRequests)}
          />
          <StatCard
            icon="close-circle-outline"
            iconColor="text-red-400"
            label="Từ chối"
            value={String(stats.rejectedRequests)}
          />
          <StatCard
            icon="analytics-outline"
            iconColor="text-blue-400"
            label="Tổng yêu cầu"
            value={String(stats.totalRequests)}
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
            <SearchInput placeholder="Tìm kiếm..." className="w-64" />
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
                { key: 'status', label: 'Trạng thái' },
                { key: 'createdAt', label: 'Ngày gửi' },
              ]}
              data={requests}
              emptyTitle="Không có yêu cầu nào"
              renderRow={(r: VenueRequestItem) => {
                const isActive = r._id === effectiveId;
                const requesterName =
                  r.requester?.displayName ||
                  r.requester?.userName ||
                  'Ẩn danh';
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
          <ConnectionPager
            loadedCount={requests.length}
            totalCount={totalCount ?? total}
            hasNextPage={hasNextPage}
            onNext={() => {
              void loadMore();
              setSelectedId(null);
            }}
            loading={requestsLoading}
          />
        </GlassPanel>

        {selectedRequest ? (
          <VenueRequestDetail
            request={selectedRequest}
            onApprove={handleApprove}
            onReject={handleReject}
            loading={approving || rejecting}
          />
        ) : (
          <GlassPanel card>
            <EmptyState
              icon="business-outline"
              title="Chọn yêu cầu"
              description="Chọn một yêu cầu từ bảng bên trên để xem chi tiết."
            />
          </GlassPanel>
        )}
      </div>
    </>
  );
}
