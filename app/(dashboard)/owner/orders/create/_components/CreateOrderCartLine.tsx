/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import type { CreateOrderCartItem } from '@/lib/order/create-order.schema';
import { formatCurrency } from '@/lib/utils';
import { CreateOrderQuantityControl } from './CreateOrderQuantityControl';
import type { CreateOrderPageActions } from '../_hooks/useCreateOrderPageActions';

interface CreateOrderCartLineProps {
  item: CreateOrderCartItem;
  actions: CreateOrderPageActions;
}

export function CreateOrderCartLine({ item, actions }: CreateOrderCartLineProps) {
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div className="border-surface-border flex items-start justify-between gap-3 border-b py-3 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p className="text-heading truncate text-sm font-medium">{item.name}</p>
        <p className="text-faint mt-0.5 text-xs">
          {formatCurrency(item.unitPrice)} × {item.quantity}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <span className="text-heading text-sm font-semibold">
          {formatCurrency(lineTotal)}
        </span>
        <CreateOrderQuantityControl
          quantity={item.quantity}
          onIncrease={() =>
            actions.handleSetQuantity(item.productId, item.quantity + 1)
          }
          onDecrease={() => actions.handleRemoveProduct(item.productId)}
        />
      </div>
    </div>
  );
}
