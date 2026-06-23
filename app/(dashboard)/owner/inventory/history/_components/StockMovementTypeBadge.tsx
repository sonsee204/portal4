/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Badge } from '@/components/atoms/Badge';
import type { StockMovementType } from '@/graphql/generated';
import {
  getStockMovementTypeLabel,
  stockMovementBadgeVariant,
} from '@/lib/inventory/stock-movement-display';

interface StockMovementTypeBadgeProps {
  type: StockMovementType;
}

export function StockMovementTypeBadge({ type }: StockMovementTypeBadgeProps) {
  return (
    <Badge variant={stockMovementBadgeVariant(type)}>
      {getStockMovementTypeLabel(type)}
    </Badge>
  );
}
