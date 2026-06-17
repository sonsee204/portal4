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
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import {
  CANCEL_ORDER,
  CANCEL_ORDER_WITH_REFUND,
  COMPLETE_ORDER,
  CONFIRM_ORDER,
  CREATE_STAFF_ORDER,
  MARK_ORDER_PREPARING,
  MARK_ORDER_READY,
} from '@/graphql/owner/mutations';
import {
  LOOKUP_CUSTOMER_BY_PHONE,
  ORDERS_PENDING_REFUND_CONNECTION,
  VENUE_ORDERS_CONNECTION,
} from '@/graphql/owner/queries';
import type {
  OrdersPendingRefundConnectionQuery,
  OrderStatus,
  VenueOrdersConnectionQuery,
} from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';

const ORDER_MUTATION_REFETCH_QUERIES = [
  'VenueOrdersConnection',
  'OrdersPendingRefundConnection',
] as const;

export type VenueOrderNode = NonNullable<
  NonNullable<
    VenueOrdersConnectionQuery['venueOrdersConnection']
  >['edges'][number]['node']
>;

export type PendingRefundOrderNode = NonNullable<
  NonNullable<
    OrdersPendingRefundConnectionQuery['ordersPendingRefundConnection']
  >['edges'][number]['node']
>;

export function useVenueOrders(
  venueId: string | null,
  filter?: { statuses?: OrderStatus[]; searchQuery?: string },
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueOrdersConnectionQuery>(VENUE_ORDERS_CONNECTION, {
      variables: {
        venueId: venueId ?? '',
        filter: filter
          ? {
            statuses: filter.statuses,
            searchQuery: filter.searchQuery,
          }
          : undefined,
        pagination: { first },
      },
      skip: !venueId || options?.skip,
    });

  const connection = data?.venueOrdersConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      filter: filter
        ? {
          statuses: filter.statuses,
          searchQuery: filter.searchQuery,
        }
        : undefined,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueOrdersConnection: {
        ...next.venueOrdersConnection!,
        edges: mergeConnectionEdges(
          prev.venueOrdersConnection?.edges ?? [],
          next.venueOrdersConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    orders: (connectionNodes(connection?.edges) ?? []) as VenueOrderNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useOrdersPendingRefund(
  venueId: string | null,
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<OrdersPendingRefundConnectionQuery>(
      ORDERS_PENDING_REFUND_CONNECTION,
      {
        variables: {
          venueId: venueId ?? '',
          pagination: { first },
        },
        skip: !venueId || options?.skip,
      },
    );

  const connection = data?.ordersPendingRefundConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      ordersPendingRefundConnection: {
        ...next.ordersPendingRefundConnection!,
        edges: mergeConnectionEdges(
          prev.ordersPendingRefundConnection?.edges ?? [],
          next.ordersPendingRefundConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    orders: (connectionNodes(connection?.edges) ??
      []) as PendingRefundOrderNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useOwnerOrderMutations() {
  const [confirmOrderMutation, { loading: confirming }] = useMutation(
    CONFIRM_ORDER,
    createMutationOptions('ConfirmOrder', 'Đã xác nhận đơn hàng'),
  );

  const [markPreparingMutation, { loading: markingPreparing }] = useMutation(
    MARK_ORDER_PREPARING,
    createMutationOptions('MarkOrderPreparing', 'Đã chuyển sang đang chuẩn bị'),
  );

  const [markReadyMutation, { loading: markingReady }] = useMutation(
    MARK_ORDER_READY,
    createMutationOptions('MarkOrderReady', 'Đã đánh dấu sẵn sàng'),
  );

  const [completeOrderMutation, { loading: completing }] = useMutation(
    COMPLETE_ORDER,
    createMutationOptions('CompleteOrder', 'Đã hoàn thành đơn hàng'),
  );

  const [cancelOrderMutation, { loading: cancelling }] = useMutation(
    CANCEL_ORDER,
    createMutationOptions('CancelOrder', 'Đã hủy đơn hàng'),
  );

  const [cancelWithRefundMutation, { loading: cancellingWithRefund }] =
    useMutation(
      CANCEL_ORDER_WITH_REFUND,
      createMutationOptions('CancelOrderWithRefund', 'Đã hủy đơn và tạo yêu cầu hoàn tiền'),
    );

  const confirmOrder = useCallback(
    async (orderId: string) => {
      await confirmOrderMutation({
        variables: { orderId },
        refetchQueries: [...ORDER_MUTATION_REFETCH_QUERIES],
      });
    },
    [confirmOrderMutation],
  );

  const markPreparing = useCallback(
    async (orderId: string) => {
      await markPreparingMutation({
        variables: { orderId },
        refetchQueries: [...ORDER_MUTATION_REFETCH_QUERIES],
      });
    },
    [markPreparingMutation],
  );

  const markReady = useCallback(
    async (orderId: string) => {
      await markReadyMutation({
        variables: { orderId },
        refetchQueries: [...ORDER_MUTATION_REFETCH_QUERIES],
      });
    },
    [markReadyMutation],
  );

  const completeOrder = useCallback(
    async (orderId: string) => {
      await completeOrderMutation({
        variables: { orderId },
        refetchQueries: [...ORDER_MUTATION_REFETCH_QUERIES],
      });
    },
    [completeOrderMutation],
  );

  const cancelOrder = useCallback(
    async (orderId: string, reason?: string) => {
      await cancelOrderMutation({
        variables: { orderId, reason },
        refetchQueries: [...ORDER_MUTATION_REFETCH_QUERIES],
      });
    },
    [cancelOrderMutation],
  );

  const cancelOrderWithRefund = useCallback(
    async (
      orderId: string,
      reason: string,
      refundPercent?: number,
      refundNote?: string,
    ) => {
      await cancelWithRefundMutation({
        variables: {
          orderId,
          reason,
          refundPercent,
          refundNote,
        },
        refetchQueries: [...ORDER_MUTATION_REFETCH_QUERIES],
      });
    },
    [cancelWithRefundMutation],
  );

  return {
    confirmOrder,
    markPreparing,
    markReady,
    completeOrder,
    cancelOrder,
    cancelOrderWithRefund,
    confirming,
    markingPreparing,
    markingReady,
    completing,
    cancelling,
    cancellingWithRefund,
    actionLoading:
      confirming ||
      markingPreparing ||
      markingReady ||
      completing ||
      cancelling ||
      cancellingWithRefund,
  };
}

export function useLookupCustomerByPhone() {
  const [runLookup, { loading, error }] = useLazyQuery<
    {
      lookupCustomerByPhone?: {
        _id: string;
        displayName: string;
        phone?: string | null;
        email?: string | null;
      } | null;
    },
    { phone: string }
  >(LOOKUP_CUSTOMER_BY_PHONE);

  const lookupCustomerByPhone = useCallback(
    async (phone: string) => {
      const result = await runLookup({ variables: { phone } });
      return result.data?.lookupCustomerByPhone ?? null;
    },
    [runLookup],
  );

  return { lookupCustomerByPhone, loading, error };
}

export function useCreateStaffOrder() {
  const [mutate, { loading, error }] = useMutation<
    { createStaffOrder: { _id: string; orderCode: string; status: string } },
    { input: Record<string, unknown> }
  >(
    CREATE_STAFF_ORDER,
    createMutationOptions('CreateStaffOrder', 'Đã tạo đơn hàng'),
  );

  const createStaffOrder = useCallback(
    async (input: Record<string, unknown>) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: ['VenueOrdersConnection'],
      });
      return result.data?.createStaffOrder;
    },
    [mutate],
  );

  return { createStaffOrder, loading, error };
}
