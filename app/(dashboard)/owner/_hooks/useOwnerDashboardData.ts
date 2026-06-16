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

import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useMyVenuesStats,
  useBookingStats,
  useOrderStats,
  useLowStockProducts,
} from '@/hooks/owner';

export function useOwnerDashboardData() {
  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useMyVenuesStats();

  const {
    venues,
    selectedVenue,
    selectedVenueId,
    loading: venuesLoading,
    error: venuesError,
    refetchVenues,
  } = useVenueContext();

  const {
    stats: bookingStats,
    loading: bookingLoading,
    error: bookingError,
    refetch: refetchBookingStats,
  } = useBookingStats(selectedVenueId);

  const {
    stats: orderStats,
    loading: orderLoading,
    error: orderError,
    refetch: refetchOrderStats,
  } = useOrderStats(selectedVenueId);

  const {
    products: lowStockProducts,
    loading: lowStockLoading,
    error: lowStockError,
    refetch: refetchLowStock,
  } = useLowStockProducts(selectedVenueId);

  const loading =
    statsLoading ||
    venuesLoading ||
    (Boolean(selectedVenueId) &&
      (bookingLoading || orderLoading || lowStockLoading));

  const error =
    statsError ?? venuesError ?? bookingError ?? orderError ?? lowStockError;

  const refetchAll = () => {
    void refetchStats();
    refetchVenues();
    if (selectedVenueId) {
      void refetchBookingStats();
      void refetchOrderStats();
      void refetchLowStock();
    }
  };

  return {
    stats,
    venues,
    selectedVenue,
    selectedVenueId,
    bookingStats,
    orderStats,
    lowStockProducts,
    loading,
    error,
    refetchAll,
  };
}

export type OwnerDashboardData = ReturnType<typeof useOwnerDashboardData>;
