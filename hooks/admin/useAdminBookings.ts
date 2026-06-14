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

import { useCallback, useEffect, useMemo } from 'react';
import { useApolloClient, useQuery } from '@apollo/client/react';
import {
  ADMIN_GET_ALL_BOOKINGS,
  ADMIN_GET_USER_BOOKINGS,
} from '@/graphql/queries/admin';
import type {
  AdminGetAllBookingsQuery,
  AdminGetUserBookingsQuery,
} from '@/graphql/generated';
import {
  connectionNodes,
  resolveConnectionFirst,
} from '@/hooks/shared/useCursorConnection';
import { useConnectionPageAfter } from '@/hooks/shared/useConnectionPageAfter';

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

interface AllBookingsVariables {
  statuses?: string[];
  fromDate?: string;
  toDate?: string;
  pagination?: { page?: number; limit?: number; first?: number; after?: string | null };
}

export function useAdminAllBookings(
  variables: AllBookingsVariables,
  options?: { skip?: boolean },
) {
  const page = variables.pagination?.page ?? 1;
  const first = resolveConnectionFirst(variables.pagination);
  const resetKey = JSON.stringify({
    statuses: variables.statuses,
    fromDate: variables.fromDate,
    toDate: variables.toDate,
  });

  const client = useApolloClient();
  const prefetchPage = useCallback(
    async (after: string | null, pageSize: number) => {
      const { data } = await client.query<AdminGetAllBookingsQuery>({
        query: ADMIN_GET_ALL_BOOKINGS,
        variables: {
          statuses: variables.statuses,
          fromDate: variables.fromDate,
          toDate: variables.toDate,
          pagination: { first: pageSize, after },
        },
        fetchPolicy: 'network-only',
      });
      const conn = data?.adminAllBookingsConnection;
      return {
        endCursor: conn?.pageInfo?.endCursor,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      };
    },
    [client, variables.statuses, variables.fromDate, variables.toDate],
  );

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch } = useQuery<AdminGetAllBookingsQuery>(
    ADMIN_GET_ALL_BOOKINGS,
    {
      variables: {
        statuses: variables.statuses,
        fromDate: variables.fromDate,
        toDate: variables.toDate,
        pagination: { first, after },
      },
      skip: options?.skip || (page > 1 && resolving),
    },
  );

  const connection = data?.adminAllBookingsConnection;
  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  const customerNames: Record<string, string> = useMemo(() => {
    try {
      return connection?.customerNamesJson
        ? JSON.parse(connection.customerNamesJson)
        : {};
    } catch {
      return {};
    }
  }, [connection?.customerNamesJson]);

  return {
    bookings: connectionNodes(connection?.edges) ?? [],
    customerNames,
    total: connection?.totalCount ?? 0,
    hasMore: connection?.pageInfo?.hasNextPage ?? false,
    loading: loading || resolving,
    error,
    refetch,
  };
}

export function useAdminUserBookings(
  userId: string,
  variables: {
    statuses?: string[];
    pagination?: { page?: number; limit?: number; first?: number; after?: string | null };
  },
  options?: { skip?: boolean },
) {
  const page = variables.pagination?.page ?? 1;
  const first = resolveConnectionFirst(variables.pagination);
  const resetKey = JSON.stringify({ userId, statuses: variables.statuses });

  const client = useApolloClient();
  const prefetchPage = useCallback(
    async (after: string | null, pageSize: number) => {
      const { data } = await client.query<AdminGetUserBookingsQuery>({
        query: ADMIN_GET_USER_BOOKINGS,
        variables: {
          userId,
          statuses: variables.statuses,
          pagination: { first: pageSize, after },
        },
        fetchPolicy: 'network-only',
      });
      const conn = data?.adminUserBookingsConnection;
      return {
        endCursor: conn?.pageInfo?.endCursor,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      };
    },
    [client, userId, variables.statuses],
  );

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch } = useQuery<AdminGetUserBookingsQuery>(
    ADMIN_GET_USER_BOOKINGS,
    {
      variables: {
        userId,
        statuses: variables.statuses,
        pagination: { first, after },
      },
      skip: options?.skip || !userId || (page > 1 && resolving),
    },
  );

  const connection = data?.adminUserBookingsConnection;
  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  return {
    bookings: connectionNodes(connection?.edges) ?? [],
    total: connection?.totalCount ?? 0,
    hasMore: connection?.pageInfo?.hasNextPage ?? false,
    loading: loading || resolving,
    error,
    refetch,
  };
}
