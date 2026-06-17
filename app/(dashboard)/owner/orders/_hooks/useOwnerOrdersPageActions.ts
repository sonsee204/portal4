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

import { useCallback, useState } from 'react';
import { useOwnerOrderMutations, type VenueOrderNode } from '@/hooks/owner';
import type { OwnerOrdersPageData } from './useOwnerOrdersPageData';

export interface CancelModalState {
  order: VenueOrderNode;
  useRefund: boolean;
}

export function useOwnerOrdersPageActions(data: OwnerOrdersPageData) {
  const {
    setViewTab,
    setStatusFilter,
    loadMore,
    refetchAll,
  } = data;

  const mutations = useOwnerOrderMutations();
  const [cancelModal, setCancelModal] = useState<CancelModalState | null>(null);
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);

  const handleViewTabChange = useCallback(
    (value: string) => {
      setViewTab(value as 'all' | 'pending_refund');
    },
    [setViewTab],
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
    },
    [setStatusFilter],
  );

  const handleLoadMore = useCallback(() => {
    void loadMore();
  }, [loadMore]);

  const handleConfirm = useCallback(
    async (orderId: string) => {
      await mutations.confirmOrder(orderId);
      refetchAll();
    },
    [mutations, refetchAll],
  );

  const handleMarkPreparing = useCallback(
    async (orderId: string) => {
      await mutations.markPreparing(orderId);
      refetchAll();
    },
    [mutations, refetchAll],
  );

  const handleMarkReady = useCallback(
    async (orderId: string) => {
      await mutations.markReady(orderId);
      refetchAll();
    },
    [mutations, refetchAll],
  );

  const handleComplete = useCallback(
    async (orderId: string) => {
      await mutations.completeOrder(orderId);
      refetchAll();
    },
    [mutations, refetchAll],
  );

  const openCancelModal = useCallback((order: VenueOrderNode) => {
    const useRefund = order.status !== 'PENDING';
    setCancelModal({ order, useRefund });
  }, []);

  const closeCancelModal = useCallback(() => {
    setCancelModal(null);
  }, []);

  const openOrderDetail = useCallback((orderId: string) => {
    setDetailOrderId(orderId);
  }, []);

  const closeOrderDetail = useCallback(() => {
    setDetailOrderId(null);
  }, []);

  const handleCancelSubmit = useCallback(
    async (payload: {
      reason: string;
      refundPercent?: number;
      refundNote?: string;
    }) => {
      if (!cancelModal) return;
      const { order, useRefund } = cancelModal;

      if (useRefund) {
        await mutations.cancelOrderWithRefund(
          order._id,
          payload.reason,
          payload.refundPercent,
          payload.refundNote,
        );
      } else {
        await mutations.cancelOrder(order._id, payload.reason);
      }

      closeCancelModal();
      refetchAll();
    },
    [cancelModal, closeCancelModal, mutations, refetchAll],
  );

  return {
    ...mutations,
    cancelModal,
    openCancelModal,
    closeCancelModal,
    detailOrderId,
    openOrderDetail,
    closeOrderDetail,
    handleCancelSubmit,
    handleViewTabChange,
    handleStatusFilterChange,
    handleLoadMore,
    handleConfirm,
    handleMarkPreparing,
    handleMarkReady,
    handleComplete,
  };
}

export type OwnerOrdersPageActions = ReturnType<
  typeof useOwnerOrdersPageActions
>;
