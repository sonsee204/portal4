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

import { useMemo } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { QueryState } from '@/components/molecules/QueryState';
import { TabGroup } from '@/components/molecules/TabGroup';
import { DataTable } from '@/components/organisms/DataTable';
import {
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_VARIANT,
} from '@/lib/constants/booking-status';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { getBookingCustomerDisplayName } from '@/lib/booking/booking-customer-label';
import { buildAmountSummariesFromRows } from '@/lib/data-table/amount-summary';
import type {
  OwnerBookingNode,
  OwnerRecurringBookingNode,
} from '@/hooks/owner';
import { BookingRowActions } from '../_components/BookingRowActions';
import { BookingActionConfirmDialog } from '../_components/BookingActionConfirmDialog';
import { BookingSlotsCell } from '../_components/BookingSlotsCell';
import { BookingDetailModal } from '@/components/organisms/VenueCalendar/BookingDetailModal';
import {
  BOOKINGS_TABS,
  RECURRING_FREQUENCY_LABEL,
} from '../_hooks/owner-bookings-page.constants';
import type { OwnerBookingsPageActions } from '../_hooks/useOwnerBookingsPageActions';
import type { OwnerBookingsPageData } from '../_hooks/useOwnerBookingsPageData';

interface OwnerBookingsTableSectionProps {
  data: OwnerBookingsPageData;
  actions: OwnerBookingsPageActions;
}

type BookingsTableRow = OwnerBookingNode | OwnerRecurringBookingNode;

function getBookingAmountValue(booking: BookingsTableRow): number {
  const node = booking as OwnerBookingNode;
  return node.finalAmount ?? node.totalPrice ?? 0;
}

function getBookingAmountLabel(booking: BookingsTableRow): string {
  const node = booking as OwnerBookingNode;
  const amount = node.finalAmount ?? node.totalPrice;
  return amount != null ? formatCurrency(amount) : '—';
}

function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={BOOKING_STATUS_VARIANT[status] ?? 'neutral'}>
      {BOOKING_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

export function OwnerBookingsTableSection({
  data,
  actions,
}: OwnerBookingsTableSectionProps) {
  const {
    selectedVenueId,
    venueLoading,
    activeTab,
    statusFilter,
    statusChips,
    searchQuery,
    setSearchQuery,
    dateRange,
    datePreset,
    setDatePreset,
    handleDateRangeChange,
    activeData,
    sortField,
    sortDir,
    handleSort,
    sortLoading,
  } = data;
  const {
    handleTabChange,
    handleStatusFilterChange,
    handleLoadMore,
    closeDetailModal,
    detailBookingId,
  } = actions;

  const {
    bookings,
    loading,
    error,
    refetch,
    totalCount,
    hasNextPage,
    isLoadingMore,
  } = activeData;

  const tableBookings = bookings as BookingsTableRow[];

  const bookingAmountSummaries = useMemo(
    () =>
      activeTab === 'all'
        ? buildAmountSummariesFromRows(tableBookings, [
            {
              columnKey: 'amount',
              getValue: getBookingAmountValue,
              tone: 'positive',
            },
          ])
        : undefined,
    [activeTab, tableBookings]
  );

  const emptyMessage = !selectedVenueId
    ? 'Chọn cơ sở ở thanh trên để xem đặt chỗ.'
    : 'Không có đặt sân nào.';

  const tableScrollClassName =
    'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

  const infiniteScroll = {
    loadedCount: bookings.length,
    totalCount,
    hasNextPage,
    onLoadMore: handleLoadMore,
    loading: loading && bookings.length === 0,
    loadingMore: isLoadingMore,
  };

  return (
    <>
      <GlassPanel card className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabGroup
            tabs={BOOKINGS_TABS}
            active={activeTab}
            onChange={handleTabChange}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Input
              className="max-w-xs"
              placeholder="Tìm tên khách..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              leftIcon="search-outline"
            />
            <DateRangePicker
              compact
              label=""
              value={dateRange}
              onChange={handleDateRangeChange}
              preset={datePreset}
              onPresetChange={(preset) => {
                if (preset !== 'all') {
                  setDatePreset(preset);
                }
              }}
            />
          </div>
        </div>

        <FilterChips
          chips={statusChips}
          active={statusFilter}
          onChange={handleStatusFilterChange}
        />

        <QueryState
          loading={(loading || venueLoading) && tableBookings.length === 0}
          error={error}
          empty={
            !loading &&
            !error &&
            !!selectedVenueId &&
            tableBookings.length === 0
          }
          emptyMessage={emptyMessage}
          onRetry={() => void refetch()}
        >
          {activeTab === 'all' && (
            <DataTable
              columns={[
                { key: 'date', label: 'Ngày', sortable: true },
                { key: 'slots', label: 'Khung giờ' },
                { key: 'customer', label: 'Khách' },
                {
                  key: 'status',
                  label: 'Trạng thái',
                  align: 'center',
                  sortable: true,
                },
                {
                  key: 'amount',
                  label: 'Số tiền',
                  align: 'right',
                  sortable: true,
                  sortField: 'totalPrice',
                },
                { key: 'actions', label: 'Thao tác', align: 'right' },
              ]}
              stickyHeader
              className={tableScrollClassName}
              data={tableBookings}
              emptyTitle="Không có đặt sân"
              infiniteScroll={infiniteScroll}
              sortKey={sortField}
              sortDir={sortDir}
              onSort={handleSort}
              sortLoading={sortLoading}
              amountSummaries={bookingAmountSummaries}
              renderRow={(booking) => (
                <tr
                  key={booking._id}
                  className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                >
                  <td className="text-body px-4 py-3 text-sm">
                    {formatDate(booking.date)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <BookingSlotsCell
                      slots={'slots' in booking ? booking.slots : undefined}
                    />
                  </td>
                  <td className="text-body px-4 py-3 text-sm">
                    {getBookingCustomerDisplayName(booking)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-emerald-400">
                    {getBookingAmountLabel(booking)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <BookingRowActions booking={booking} actions={actions} />
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === 'hold' && (
            <DataTable
              columns={[
                { key: 'date', label: 'Ngày', sortable: true },
                { key: 'slots', label: 'Khung giờ' },
                { key: 'customer', label: 'Khách' },
                {
                  key: 'expires',
                  label: 'Hết hạn giữ chỗ',
                  sortable: true,
                  sortField: 'holdExpiresAt',
                },
                {
                  key: 'status',
                  label: 'Trạng thái',
                  align: 'center',
                  sortable: true,
                },
                { key: 'actions', label: 'Thao tác', align: 'right' },
              ]}
              stickyHeader
              className={tableScrollClassName}
              data={tableBookings}
              emptyTitle="Không có giữ chỗ"
              infiniteScroll={infiniteScroll}
              sortKey={sortField}
              sortDir={sortDir}
              onSort={handleSort}
              sortLoading={sortLoading}
              renderRow={(booking) => (
                <tr
                  key={booking._id}
                  className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                >
                  <td className="text-body px-4 py-3 text-sm">
                    {formatDate(booking.date)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <BookingSlotsCell
                      slots={'slots' in booking ? booking.slots : undefined}
                    />
                  </td>
                  <td className="text-body px-4 py-3 text-sm">
                    {getBookingCustomerDisplayName(booking)}
                  </td>
                  <td className="text-faint px-4 py-3 text-xs">
                    {'holdExpiresAt' in booking && booking.holdExpiresAt
                      ? formatDateTime(booking.holdExpiresAt)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <BookingRowActions booking={booking} actions={actions} />
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === 'recurring' && (
            <DataTable
              columns={[
                { key: 'date', label: 'Bắt đầu', sortable: true },
                { key: 'customer', label: 'Khách' },
                { key: 'frequency', label: 'Tần suất' },
                { key: 'sessions', label: 'Buổi' },
                { key: 'endDate', label: 'Kết thúc' },
                {
                  key: 'status',
                  label: 'Trạng thái',
                  align: 'center',
                  sortable: true,
                },
                { key: 'actions', label: 'Thao tác', align: 'right' },
              ]}
              stickyHeader
              className={tableScrollClassName}
              data={tableBookings}
              emptyTitle="Không có đặt cố định"
              infiniteScroll={infiniteScroll}
              sortKey={sortField}
              sortDir={sortDir}
              onSort={handleSort}
              sortLoading={sortLoading}
              renderRow={(booking) => (
                <tr
                  key={booking._id}
                  className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                >
                  <td className="text-body px-4 py-3 text-sm">
                    {formatDate(booking.date)}
                  </td>
                  <td className="text-body px-4 py-3 text-sm">
                    {getBookingCustomerDisplayName(booking)}
                  </td>
                  <td className="text-muted px-4 py-3 text-sm">
                    {RECURRING_FREQUENCY_LABEL[
                      booking.recurringConfig?.frequency ?? ''
                    ] ??
                      booking.recurringConfig?.frequency ??
                      '—'}
                  </td>
                  <td className="text-body px-4 py-3 text-sm">
                    {booking.recurringConfig?.totalSessions ?? '—'}
                  </td>
                  <td className="text-muted px-4 py-3 text-sm">
                    {booking.recurringConfig?.endDate
                      ? formatDate(booking.recurringConfig.endDate)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <BookingRowActions booking={booking} actions={actions} />
                  </td>
                </tr>
              )}
            />
          )}
        </QueryState>
      </GlassPanel>

      <BookingActionConfirmDialog actions={actions} />

      <BookingDetailModal
        bookingId={detailBookingId}
        open={detailBookingId != null}
        onClose={closeDetailModal}
        actions={actions}
      />
    </>
  );
}
