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

import { useCallback, useState } from 'react';
import { useBookingDetailActions } from '@/hooks/owner/useBookingDetailActions';
import type { OwnerBookingsTab } from '../types';
import type { OwnerBookingsPageData } from './useOwnerBookingsPageData';

export function useOwnerBookingsPageActions(data: OwnerBookingsPageData) {
  const { setActiveTab, setStatusFilter, activeData, refetchAll } = data;

  const [detailBookingId, setDetailBookingId] = useState<string | null>(null);

  const bookingActions = useBookingDetailActions(refetchAll);

  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value as OwnerBookingsTab);
    },
    [setActiveTab],
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
    },
    [setStatusFilter],
  );

  const handleViewDetail = useCallback((bookingId: string) => {
    setDetailBookingId(bookingId);
  }, []);

  const closeDetailModal = useCallback(() => {
    setDetailBookingId(null);
  }, []);

  const handleLoadMore = useCallback(() => {
    void activeData.loadMore();
  }, [activeData]);

  return {
    handleTabChange,
    handleStatusFilterChange,
    handleLoadMore,
    handleViewDetail,
    closeDetailModal,
    detailBookingId,
    ...bookingActions,
  };
}

export type OwnerBookingsPageActions = ReturnType<
  typeof useOwnerBookingsPageActions
>;
