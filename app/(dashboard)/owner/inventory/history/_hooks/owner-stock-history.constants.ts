/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { StockMovementType } from '@/graphql/generated';
import { STOCK_MOVEMENT_TYPE_FILTERS } from '@/lib/inventory/stock-movement-display';

export const STOCK_HISTORY_TYPE_CHIPS = STOCK_MOVEMENT_TYPE_FILTERS.map(
  (filter) => ({
    label: filter.label,
    value: filter.id,
  }),
);

export const STOCK_HISTORY_TABLE_SORT_FIELDS = [
  'quantity',
  'unitCost',
  'newStock',
] as const;

export function isStockMovementType(value: string): value is StockMovementType {
  return Object.values(StockMovementType).includes(value as StockMovementType);
}
