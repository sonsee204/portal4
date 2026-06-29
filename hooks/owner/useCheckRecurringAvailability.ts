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
import { CHECK_RECURRING_AVAILABILITY } from '@/graphql/owner/queries';
import type {
  CheckRecurringAvailabilityQuery,
  DayScheduleInput,
  BookedSlotInput,
} from '@/graphql/generated';

export interface CheckRecurringAvailabilityParams {
  venueId: string;
  startDate: string;
  durationMonths: number;
  slots?: BookedSlotInput[];
  daySchedules?: DayScheduleInput[];
  isStaffMode?: boolean;
  excludeDates?: string[];
  customerId?: string;
  discountCode?: string;
}

export function useCheckRecurringAvailability() {
  const [check, { loading, error, data }] =
    useLazyQuery<CheckRecurringAvailabilityQuery>(
      CHECK_RECURRING_AVAILABILITY,
      { fetchPolicy: 'network-only' },
    );

  const checkRecurringAvailability = useCallback(
    async (params: CheckRecurringAvailabilityParams) => {
      const result = await check({
        variables: {
          venueId: params.venueId,
          startDate: params.startDate,
          durationMonths: params.durationMonths,
          slots: params.slots,
          daySchedules: params.daySchedules,
          isStaffMode: params.isStaffMode ?? true,
          excludeDates: params.excludeDates?.length
            ? params.excludeDates
            : undefined,
          customerId: params.customerId,
          discountCode: params.discountCode,
        },
      });
      return result.data?.checkRecurringAvailability ?? null;
    },
    [check],
  );

  return {
    checkRecurringAvailability,
    availability: data?.checkRecurringAvailability ?? null,
    loading,
    error,
  };
}
