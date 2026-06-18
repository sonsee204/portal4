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

import { useCallback, useMemo, useState } from 'react';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useVenueBookings,
  useVenueRecurringBookings,
} from '@/hooks/owner';
import type { OwnerBookingsTab } from '../types';
import {
  buildOwnerBookingsFilter,
  getBookingsStatusChips,
  PAGE_SIZE,
} from './owner-bookings-page.constants';

export function useOwnerBookingsPageData() {
  const { selectedVenueId, loading: venueLoading, error: venueError } =
    useVenueContext();
  const [activeTab, setActiveTab] = useState<OwnerBookingsTab>('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
    activeTab === 'recurring' ? undefined : listFilter,
    pagination,
    { skip: activeTab === 'recurring' },
  );

  const recurringData = useVenueRecurringBookings(
    selectedVenueId,
    pagination,
    { skip: activeTab !== 'recurring' },
  );

  const filteredRecurringBookings = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    let list = recurringData.bookings;

    if (statusFilter !== 'ALL') {
      list = list.filter((booking) => booking.status === statusFilter);
    }

    if (normalizedSearch) {
      list = list.filter((booking) => {
        const name = booking.customer?.displayName?.toLowerCase() ?? '';
        return name.includes(normalizedSearch);
      });
    }

    return list;
  }, [recurringData.bookings, statusFilter, searchQuery]);

  const activeData = useMemo(() => {
    if (activeTab !== 'recurring') return listData;

    return {
      ...recurringData,
      bookings: filteredRecurringBookings,
      totalCount:
        statusFilter === 'ALL'
          ? recurringData.totalCount
          : filteredRecurringBookings.length,
    };
  }, [
    activeTab,
    filteredRecurringBookings,
    listData,
    recurringData,
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
    await Promise.all([listData.refetch(), recurringData.refetch()]);
  }, [listData, recurringData]);

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
  };
}

export type OwnerBookingsPageData = ReturnType<typeof useOwnerBookingsPageData>;
