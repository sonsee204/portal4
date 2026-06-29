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

import {
  StockAdjustmentReason,
  StockMovementType,
} from '@/graphql/generated';
import type { BadgeVariant } from '@/config/theme';

export const STOCK_MOVEMENT_TYPE_LABEL: Record<StockMovementType, string> = {
  [StockMovementType.Import]: 'Nhập hàng',
  [StockMovementType.Sale]: 'Bán hàng',
  [StockMovementType.AdjustmentAdd]: 'Điều chỉnh tăng',
  [StockMovementType.AdjustmentSubtract]: 'Điều chỉnh giảm',
  [StockMovementType.Return]: 'Hoàn trả',
  [StockMovementType.TransferOut]: 'Lưu chuyển đi',
  [StockMovementType.TransferIn]: 'Lưu chuyển đến',
};

export const ADJUSTMENT_REASON_LABEL: Record<StockAdjustmentReason, string> = {
  [StockAdjustmentReason.InventoryCount]: 'Kiểm kê kho',
  [StockAdjustmentReason.Damaged]: 'Hư hỏng',
  [StockAdjustmentReason.Expired]: 'Hết hạn',
  [StockAdjustmentReason.Lost]: 'Thất lạc',
  [StockAdjustmentReason.Theft]: 'Mất cắp',
  [StockAdjustmentReason.Correction]: 'Sửa lỗi',
  [StockAdjustmentReason.Other]: 'Lý do khác',
};

export type StockMovementTypeFilterId = 'all' | StockMovementType;

export const STOCK_MOVEMENT_TYPE_FILTERS: Array<{
  id: StockMovementTypeFilterId;
  label: string;
  icon?: string;
}> = [
  { id: 'all', label: 'Tất cả', icon: 'apps-outline' },
  { id: StockMovementType.Import, label: 'Nhập hàng', icon: 'download-outline' },
  { id: StockMovementType.Sale, label: 'Bán hàng', icon: 'cart-outline' },
  {
    id: StockMovementType.AdjustmentAdd,
    label: 'Điều chỉnh +',
    icon: 'add-circle-outline',
  },
  {
    id: StockMovementType.AdjustmentSubtract,
    label: 'Điều chỉnh −',
    icon: 'remove-circle-outline',
  },
  {
    id: StockMovementType.Return,
    label: 'Hoàn trả',
    icon: 'return-down-back-outline',
  },
  {
    id: StockMovementType.TransferOut,
    label: 'Lưu chuyển đi',
    icon: 'arrow-forward-outline',
  },
  {
    id: StockMovementType.TransferIn,
    label: 'Lưu chuyển đến',
    icon: 'arrow-back-outline',
  },
];

const INCOMING_TYPES = new Set<StockMovementType>([
  StockMovementType.Import,
  StockMovementType.AdjustmentAdd,
  StockMovementType.Return,
  StockMovementType.TransferIn,
]);

export function getStockMovementTypeLabel(type: StockMovementType): string {
  return STOCK_MOVEMENT_TYPE_LABEL[type] ?? type;
}

export function isIncomingMovement(type: StockMovementType): boolean {
  return INCOMING_TYPES.has(type);
}

export function formatMovementQuantity(
  type: StockMovementType,
  quantity: number,
): string {
  const prefix = isIncomingMovement(type) ? '+' : '−';
  return `${prefix}${Math.abs(quantity)}`;
}

export function movementUnitCost(row: {
  importPrice?: number | null;
  costAtSale?: number | null;
}): number | null {
  if (row.importPrice != null) return row.importPrice;
  if (row.costAtSale != null) return row.costAtSale;
  return null;
}

export function stockMovementBadgeVariant(
  type: StockMovementType,
): BadgeVariant {
  switch (type) {
    case StockMovementType.Import:
      return 'success';
    case StockMovementType.Sale:
      return 'info';
    case StockMovementType.AdjustmentAdd:
      return 'warning';
    case StockMovementType.AdjustmentSubtract:
      return 'danger';
    case StockMovementType.Return:
      return 'neutral';
    case StockMovementType.TransferOut:
    case StockMovementType.TransferIn:
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function stockMovementToneClass(type: StockMovementType): string {
  switch (type) {
    case StockMovementType.Import:
      return 'text-emerald-400';
    case StockMovementType.Sale:
      return 'text-sky-400';
    case StockMovementType.AdjustmentAdd:
      return 'text-amber-400';
    case StockMovementType.AdjustmentSubtract:
      return 'text-red-400';
    case StockMovementType.Return:
      return 'text-violet-400';
    case StockMovementType.TransferOut:
      return 'text-orange-400';
    case StockMovementType.TransferIn:
      return 'text-cyan-400';
    default:
      return 'text-muted';
  }
}
