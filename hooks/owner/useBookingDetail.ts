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
import { GET_BOOKING } from '@/graphql/owner/queries';
import type { GetBookingQuery } from '@/graphql/generated';

export type BookingDetailNode = NonNullable<GetBookingQuery['booking']>;

export function useBookingDetail(
  bookingId: string | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<GetBookingQuery>(
    GET_BOOKING,
    {
      variables: { bookingId: bookingId ?? '' },
      skip: !bookingId || options?.skip,
    },
  );

  return {
    booking: data?.booking ?? null,
    loading,
    error,
    refetch,
  };
}
