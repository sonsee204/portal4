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

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  ADMIN_GET_ALL_BOOKINGS,
  ADMIN_GET_USER_BOOKINGS,
} from '@/graphql/queries/admin';

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

interface AllBookingsResult {
  adminGetAllBookings: {
    bookings: AdminBooking[];
    customerNamesJson: string;
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface UserBookingsResult {
  adminGetUserBookings: {
    bookings: AdminBooking[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface AllBookingsVariables {
  statuses?: string[];
  fromDate?: string;
  toDate?: string;
  pagination?: { page: number; limit: number };
}

export function useAdminAllBookings(
  variables: AllBookingsVariables,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<AllBookingsResult>(
    ADMIN_GET_ALL_BOOKINGS,
    {
      variables,
      skip: options?.skip,
    },
  );

  const result = data?.adminGetAllBookings;

  const customerNames: Record<string, string> = useMemo(() => {
    try {
      return result?.customerNamesJson
        ? JSON.parse(result.customerNamesJson)
        : {};
    } catch {
      return {};
    }
  }, [result?.customerNamesJson]);

  return {
    bookings: result?.bookings ?? [],
    customerNames,
    total: result?.total ?? 0,
    hasMore: result?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}

export function useAdminUserBookings(
  userId: string,
  variables: { statuses?: string[]; pagination?: { page: number; limit: number } },
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<UserBookingsResult>(
    ADMIN_GET_USER_BOOKINGS,
    {
      variables: { userId, ...variables },
      skip: options?.skip || !userId,
    },
  );

  const result = data?.adminGetUserBookings;

  return {
    bookings: result?.bookings ?? [],
    total: result?.total ?? 0,
    hasMore: result?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}
