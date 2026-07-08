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
  VENUE_HOLD_BOOKINGS_CONNECTION,
  VENUE_RECURRING_BOOKINGS_CONNECTION,
} from '@/graphql/owner/queries';
import {
  CANCEL_BOOKING,
  CHECK_IN_BOOKING,
  COMPLETE_BOOKING,
  CONFIRM_BOOKING,
  APPROVE_HOLD_BOOKING,
  CONFIRM_HOLD_BOOKING,
  MARK_NO_SHOW,
  REJECT_BOOKING,
  REJECT_HOLD_BOOKING,
} from '@/graphql/owner/mutations';
import type {
  BookingSortInput,
  VenueBookingsConnectionQuery,
} from '@/graphql/generated';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import {
  connectionNodes,
  mergeConnectionEdges,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import {
  buildSortedConnectionVariables,
  SORTED_CONNECTION_FETCH_POLICY,
} from '@/hooks/shared/useSortedConnectionQuery';

export type OwnerBookingNode = NonNullable<
  NonNullable<
    VenueBookingsConnectionQuery['venueBookingsConnection']
  >['edges'][number]['node']
>;

type HoldBookingsQueryResult = {
  venueHoldBookingsConnection?: {
    edges: Array<{ cursor: string; node: OwnerHoldBookingNode }>;
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    totalCount: number;
  };
};

type RecurringBookingsQueryResult = {
  venueRecurringBookingsConnection?: {
    edges: Array<{ cursor: string; node: OwnerRecurringBookingNode }>;
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    totalCount: number;
  };
};

export type OwnerHoldBookingNode = {
  _id: string;
  date: string;
  status: string;
  holdExpiresAt?: string | null;
  slots?: Array<{
    courtName?: string;
    startTime?: string;
    endTime?: string;
  }>;
  customer?: { displayName?: string | null } | null;
};

export type OwnerRecurringBookingNode = {
  _id: string;
  date: string;
  status: string;
  recurringConfig?: {
    frequency?: string;
    endDate?: string;
    totalSessions?: number;
    durationMonths?: number;
  } | null;
  customer?: { displayName?: string | null } | null;
};

export function useVenueHoldBookings(
  venueId: string | null,
  sort?: BookingSortInput,
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const baseVariables = { venueId: venueId ?? '' };

  const { data, loading, error, refetch, fetchMore } =
    useQuery<HoldBookingsQueryResult>(VENUE_HOLD_BOOKINGS_CONNECTION, {
      variables: buildSortedConnectionVariables(
        baseVariables,
        sort,
        pagination,
      ),
      skip: !venueId || options?.skip,
      fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
    });

  const connection = data?.venueHoldBookingsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) =>
      buildSortedConnectionVariables(baseVariables, sort, pagination, after),
    mergeResults: (prev, next) => ({
      ...next,
      venueHoldBookingsConnection: {
        ...next.venueHoldBookingsConnection!,
        edges: mergeConnectionEdges(
          prev.venueHoldBookingsConnection?.edges ?? [],
          next.venueHoldBookingsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    bookings: (connectionNodes(connection?.edges) ??
      []) as OwnerHoldBookingNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}

export function useVenueRecurringBookings(
  venueId: string | null,
 
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const baseVariables = { venueId: venueId ?? '' };

  const { data, loading, error, refetch, fetchMore } =
    useQuery<RecurringBookingsQueryResult>(VENUE_RECURRING_BOOKINGS_CONNECTION, {
      variables: buildSortedConnectionVariables(
        baseVariables,
        undefined,
        pagination,
      ),
      skip: !venueId || options?.skip,
      fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
    });

  const connection = data?.venueRecurringBookingsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) =>
      buildSortedConnectionVariables(baseVariables, undefined,  pagination, after),
    mergeResults: (prev, next) => ({
      ...next,
      venueRecurringBookingsConnection: {
        ...next.venueRecurringBookingsConnection!,
        edges: mergeConnectionEdges(
          prev.venueRecurringBookingsConnection?.edges ?? [],
          next.venueRecurringBookingsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    bookings: (connectionNodes(connection?.edges) ??
      []) as OwnerRecurringBookingNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}

export function useOwnerBookingMutations() {
  const [confirmBookingMutation, { loading: confirming }] = useMutation(
    CONFIRM_BOOKING,
    createMutationOptions('ConfirmBooking', 'Đã xác nhận đặt sân'),
  );
  const [rejectBookingMutation, { loading: rejecting }] = useMutation(
    REJECT_BOOKING,
    createMutationOptions('RejectBooking', 'Đã từ chối đặt sân'),
  );
  const [cancelBookingMutation, { loading: cancelling }] = useMutation(
    CANCEL_BOOKING,
    createMutationOptions('CancelBooking', 'Đã hủy đặt sân'),
  );
  const [completeBookingMutation, { loading: completing }] = useMutation(
    COMPLETE_BOOKING,
    createMutationOptions('CompleteBooking', 'Đã hoàn thành đặt sân'),
  );
  const [checkInMutation, { loading: checkingIn }] = useMutation(
    CHECK_IN_BOOKING,
    createMutationOptions('CheckInBooking', 'Đã check-in'),
  );
  const [markNoShowMutation, { loading: markingNoShow }] = useMutation(
    MARK_NO_SHOW,
    createMutationOptions('MarkNoShow', 'Đã đánh dấu vắng mặt'),
  );
  const [approveHoldMutation, { loading: approvingHold }] = useMutation(
    APPROVE_HOLD_BOOKING,
    createMutationOptions('ApproveHoldBooking', 'Đã duyệt giữ chỗ'),
  );
  const [confirmHoldMutation, { loading: confirmingHold }] = useMutation(
    CONFIRM_HOLD_BOOKING,
    createMutationOptions('ConfirmHoldBooking', 'Đã xác nhận giữ chỗ'),
  );
  const [rejectHoldMutation, { loading: rejectingHold }] = useMutation(
    REJECT_HOLD_BOOKING,
    createMutationOptions('RejectHoldBooking', 'Đã từ chối giữ chỗ'),
  );

  const confirmBooking = useCallback(
    async (bookingId: string) => {
      await confirmBookingMutation({ variables: { bookingId } });
    },
    [confirmBookingMutation],
  );

  const rejectBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      await rejectBookingMutation({
        variables: { bookingId, reason: reason ?? 'Từ chối bởi chủ sân' },
      });
    },
    [rejectBookingMutation],
  );

  const cancelBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      await cancelBookingMutation({
        variables: { bookingId, reason: reason ?? 'Hủy bởi chủ sân' },
      });
    },
    [cancelBookingMutation],
  );

  const completeBooking = useCallback(
    async (bookingId: string) => {
      await completeBookingMutation({ variables: { bookingId } });
    },
    [completeBookingMutation],
  );

  const checkIn = useCallback(
    async (bookingId: string) => {
      await checkInMutation({ variables: { bookingId } });
    },
    [checkInMutation],
  );

  const markNoShow = useCallback(
    async (bookingId: string) => {
      await markNoShowMutation({ variables: { bookingId } });
    },
    [markNoShowMutation],
  );

  const approveHoldBooking = useCallback(
    async (bookingId: string, holdDurationMinutes = 60) => {
      await approveHoldMutation({
        variables: { input: { bookingId, holdDurationMinutes } },
      });
    },
    [approveHoldMutation],
  );

  const confirmHoldBooking = useCallback(
    async (bookingId: string) => {
      await confirmHoldMutation({ variables: { bookingId } });
    },
    [confirmHoldMutation],
  );

  const rejectHoldBooking = useCallback(
    async (bookingId: string, reason?: string) => {
      await rejectHoldMutation({
        variables: { bookingId, reason: reason ?? 'Từ chối giữ chỗ' },
      });
    },
    [rejectHoldMutation],
  );

  return {
    confirmBooking,
    rejectBooking,
    cancelBooking,
    completeBooking,
    checkIn,
    markNoShow,
    approveHoldBooking,
    confirmHoldBooking,
    rejectHoldBooking,
    loading: {
      confirming,
      rejecting,
      cancelling,
      completing,
      checkingIn,
      markingNoShow,
      approvingHold,
      confirmingHold,
      rejectingHold,
    },
    isMutating:
      confirming ||
      rejecting ||
      cancelling ||
      completing ||
      checkingIn ||
      markingNoShow ||
      approvingHold ||
      confirmingHold ||
      rejectingHold,
  };
}
