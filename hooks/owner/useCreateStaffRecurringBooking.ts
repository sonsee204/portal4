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
import { useMutation } from '@apollo/client/react';
import { CREATE_STAFF_RECURRING_BOOKING } from '@/graphql/owner/booking/mutations';
import {
  GET_MY_VENUE_AVAILABILITY,
  VENUE_BOOKINGS_CONNECTION,
} from '@/graphql/owner/queries';
import type {
  CreateStaffRecurringBookingInput,
  CreateStaffRecurringBookingMutation,
} from '@/graphql/generated';
import {
  createMutationOptions,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';

export function useCreateStaffRecurringBooking(
  venueId: string | null | undefined,
) {
  const [mutate, { loading, error }] =
    useMutation<CreateStaffRecurringBookingMutation>(
      CREATE_STAFF_RECURRING_BOOKING,
      createMutationOptions(
        'CreateStaffRecurringBooking',
        'Đặt lịch cố định thành công',
      ),
    );

  const createStaffRecurringBooking = useCallback(
    async (input: CreateStaffRecurringBookingInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: venueId
          ? [
            {
              query: GET_MY_VENUE_AVAILABILITY,
              variables: { venueId, date: input.startDate },
            },
            {
              query: VENUE_BOOKINGS_CONNECTION,
              variables: {
                venueId,
                filter: {
                  fromDate: input.startDate,
                  toDate: input.startDate,
                },
                pagination: { first: 50 },
              },
            },
          ]
          : ['GetMyVenueAvailability'],
        ...strictMutationErrorPolicy,
      });
      return result.data?.createStaffRecurringBooking ?? null;
    },
    [mutate, venueId],
  );

  return { createStaffRecurringBooking, loading, error };
}
