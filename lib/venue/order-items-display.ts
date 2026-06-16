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

import { ORDER_ITEM_TYPE_SORT } from '@/lib/constants/order-item-type';

type OrderItemLike = {
  itemType?: string | null;
  quantity?: number | null;
};

export type OrderItemTypeSummary = {
  itemType: string;
  quantity: number;
};

export function groupOrderItemsByType(
  items: OrderItemLike[] | null | undefined,
): OrderItemTypeSummary[] {
  const counts = new Map<string, number>();

  for (const item of items ?? []) {
    const itemType = item.itemType ?? 'PRODUCT';
    counts.set(itemType, (counts.get(itemType) ?? 0) + (item.quantity ?? 1));
  }

  return Array.from(counts.entries())
    .sort(([left], [right]) => {
      const leftIndex = ORDER_ITEM_TYPE_SORT.indexOf(
        left as (typeof ORDER_ITEM_TYPE_SORT)[number],
      );
      const rightIndex = ORDER_ITEM_TYPE_SORT.indexOf(
        right as (typeof ORDER_ITEM_TYPE_SORT)[number],
      );
      return (
        (leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex) -
        (rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex)
      );
    })
    .map(([itemType, quantity]) => ({ itemType, quantity }));
}
