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

import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  GET_MY_VENUES_STATS,
  MY_VENUES_CONNECTION,
  VENUE_BOOKINGS_CONNECTION,
  VENUE_REVENUE_STATS,
  BOOKING_STATS,
  ORDER_STATS,
  ORDER_ANALYTICS,
  PRODUCT_SALES_ANALYTICS,
  VENUE_ANALYTICS,
  GET_VENUE_DETAIL,
  VENUE_COURTS_CONNECTION,
} from '@/graphql/owner/queries';
import {
  UPDATE_VENUE,
  UPDATE_VENUE_ORDER_TYPE_CONFIGS,
  CREATE_COURT,
  UPDATE_COURT,
  DELETE_COURT,
} from '@/graphql/owner/mutations';
import type {
  GetMyVenuesStatsQuery,
  MyVenuesConnectionQuery,
  VenueBookingsConnectionQuery,
  UpdateVenueInput,
  CreateCourtInput,
  UpdateCourtInput,
  SportType,
  CourtStatus,
} from '@/graphql/generated';
import {
  createMutationOptions,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';

type MyVenueNode = NonNullable<
  NonNullable<MyVenuesConnectionQuery['myVenuesConnection']>['edges'][number]['node']
>;

type VenueBookingNode = NonNullable<
  NonNullable<
    VenueBookingsConnectionQuery['venueBookingsConnection']
  >['edges'][number]['node']
>;

export type VenueDetailNode = {
  __typename?: 'Venue';
  _id: string;
  name: string;
  description?: string | null;
  status: string;
  phoneNumber?: string | null;
  email?: string | null;
  courtCount: number;
  coverImageUrl?: string | null;
  images?: string[] | null;
  isOwner: boolean;
  isStaff: boolean;
  myPermissions: string[];
  marginThresholds?: {
    warningMargin: number;
    dangerMargin: number;
  } | null;
  operatingHours?: Array<{
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
    isClosed: boolean;
    is24Hours?: boolean | null;
  }>;
  location: {
    __typename?: 'VenueLocation';
    address: string;
    city?: string | null;
    district?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  };
};

export type VenueCourtNode = {
  __typename?: 'Court';
  _id: string;
  name: string;
  sportType: SportType;
  status: CourtStatus;
  defaultPricePerHour: number;
  peakPricePerHour: number;
  displayOrder?: number | null;
};

export type LowStockProductNode = {
  __typename?: 'Product';
  _id: string;
  name: string;
  stockQuantity: number;
  lowStockThreshold: number;
};

type BookingStatsResult = {
  __typename?: 'BookingStats';
  totalBookings: number;
  pendingBookings?: number;
  confirmedBookings: number;
  cancelledBookings: number;
  todayBookings: number;
};

export function useMyVenuesStats() {
  const { data, loading, error, refetch } = useQuery<GetMyVenuesStatsQuery>(
    GET_MY_VENUES_STATS,
  );
  return { stats: data?.myVenuesStats, loading, error, refetch };
}

export function useMyVenues(pagination?: LegacyPagePagination) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<MyVenuesConnectionQuery>(MY_VENUES_CONNECTION, {
      variables: { pagination: { first } },
    });

  const connection = data?.myVenuesConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      myVenuesConnection: {
        ...next.myVenuesConnection!,
        edges: mergeConnectionEdges(
          prev.myVenuesConnection?.edges ?? [],
          next.myVenuesConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    venues: (connectionNodes(connection?.edges) ?? []) as MyVenueNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useVenueBookings(
  venueId: string | null,
  filter?: {
    statuses?: string[];
    fromDate?: string;
    toDate?: string;
    bookingType?: string;
    searchQuery?: string;
  },
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const graphFilter = filter
    ? {
      statuses: filter.statuses,
      fromDate: filter.fromDate,
      toDate: filter.toDate,
      bookingType: filter.bookingType,
      searchQuery: filter.searchQuery,
    }
    : undefined;

  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueBookingsConnectionQuery>(VENUE_BOOKINGS_CONNECTION, {
      variables: {
        venueId: venueId ?? '',
        filter: graphFilter,
        pagination: { first },
      },
      skip: !venueId || options?.skip,
    });

  const connection = data?.venueBookingsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      filter: graphFilter,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueBookingsConnection: {
        ...next.venueBookingsConnection!,
        edges: mergeConnectionEdges(
          prev.venueBookingsConnection?.edges ?? [],
          next.venueBookingsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    bookings: (connectionNodes(connection?.edges) ?? []) as VenueBookingNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

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
  }>(
    VENUE_REVENUE_STATS,
    {
      variables: { venueId: venueId ?? '', period },
      skip: !venueId,
    },
  );
  return { stats: data?.venueRevenueStats, loading, error, refetch };
}

export function useBookingStats(
  venueId: string | null,
  fromDate?: string,
  toDate?: string,
) {
  const { data, loading, error, refetch } = useQuery<{
    bookingStats: BookingStatsResult;
  }>(BOOKING_STATS, {
    variables: { venueId: venueId ?? '', fromDate, toDate },
    skip: !venueId,
  });
  return { stats: data?.bookingStats, loading, error, refetch };
}

export function useVenueAnalytics(
  venueId: string | null,
  period?: string,
) {
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
  }>(
    VENUE_ANALYTICS,
    {
      variables: { venueId: venueId ?? '', period },
      skip: !venueId,
    },
  );
  return { analytics: data?.venueAnalytics, loading, error, refetch };
}

export {
  useVenueOrders,
  useOrdersPendingRefund,
  useOwnerOrderMutations,
  useLookupCustomerByPhone,
  useCreateStaffOrder,
  type VenueOrderNode,
  type PendingRefundOrderNode,
} from './useOwnerOrders';

export {
  useVenueProducts,
  useVenueCategories,
  useProductStats,
  useLowStockProducts,
  useOwnerProductMutations,
  useOwnerCategoryMutations,
  useImportStock,
  useMyVenuesForProductTransfer,
  type VenueProductNode,
  type VenueCategoryNode,
} from './useOwnerProducts';

export function useOrderStats(
  venueId: string | null,
  fromDate?: string,
  toDate?: string,
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
  }>(
    ORDER_STATS,
    {
      variables: { venueId: venueId ?? '', fromDate, toDate },
      skip: !venueId,
    },
  );
  return { stats: data?.orderStats, loading, error, refetch };
}

export function useOrderAnalytics(
  venueId: string | null,
  period?: string,
) {
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
  }>(
    ORDER_ANALYTICS,
    {
      variables: { venueId: venueId ?? '', period },
      skip: !venueId,
    },
  );
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
  }>(
    PRODUCT_SALES_ANALYTICS,
    {
      variables: { venueId: venueId ?? '', period },
      skip: !venueId,
    },
  );
  return { analytics: data?.productSalesAnalytics, loading, error, refetch };
}

export function useVenueDetail(venueId: string | null) {
  const { data, loading, error, refetch } = useQuery<{
    venue: VenueDetailNode | null;
  }>(GET_VENUE_DETAIL, {
    variables: { venueId: venueId ?? '' },
    skip: !venueId,
  });
  return { venue: data?.venue ?? null, loading, error, refetch };
}

export function useVenueCourts(
  venueId: string | null,
  pagination?: LegacyPagePagination,
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } = useQuery<{
    venueCourtsConnection: {
      totalCount: number;
      edges: Array<{ cursor: string; node: VenueCourtNode }>;
      pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    };
  }>(VENUE_COURTS_CONNECTION, {
    variables: { venueId: venueId ?? '', pagination: { first } },
    skip: !venueId,
  });

  const connection = data?.venueCourtsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueCourtsConnection: {
        ...next.venueCourtsConnection!,
        edges: mergeConnectionEdges(
          prev.venueCourtsConnection?.edges ?? [],
          next.venueCourtsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    courts: (connectionNodes(connection?.edges) ?? []) as VenueCourtNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useUpdateVenue() {
  const [mutate, { loading, error }] = useMutation<
    { updateVenue: { _id: string; name: string; status: string } },
    { input: UpdateVenueInput }
  >(
    UPDATE_VENUE,
    createMutationOptions('Update venue', 'Cập nhật sân thành công'),
  );

  const updateVenue = useCallback(
    async (input: UpdateVenueInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: [
          { query: GET_VENUE_DETAIL, variables: { venueId: input.venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.updateVenue;
    },
    [mutate],
  );

  return { updateVenue, loading, error };
}

export function useUpdateVenueOrderTypeConfigs() {
  const [mutate, { loading, error }] = useMutation<
    {
      updateVenueOrderTypeConfigs: {
        _id: string;
        orderTypeConfigs: Array<{ orderType: string; isEnabled: boolean }>;
      };
    },
    {
      input: {
        venueId: string;
        orderTypeConfigs: Array<{
          orderType: string;
          isEnabled: boolean;
          label?: string;
          icon?: string;
          color?: string;
          displayOrder?: number;
        }>;
      };
    }
  >(
    UPDATE_VENUE_ORDER_TYPE_CONFIGS,
    createMutationOptions(
      'Update venue order type configs',
      'Cập nhật loại đơn thành công',
    ),
  );

  const updateVenueOrderTypeConfigs = useCallback(
    async (
      venueId: string,
      orderTypeConfigs: Array<{
        orderType: string;
        isEnabled: boolean;
        label?: string;
        icon?: string;
        color?: string;
        displayOrder?: number;
      }>,
    ) => {
      const result = await mutate({
        variables: { input: { venueId, orderTypeConfigs } },
        refetchQueries: [{ query: GET_VENUE_DETAIL, variables: { venueId } }],
        ...strictMutationErrorPolicy,
      });
      return result.data?.updateVenueOrderTypeConfigs;
    },
    [mutate],
  );

  return { updateVenueOrderTypeConfigs, loading, error };
}

export function useCreateCourt() {
  const [mutate, { loading, error }] = useMutation<
    { createCourt: VenueCourtNode },
    { input: CreateCourtInput }
  >(
    CREATE_COURT,
    createMutationOptions('Create court', 'Thêm sân con thành công'),
  );

  const createCourt = useCallback(
    async (input: CreateCourtInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: [
          {
            query: VENUE_COURTS_CONNECTION,
            variables: { venueId: input.venueId, pagination: { first: 50 } },
          },
          { query: GET_VENUE_DETAIL, variables: { venueId: input.venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.createCourt;
    },
    [mutate],
  );

  return { createCourt, loading, error };
}

export function useUpdateCourt(venueId: string) {
  const [mutate, { loading, error }] = useMutation<
    { updateCourt: VenueCourtNode },
    { input: UpdateCourtInput }
  >(
    UPDATE_COURT,
    createMutationOptions('Update court', 'Cập nhật sân con thành công'),
  );

  const updateCourt = useCallback(
    async (input: UpdateCourtInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: [
          {
            query: VENUE_COURTS_CONNECTION,
            variables: { venueId, pagination: { first: 50 } },
          },
          { query: GET_VENUE_DETAIL, variables: { venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.updateCourt;
    },
    [mutate, venueId],
  );

  return { updateCourt, loading, error };
}

export function useDeleteCourt(venueId: string) {
  const [mutate, { loading, error }] = useMutation<
    { deleteCourt: boolean },
    { courtId: string }
  >(
    DELETE_COURT,
    createMutationOptions('Delete court', 'Xóa sân con thành công'),
  );

  const deleteCourt = useCallback(
    async (courtId: string) => {
      const result = await mutate({
        variables: { courtId },
        refetchQueries: [
          {
            query: VENUE_COURTS_CONNECTION,
            variables: { venueId, pagination: { first: 50 } },
          },
          { query: GET_VENUE_DETAIL, variables: { venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.deleteCourt;
    },
    [mutate, venueId],
  );

  return { deleteCourt, loading, error };
}

export { useOwnerStaff, useVenuePendingInvitations } from './useOwnerStaff';
export type { VenueStaffNode } from './useOwnerStaff';

export {
  useVenueHoldBookings,
  useVenueRecurringBookings,
  useOwnerBookingMutations,
} from './useOwnerBookings';
export type {
  OwnerBookingNode,
  OwnerHoldBookingNode,
  OwnerRecurringBookingNode,
} from './useOwnerBookings';

export { useBookingDetail } from './useBookingDetail';
export { useOrderDetail, type OrderDetailNode } from './useOrderDetail';
export {
  useBookingDetailActions,
  type BookingDetailActions,
} from './useBookingDetailActions';
export {
  useMyVenueAvailability,
  useCreateStaffBooking,
} from './useVenueStaffBooking';
export type { BookingDetailNode } from './useBookingDetail';
