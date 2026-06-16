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

import type { FilterChip } from '@/components/molecules/FilterChips';
import type { TabItem } from '@/components/molecules/TabGroup';
import { BookingStatus, BookingTypeFilter } from '@/graphql/generated';
import type { OwnerBookingsTab } from '../types';

export const PAGE_SIZE = 20;

export const BOOKINGS_TABS: TabItem[] = [
  { label: 'Tất cả đặt sân', value: 'all' },
  { label: 'Giữ chỗ', value: 'hold' },
  { label: 'Đặt cố định', value: 'recurring' },
];

export const ALL_BOOKINGS_STATUS_CHIPS: FilterChip[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xử lý', value: BookingStatus.Pending },
  { label: 'Đã xác nhận', value: BookingStatus.Confirmed },
  { label: 'Hoàn thành', value: BookingStatus.Completed },
  { label: 'Hết hạn', value: BookingStatus.Expired },
  { label: 'Đã hủy', value: BookingStatus.Cancelled },
  { label: 'Từ chối', value: BookingStatus.Rejected },
  { label: 'Vắng mặt', value: BookingStatus.NoShow },
];

export const HOLD_BOOKINGS_STATUS_CHIPS: FilterChip[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ duyệt giữ chỗ', value: BookingStatus.HoldPending },
  { label: 'Đang giữ chỗ', value: BookingStatus.HoldActive },
];

export const RECURRING_BOOKINGS_STATUS_CHIPS: FilterChip[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xử lý', value: BookingStatus.Pending },
  { label: 'Đã xác nhận', value: BookingStatus.Confirmed },
  { label: 'Hoàn thành', value: BookingStatus.Completed },
  { label: 'Hết hạn', value: BookingStatus.Expired },
  { label: 'Đã hủy', value: BookingStatus.Cancelled },
  { label: 'Từ chối', value: BookingStatus.Rejected },
];

export function getBookingsStatusChips(tab: OwnerBookingsTab): FilterChip[] {
  switch (tab) {
    case 'hold':
      return HOLD_BOOKINGS_STATUS_CHIPS;
    case 'recurring':
      return RECURRING_BOOKINGS_STATUS_CHIPS;
    default:
      return ALL_BOOKINGS_STATUS_CHIPS;
  }
}

export function buildOwnerBookingsFilter(
  tab: OwnerBookingsTab,
  statusFilter: string,
): {
  bookingType: BookingTypeFilter;
  statuses?: BookingStatus[];
} {
  const selectedStatuses =
    statusFilter === 'ALL' ? undefined : ([statusFilter] as BookingStatus[]);

  if (tab === 'hold') {
    return {
      bookingType: BookingTypeFilter.MainView,
      statuses:
        selectedStatuses ??
        ([BookingStatus.HoldPending, BookingStatus.HoldActive] as BookingStatus[]),
    };
  }

  if (tab === 'recurring') {
    return {
      bookingType: BookingTypeFilter.RecurringMaster,
      statuses: selectedStatuses,
    };
  }

  return {
    bookingType: BookingTypeFilter.MainView,
    statuses: selectedStatuses,
  };
}

export const RECURRING_FREQUENCY_LABEL: Record<string, string> = {
  WEEKLY: 'Hàng tuần',
};
