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

import { useQuery } from '@apollo/client/react';
import {
  VENUE_REVENUE_STATS,
  BOOKING_STATS,
  ORDER_STATS,
  ORDER_ANALYTICS,
  PRODUCT_SALES_ANALYTICS,
  VENUE_ANALYTICS,
} from '@/graphql/owner/queries';
import type { BookingStatsResult } from './owner-venue.types';

export function useVenueRevenueStats(
  venueId: string | null,
  period?: string,
) {
  const { data, loading, error, refetch } = useQuery<{
    venueRevenueStats: {
      period: string;
      startDate: string;
      endDate: string;
      growthPercentage: number;
      totalCollectedRevenue?: number;
      totalExpectedRevenue?: number;
      bookingRevenue: {
        collectedRevenue: number;
        expectedRevenue: number;
      };
      orderRevenue: {
        collectedRevenue: number;
        expectedRevenue: number;
      };
    };
  }>(VENUE_REVENUE_STATS, {
    variables: { venueId: venueId ?? '', period },
    skip: !venueId,
  });
  return { stats: data?.venueRevenueStats, loading, error, refetch };
}

export function useBookingStats(
  venueId: string | null,
  fromDate?: string,
  toDate?: string,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<{
    bookingStats: BookingStatsResult;
  }>(BOOKING_STATS, {
    variables: { venueId: venueId ?? '', fromDate, toDate },
    skip: !venueId || options?.skip,
  });
  return { stats: data?.bookingStats, loading, error, refetch };
}

export function useVenueAnalytics(venueId: string | null, period?: string) {
  const { data, loading, error, refetch } = useQuery<{
    venueAnalytics: {
      period: string;
      summary: {
        totalBookings: number;
        totalRevenue: number;
        averageBookingValue: number;
        revenueChangePercent: number;
        peakDay?: string;
        peakHour?: string;
      };
      revenueTrend: Array<{ label: string; value: number }>;
      bookingDistribution: Array<{ label: string; value: number }>;
    };
  }>(VENUE_ANALYTICS, {
    variables: { venueId: venueId ?? '', period },
    skip: !venueId,
  });
  return { analytics: data?.venueAnalytics, loading, error, refetch };
}

export function useOrderStats(
  venueId: string | null,
  fromDate?: string,
  toDate?: string,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<{
    orderStats: {
      totalOrders: number;
      pendingOrders: number;
      completedOrders: number;
      cancelledOrders: number;
      todayOrders: number;
      totalRevenue: number;
      todayRevenue: number;
    };
  }>(ORDER_STATS, {
    variables: { venueId: venueId ?? '', fromDate, toDate },
    skip: !venueId || options?.skip,
  });
  return { stats: data?.orderStats, loading, error, refetch };
}

export function useOrderAnalytics(venueId: string | null, period?: string) {
  const { data, loading, error, refetch } = useQuery<{
    orderAnalytics: {
      period: string;
      summary: {
        totalOrders: number;
        totalRevenue: number;
        averageOrderValue: number;
        revenueChangePercent: number;
      };
      revenueTrend: Array<{ label: string; value: number }>;
      topProducts: Array<{
        productName: string;
        revenue: number;
        quantitySold: number;
      }>;
    };
  }>(ORDER_ANALYTICS, {
    variables: { venueId: venueId ?? '', period },
    skip: !venueId,
  });
  return { analytics: data?.orderAnalytics, loading, error, refetch };
}

export function useProductSalesAnalytics(
  venueId: string | null,
  period?: string,
) {
  const { data, loading, error, refetch } = useQuery<{
    productSalesAnalytics: {
      period: string;
      summary: {
        totalRevenue: number;
        totalItemsSold: number;
        totalOrders: number;
        bestSellingProduct: string;
        revenueChangePercent: number;
        itemsChangePercent: number;
      };
      salesTrend: Array<{
        label: string;
        revenue: number;
        quantitySold: number;
        orderCount: number;
      }>;
      topProducts: Array<{
        productId: string;
        productName: string;
        categoryName: string;
        quantitySold: number;
        revenue: number;
        revenuePercentage: number;
      }>;
    };
  }>(PRODUCT_SALES_ANALYTICS, {
    variables: { venueId: venueId ?? '', period },
    skip: !venueId,
  });
  return { analytics: data?.productSalesAnalytics, loading, error, refetch };
}
