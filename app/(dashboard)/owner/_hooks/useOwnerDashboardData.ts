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

import { VenueAction } from '@/graphql/generated';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useMyVenuesStats,
  useBookingStats,
  useOrderStats,
  useLowStockProducts,
} from '@/hooks/owner';

export function useOwnerDashboardData() {
  const {
    canVenue,
    venues,
    selectedVenue,
    selectedVenueId,
    loading: venuesLoading,
    error: venuesError,
    refetchVenues,
  } = useVenueContext();

  const canViewBookings = canVenue(VenueAction.ViewBookings);
  const canViewOrders = canVenue(VenueAction.ViewOrders);
  const canManageProducts = canVenue(VenueAction.ManageProducts);

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useMyVenuesStats();

  const {
    stats: bookingStats,
    loading: bookingLoading,
    error: bookingError,
    refetch: refetchBookingStats,
  } = useBookingStats(selectedVenueId, undefined, undefined, {
    skip: !canViewBookings,
  });

  const {
    stats: orderStats,
    loading: orderLoading,
    error: orderError,
    refetch: refetchOrderStats,
  } = useOrderStats(selectedVenueId, undefined, undefined, {
    skip: !canViewOrders,
  });

  const {
    products: lowStockProducts,
    loading: lowStockLoading,
    error: lowStockError,
    refetch: refetchLowStock,
  } = useLowStockProducts(selectedVenueId, {
    skip: !canManageProducts,
  });

  const loading =
    statsLoading ||
    venuesLoading ||
    (Boolean(selectedVenueId) &&
      ((canViewBookings && bookingLoading) ||
        (canViewOrders && orderLoading) ||
        (canManageProducts && lowStockLoading)));

  const error =
    statsError ?? venuesError ?? bookingError ?? orderError ?? lowStockError;

  const refetchAll = () => {
    void refetchStats();
    refetchVenues();
    if (selectedVenueId) {
      if (canViewBookings) void refetchBookingStats();
      if (canViewOrders) void refetchOrderStats();
      if (canManageProducts) void refetchLowStock();
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
    canViewBookings,
    canViewOrders,
    canManageProducts,
    loading,
    error,
    refetchAll,
  };
}

export type OwnerDashboardData = ReturnType<typeof useOwnerDashboardData>;
