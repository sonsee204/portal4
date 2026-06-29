/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useVenueBookings,
  useVenueHoldBookings,
  useVenueRecurringBookings,
} from '@/hooks/owner';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import type { OwnerBookingsTab } from '../types';
import {
  buildOwnerBookingsFilter,
  getBookingsStatusChips,
  PAGE_SIZE,
} from './owner-bookings-page.constants';
import { getBookingCustomerSearchText } from '@/lib/booking/booking-customer-label';

const BOOKING_SORT_FIELDS_ALL = [
  'date',
  'totalPrice',
  'status',
  'createdAt',
] as const;

const BOOKING_SORT_FIELDS_HOLD = [
  'date',
  'holdExpiresAt',
  'status',
  'createdAt',
] as const;

const BOOKING_SORT_FIELDS_RECURRING = ['date', 'status', 'createdAt'] as const;

function getBookingSortFields(tab: OwnerBookingsTab): readonly string[] {
  switch (tab) {
    case 'hold':
      return BOOKING_SORT_FIELDS_HOLD;
    case 'recurring':
      return BOOKING_SORT_FIELDS_RECURRING;
    default:
      return BOOKING_SORT_FIELDS_ALL;
  }
}

export function useOwnerBookingsPageData() {
  const { selectedVenueId, loading: venueLoading, error: venueError } =
    useVenueContext();
  const [activeTab, setActiveTab] = useState<OwnerBookingsTab>('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allowedFields = useMemo(
    () => getBookingSortFields(activeTab),
    [activeTab],
  );

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields,
    defaultField: 'date',
    defaultDir: 'desc',
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

  const pagination = useMemo(() => ({ limit: PAGE_SIZE }), []);

  const listFilter = useMemo(() => {
    const trimmed = searchQuery.trim();
    return {
      ...buildOwnerBookingsFilter(activeTab, statusFilter),
      searchQuery: trimmed || undefined,
    };
  }, [activeTab, statusFilter, searchQuery]);

  const listData = useVenueBookings(
    selectedVenueId,
    activeTab === 'all' ? listFilter : undefined,
    sort,
    pagination,
    { skip: activeTab !== 'all' },
  );

  const holdData = useVenueHoldBookings(
    selectedVenueId,
    sort,
    pagination,
    { skip: activeTab !== 'hold' },
  );

  const recurringData = useVenueRecurringBookings(
    selectedVenueId,
    sort,
    pagination,
    { skip: activeTab !== 'recurring' },
  );

  const filteredHoldBookings = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    let list = holdData.bookings;

    if (statusFilter !== 'ALL') {
      list = list.filter((booking) => booking.status === statusFilter);
    }

    if (normalizedSearch) {
      list = list.filter((booking) =>
        getBookingCustomerSearchText(booking).includes(normalizedSearch),
      );
    }

    return list;
  }, [holdData.bookings, statusFilter, searchQuery]);

  const filteredRecurringBookings = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    let list = recurringData.bookings;

    if (statusFilter !== 'ALL') {
      list = list.filter((booking) => booking.status === statusFilter);
    }

    if (normalizedSearch) {
      list = list.filter((booking) =>
        getBookingCustomerSearchText(booking).includes(normalizedSearch),
      );
    }

    return list;
  }, [recurringData.bookings, statusFilter, searchQuery]);

  const activeData = useMemo(() => {
    if (activeTab === 'hold') {
      return {
        ...holdData,
        bookings: filteredHoldBookings,
        totalCount:
          statusFilter === 'ALL' && !searchQuery.trim()
            ? holdData.totalCount
            : filteredHoldBookings.length,
      };
    }

    if (activeTab === 'recurring') {
      return {
        ...recurringData,
        bookings: filteredRecurringBookings,
        totalCount:
          statusFilter === 'ALL' && !searchQuery.trim()
            ? recurringData.totalCount
            : filteredRecurringBookings.length,
      };
    }

    return listData;
  }, [
    activeTab,
    filteredHoldBookings,
    filteredRecurringBookings,
    holdData,
    listData,
    recurringData,
    searchQuery,
    statusFilter,
  ]);

  const handleTabChange = useCallback((tab: OwnerBookingsTab) => {
    setActiveTab(tab);
    setStatusFilter('ALL');
    setSearchQuery('');
  }, []);

  const handleStatusFilterChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const refetchAll = useCallback(async () => {
    await Promise.all([
      listData.refetch(),
      holdData.refetch(),
      recurringData.refetch(),
    ]);
  }, [holdData, listData, recurringData]);

  const sortLoading =
    activeData.loading &&
    activeData.bookings.length > 0 &&
    (activeTab === 'all'
      ? !searchQuery.trim() && statusFilter === 'ALL'
      : false);

  return {
    selectedVenueId,
    venueLoading,
    venueError,
    activeTab,
    setActiveTab: handleTabChange,
    statusFilter,
    setStatusFilter: handleStatusFilterChange,
    searchQuery,
    setSearchQuery,
    statusChips: getBookingsStatusChips(activeTab),
    activeData,
    refetchAll,
    sortField,
    sortDir,
    handleSort,
    sortLoading,
  };
}

export type OwnerBookingsPageData = ReturnType<typeof useOwnerBookingsPageData>;
