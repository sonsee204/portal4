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
  ADMIN_GET_USER_BOOKINGS,
} from '@/graphql/admin/queries';
import type {
  AdminGetUserBookingsQuery,
} from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';

export interface AdminBooking {
  _id: string;
  venueName: string;
  venueAddress: string;
  date: string;
  timeSlots: string;
  status: string;
  totalPrice: number;
  courtName: string;
}

interface UserBookingsVariables {
  statuses?: string[];
  pagination?: LegacyPagePagination;
}

export function useAdminUserBookings(
  userId: string,
  variables: {
    statuses?: string[];
    pagination?: LegacyPagePagination;
  },
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(variables.pagination);

  const { data, loading, error, refetch, fetchMore } = useQuery<AdminGetUserBookingsQuery>(
    ADMIN_GET_USER_BOOKINGS,
    {
      variables: {
        userId,
        statuses: variables.statuses,
        pagination: { first, after: variables.pagination?.after ?? null },
      },
      skip: options?.skip || !userId,
    },
  );

  const connection = data?.adminUserBookingsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;
  const totalCount = connection?.totalCount ?? 0;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      userId,
      statuses: variables.statuses,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      adminUserBookingsConnection: {
        ...next.adminUserBookingsConnection!,
        edges: mergeConnectionEdges(
          prev.adminUserBookingsConnection?.edges ?? [],
          next.adminUserBookingsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    bookings: connectionNodes(connection?.edges) ?? [],
    total: totalCount,
    totalCount,
    hasMore: hasNextPage,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}
