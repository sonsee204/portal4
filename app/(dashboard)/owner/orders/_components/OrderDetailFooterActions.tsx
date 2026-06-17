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

import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { OrderDetailNode } from '@/hooks/owner/useOrderDetail';
import { FNB_ORDER_TYPES } from '../_hooks/owner-orders-page.constants';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';

interface OrderDetailFooterActionsProps {
  order: OrderDetailNode;
  actions: Pick<
    OwnerOrdersPageActions,
    | 'actionLoading'
    | 'handleConfirm'
    | 'handleMarkPreparing'
    | 'handleMarkReady'
    | 'handleComplete'
    | 'openCancelModal'
  >;
}

export function OrderDetailFooterActions({
  order,
  actions,
}: OrderDetailFooterActionsProps) {
  const {
    actionLoading,
    handleConfirm,
    handleMarkPreparing,
    handleMarkReady,
    handleComplete,
    openCancelModal,
  } = actions;

  const status = order.status;
  const isFnB = FNB_ORDER_TYPES.has(order.orderType);
  const isTerminal = status === 'COMPLETED' || status === 'CANCELLED';

  if (isTerminal) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {status === 'PENDING' && (
        <VenueActionGate action={VenueAction.CreateOrder}>
          <Button
            size="sm"
            iconLeft="checkmark-outline"
            disabled={actionLoading}
            onClick={() => void handleConfirm(order._id)}
          >
            Xác nhận
          </Button>
        </VenueActionGate>
      )}

      {status === 'CONFIRMED' && (
        <VenueActionGate action={VenueAction.CreateOrder}>
          {isFnB ? (
            <Button
              size="sm"
              iconLeft="restaurant-outline"
              disabled={actionLoading}
              onClick={() => void handleMarkPreparing(order._id)}
            >
              Chuẩn bị
            </Button>
          ) : (
            <Button
              size="sm"
              iconLeft="flag-outline"
              disabled={actionLoading}
              onClick={() => void handleComplete(order._id)}
            >
              Hoàn thành
            </Button>
          )}
        </VenueActionGate>
      )}

      {(status === 'PREPARING' || status === 'IN_PROGRESS') && (
        <VenueActionGate action={VenueAction.CreateOrder}>
          <Button
            size="sm"
            iconLeft="checkmark-done-outline"
            disabled={actionLoading}
            onClick={() => void handleMarkReady(order._id)}
          >
            Sẵn sàng
          </Button>
        </VenueActionGate>
      )}

      {status === 'READY' && (
        <VenueActionGate action={VenueAction.CreateOrder}>
          <Button
            size="sm"
            iconLeft="flag-outline"
            disabled={actionLoading}
            onClick={() => void handleComplete(order._id)}
          >
            Hoàn thành
          </Button>
        </VenueActionGate>
      )}

      <VenueActionGate action={VenueAction.CancelOrder}>
        <Button
          variant="danger"
          size="sm"
          iconLeft="trash-outline"
          disabled={actionLoading}
          onClick={() => openCancelModal(order)}
        >
          Hủy
        </Button>
      </VenueActionGate>
    </div>
  );
}
