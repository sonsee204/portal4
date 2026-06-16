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

import { Badge } from '@/components/atoms/Badge';
import type { VenueOrderNode } from '@/hooks/owner';
import {
  ORDER_ITEM_TYPE_LABEL,
  ORDER_ITEM_TYPE_VARIANT,
} from '@/lib/constants/order-item-type';
import { groupOrderItemsByType } from '@/lib/venue/order-items-display';

interface OrderItemsCellProps {
  order: VenueOrderNode;
}

export function OrderItemsCell({ order }: OrderItemsCellProps) {
  const groups = groupOrderItemsByType(order.items);

  if (groups.length === 0) {
    return <span className="text-faint text-xs">—</span>;
  }

  return (
    <div className="flex max-w-[220px] flex-wrap gap-1">
      {groups.map(({ itemType, quantity }) => {
        const label = ORDER_ITEM_TYPE_LABEL[itemType] ?? itemType;
        const text = quantity > 1 ? `${label} ×${quantity}` : label;

        return (
          <Badge
            key={itemType}
            variant={ORDER_ITEM_TYPE_VARIANT[itemType] ?? 'neutral'}
          >
            {text}
          </Badge>
        );
      })}
    </div>
  );
}
