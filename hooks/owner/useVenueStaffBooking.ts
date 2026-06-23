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
  GET_MY_VENUE_AVAILABILITY,
  VENUE_BOOKINGS_CONNECTION,
} from '@/graphql/owner/queries';
import { CREATE_STAFF_BOOKING } from '@/graphql/owner/mutations';
import type {
  CreateStaffBookingInput,
  GetMyVenueAvailabilityQuery,
} from '@/graphql/generated';
import {
  createMutationOptions,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';
import type { StaffAvailabilityCourt } from '@/lib/venue/calendar-staff-booking';

export function useMyVenueAvailability(
  venueId: string | null | undefined,
  date: string,
) {
  const { data, loading, error, refetch } = useQuery<GetMyVenueAvailabilityQuery>(
    GET_MY_VENUE_AVAILABILITY,
    {
      variables: { venueId: venueId ?? '', date },
      skip: !venueId || !date,
      fetchPolicy: 'cache-and-network',
    },
  );

  const courts = (data?.myVenueAvailability?.courts ??
    []) as StaffAvailabilityCourt[];

  return { courts, loading, error, refetch };
}

export function useCreateStaffBooking(venueId: string | null | undefined) {
  const [mutate, { loading, error }] = useMutation<
    {
      createStaffBooking: {
        booking: { _id: string };
        order: { _id: string; orderCode: string };
      };
    },
    { input: CreateStaffBookingInput }
  >(
    CREATE_STAFF_BOOKING,
    createMutationOptions('CreateStaffBooking', 'Đặt lịch thành công'),
  );

  const createStaffBooking = useCallback(
    async (input: CreateStaffBookingInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: venueId
          ? [
            {
              query: GET_MY_VENUE_AVAILABILITY,
              variables: { venueId, date: input.date },
            },
            {
              query: VENUE_BOOKINGS_CONNECTION,
              variables: {
                venueId,
                filter: { fromDate: input.date, toDate: input.date },
                pagination: { first: 50 },
              },
            },
          ]
          : ['GetMyVenueAvailability'],
        ...strictMutationErrorPolicy,
      });
      return result.data?.createStaffBooking ?? null;
    },
    [mutate, venueId],
  );

  return { createStaffBooking, loading, error };
}
