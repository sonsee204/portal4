/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useQuery } from '@apollo/client/react';
import { GET_AVAILABLE_PROMOTIONS_FOR_BOOKING } from '@/graphql/owner/queries';
import type {
  ApplyPromotionInput,
  GetAvailablePromotionsForBookingQuery,
} from '@/graphql/generated';

export function useAvailablePromotionsForBooking(
  input: ApplyPromotionInput | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } =
    useQuery<GetAvailablePromotionsForBookingQuery>(
      GET_AVAILABLE_PROMOTIONS_FOR_BOOKING,
      {
        variables: { input: input! },
        skip: options?.skip || !input?.venueId || !input.totalAmount,
        fetchPolicy: 'network-only',
      },
    );

  return {
    available: data?.availablePromotionsForBooking ?? null,
    loading,
    error,
    refetch,
  };
}
