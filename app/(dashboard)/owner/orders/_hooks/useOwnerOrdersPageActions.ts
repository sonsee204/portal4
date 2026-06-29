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
import type { OrderViewTab } from './owner-orders-page.constants';
import type { OwnerOrdersPageData } from './useOwnerOrdersPageData';

export interface CancelModalState {
  order: VenueOrderNode;
  useRefund: boolean;
}

export interface CompleteModalState {
  orderId: string;
}

export type OrderQuickAction =
  | 'confirm'
  | 'markPreparing'
  | 'markReady'
  | 'markDelivered';

export interface OrderQuickActionDialogState {
  action: OrderQuickAction;
  orderId: string;
}

const ORDER_QUICK_ACTION_COPY: Record<
  OrderQuickAction,
  {
    title: string;
    description: string;
    confirmLabel: string;
    variant: 'danger' | 'warning' | 'default';
  }
> = {
  confirm: {
    title: 'Xác nhận đơn',
    description: 'Xác nhận đơn hàng này?',
    confirmLabel: 'Xác nhận',
    variant: 'default',
  },
  markPreparing: {
    title: 'Chuẩn bị đơn',
    description: 'Chuyển đơn sang trạng thái đang chuẩn bị?',
    confirmLabel: 'Chuẩn bị',
    variant: 'default',
  },
  markReady: {
    title: 'Đơn sẵn sàng',
    description: 'Đánh dấu đơn đã sẵn sàng giao cho khách?',
    confirmLabel: 'Sẵn sàng',
    variant: 'default',
  },
  markDelivered: {
    title: 'Đã giao khách',
    description: 'Xác nhận đơn đã giao cho khách?',
    confirmLabel: 'Đã giao',
    variant: 'default',
  },
};

export function useOwnerOrdersPageActions(data: OwnerOrdersPageData) {
  const {
    setViewTab,
    setStatusFilter,
    setPaymentStatusFilter,
    loadMore,
    refetchAll,
  } = data;

  const mutations = useOwnerOrderMutations();
  const [cancelModal, setCancelModal] = useState<CancelModalState | null>(null);
  const [completeModal, setCompleteModal] = useState<CompleteModalState | null>(
    null,
  );
  const [detailOrderId, setDetailOrderId] = useState<string | null>(null);
  const [quickActionDialog, setQuickActionDialog] =
    useState<OrderQuickActionDialogState | null>(null);

  const handleViewTabChange = useCallback(
    (value: string) => {
      setViewTab(value as OrderViewTab);
    },
    [setViewTab],
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
    },
    [setStatusFilter],
  );

  const handlePaymentStatusFilterChange = useCallback(
    (value: string) => {
      setPaymentStatusFilter(value);
    },
    [setPaymentStatusFilter],
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

  const handleMarkDelivered = useCallback(
    async (orderId: string) => {
      await mutations.markDelivered(orderId);
      refetchAll();
    },
    [mutations, refetchAll],
  );

  const openQuickActionDialog = useCallback(
    (action: OrderQuickAction, orderId: string) => {
      setQuickActionDialog({ action, orderId });
    },
    [],
  );

  const closeQuickActionDialog = useCallback(() => {
    if (mutations.actionLoading) return;
    setQuickActionDialog(null);
  }, [mutations.actionLoading]);

  const handleQuickActionConfirm = useCallback(async () => {
    if (!quickActionDialog) return;

    const { action, orderId } = quickActionDialog;
    switch (action) {
      case 'confirm':
        await handleConfirm(orderId);
        break;
      case 'markPreparing':
        await handleMarkPreparing(orderId);
        break;
      case 'markReady':
        await handleMarkReady(orderId);
        break;
      case 'markDelivered':
        await handleMarkDelivered(orderId);
        break;
    }
    setQuickActionDialog(null);
  }, [
    handleConfirm,
    handleMarkDelivered,
    handleMarkPreparing,
    handleMarkReady,
    quickActionDialog,
  ]);

  const quickActionDialogCopy = quickActionDialog
    ? ORDER_QUICK_ACTION_COPY[quickActionDialog.action]
    : null;

  const openCompleteModal = useCallback((orderId: string) => {
    setCompleteModal({ orderId });
  }, []);

  const closeCompleteModal = useCallback(() => {
    setCompleteModal(null);
  }, []);

  const handleCompleteSubmit = useCallback(async () => {
    if (!completeModal) return;
    await mutations.completeOrder(completeModal.orderId);
    closeCompleteModal();
    refetchAll();
  }, [completeModal, closeCompleteModal, mutations, refetchAll]);

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
    completeModal,
    openCancelModal,
    closeCancelModal,
    openCompleteModal,
    closeCompleteModal,
    detailOrderId,
    openOrderDetail,
    closeOrderDetail,
    handleCancelSubmit,
    handleCompleteSubmit,
    handleViewTabChange,
    handleStatusFilterChange,
    handlePaymentStatusFilterChange,
    handleLoadMore,
    handleConfirm,
    handleMarkPreparing,
    handleMarkReady,
    handleMarkDelivered,
    quickActionDialog,
    quickActionDialogCopy,
    openQuickActionDialog,
    closeQuickActionDialog,
    handleQuickActionConfirm,
  };
}

export type OwnerOrdersPageActions = ReturnType<
  typeof useOwnerOrdersPageActions
>;
