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

import { IconButton } from '@/components/atoms/IconButton';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { VenueOrderNode } from '@/hooks/owner';
import { cn } from '@/lib/utils';
import { FNB_ORDER_TYPES } from '../_hooks/owner-orders-page.constants';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';
import { ViewOrderDetailButton } from './ViewOrderDetailButton';

interface OrderRowActionsProps {
  order: VenueOrderNode;
  actions: OwnerOrdersPageActions;
}

const toneClassName = {
  primary: 'text-primary hover:text-primary hover:bg-primary/10',
  danger: 'text-red-500 hover:text-red-600 hover:bg-red-500/10',
} as const;

export function OrderRowActions({ order, actions }: OrderRowActionsProps) {
  const {
    actionLoading,
    openOrderDetail,
    handleConfirm,
    handleMarkPreparing,
    handleMarkReady,
    handleComplete,
    openCancelModal,
  } = actions;

  const status = order.status;
  const isFnB = FNB_ORDER_TYPES.has(order.orderType);
  const isTerminal = status === 'COMPLETED' || status === 'CANCELLED';

  return (
    <div className="flex flex-wrap justify-end gap-0.5">
      <ViewOrderDetailButton
        orderId={order._id}
        onOpen={openOrderDetail}
        disabled={actionLoading}
      />

      {!isTerminal && (
        <>
          {status === 'PENDING' && (
            <VenueActionGate action={VenueAction.CreateOrder}>
              <IconButton
                icon="checkmark-outline"
                size="sm"
                tooltip="Xác nhận"
                aria-label="Xác nhận"
                disabled={actionLoading}
                className={toneClassName.primary}
                onClick={() => void handleConfirm(order._id)}
              />
            </VenueActionGate>
          )}

          {status === 'CONFIRMED' && (
            <VenueActionGate action={VenueAction.CreateOrder}>
              {isFnB ? (
                <IconButton
                  icon="restaurant-outline"
                  size="sm"
                  tooltip="Chuẩn bị"
                  aria-label="Chuẩn bị"
                  disabled={actionLoading}
                  className={toneClassName.primary}
                  onClick={() => void handleMarkPreparing(order._id)}
                />
              ) : (
                <IconButton
                  icon="flag-outline"
                  size="sm"
                  tooltip="Hoàn thành"
                  aria-label="Hoàn thành"
                  disabled={actionLoading}
                  className={toneClassName.primary}
                  onClick={() => void handleComplete(order._id)}
                />
              )}
            </VenueActionGate>
          )}

          {(status === 'PREPARING' || status === 'IN_PROGRESS') && (
            <VenueActionGate action={VenueAction.CreateOrder}>
              <IconButton
                icon="checkmark-done-outline"
                size="sm"
                tooltip="Sẵn sàng"
                aria-label="Sẵn sàng"
                disabled={actionLoading}
                className={toneClassName.primary}
                onClick={() => void handleMarkReady(order._id)}
              />
            </VenueActionGate>
          )}

          {status === 'READY' && (
            <VenueActionGate action={VenueAction.CreateOrder}>
              <IconButton
                icon="flag-outline"
                size="sm"
                tooltip="Hoàn thành"
                aria-label="Hoàn thành"
                disabled={actionLoading}
                className={toneClassName.primary}
                onClick={() => void handleComplete(order._id)}
              />
            </VenueActionGate>
          )}

          <VenueActionGate action={VenueAction.CancelOrder}>
            <IconButton
              icon="trash-outline"
              size="sm"
              tooltip="Hủy"
              aria-label="Hủy"
              disabled={actionLoading}
              className={cn(toneClassName.danger)}
              onClick={() => openCancelModal(order)}
            />
          </VenueActionGate>
        </>
      )}
    </div>
  );
}
