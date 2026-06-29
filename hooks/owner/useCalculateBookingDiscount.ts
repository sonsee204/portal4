/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { CALCULATE_BOOKING_DISCOUNT } from '@/graphql/owner/queries';
import type {
  ApplyPromotionInput,
  CalculateBookingDiscountQuery,
} from '@/graphql/generated';

export function useCalculateBookingDiscount() {
  const [calculate, { loading, error }] =
    useLazyQuery<CalculateBookingDiscountQuery>(CALCULATE_BOOKING_DISCOUNT, {
      fetchPolicy: 'network-only',
    });

  const calculateDiscount = useCallback(
    async (input: ApplyPromotionInput) => {
      const result = await calculate({ variables: { input } });
      return result.data?.calculateBookingDiscount ?? null;
    },
    [calculate],
  );

  return { calculateDiscount, loading, error };
}
