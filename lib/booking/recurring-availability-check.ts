/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * Cross-ref: nalee-sports-mobile useRecurringBookingSetupActions handleContinue
 */

import type { ApolloClient } from '@apollo/client';
import type {
  CheckRecurringAvailabilityQuery,
  GetMyVenueAvailabilityQuery,
} from '@/graphql/generated';
import { GET_MY_VENUE_AVAILABILITY } from '@/graphql/owner/queries';
import type { BookingPromotionSlot } from './build-booking-promotion-input';
import {
  buildRecurringAvailabilityParams,
  getSampleDateForDayOfWeek,
  mapMatchingSlotsFromAvailability,
} from './recurring-slots';

export type RecurringAvailabilityResult =
  CheckRecurringAvailabilityQuery['checkRecurringAvailability'];

export async function resolveRecurringSlotsByDay(params: {
  apolloClient: ApolloClient;
  venueId: string;
  startDate: string;
  primaryDayOfWeek: number;
  selectedDays: number[];
  slotsByDay: Map<number, BookingPromotionSlot[]>;
  anchorSlots: BookingPromotionSlot[];
}): Promise<Map<number, BookingPromotionSlot[]>> {
  const allDays = Array.from(
    new Set([params.primaryDayOfWeek, ...params.selectedDays]),
  );
  let latest = params.slotsByDay;
  const missing = allDays.filter((day) => !latest.has(day));

  if (missing.length === 0) {
    return latest;
  }

  latest = new Map(params.slotsByDay);
  const results = await Promise.all(
    missing.map(async (day) => {
      const dateStr = getSampleDateForDayOfWeek(params.startDate, day);
      try {
        const { data } = await params.apolloClient.query<GetMyVenueAvailabilityQuery>(
          {
            query: GET_MY_VENUE_AVAILABILITY,
            variables: { venueId: params.venueId, date: dateStr },
            fetchPolicy: 'network-only',
          },
        );
        const courts = data?.myVenueAvailability?.courts ?? [];
        return {
          day,
          daySlots: mapMatchingSlotsFromAvailability(
            courts,
            params.anchorSlots,
          ),
        };
      } catch {
        return { day, daySlots: null };
      }
    }),
  );

  for (const { day, daySlots } of results) {
    latest.set(day, daySlots ?? params.anchorSlots);
  }

  return latest;
}

export function buildRecurringAvailabilityCheckInput(params: {
  selectedDays: number[];
  primaryDayOfWeek: number;
  slotsByDay: Map<number, BookingPromotionSlot[]>;
  anchorSlots: BookingPromotionSlot[];
}) {
  return buildRecurringAvailabilityParams({
    selectedDays: params.selectedDays,
    primaryDayOfWeek: params.primaryDayOfWeek,
    slotsByDay: params.slotsByDay,
    fallbackSlots: params.anchorSlots,
  });
}

export function interpretRecurringAvailabilityResult(
  result: RecurringAvailabilityResult,
):
  | { kind: 'ready' }
  | { kind: 'partial'; message: string }
  | { kind: 'blocked'; message: string } {
  if (result.allAvailable) {
    return { kind: 'ready' };
  }

  if (result.availableDates.length > 0) {
    return {
      kind: 'partial',
      message: `Có ${result.unavailableDates.length} ngày không khả dụng. Bạn có thể tiếp tục với các ngày còn lại.`,
    };
  }

  return {
    kind: 'blocked',
    message:
      'Không có ngày khả dụng trong khoảng thời gian đã chọn. Vui lòng đổi khung giờ hoặc ngày bắt đầu.',
  };
}
