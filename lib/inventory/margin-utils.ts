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

export type MarginLevel = 'healthy' | 'warning' | 'danger' | 'unknown';

const DEFAULT_WARNING_MARGIN = 20;
const DEFAULT_DANGER_MARGIN = 10;

export interface MarginThresholds {
  warningMargin: number;
  dangerMargin: number;
}

export const DEFAULT_MARGIN_THRESHOLDS: MarginThresholds = {
  warningMargin: DEFAULT_WARNING_MARGIN,
  dangerMargin: DEFAULT_DANGER_MARGIN,
};

export function computeMargin(
  sellingPrice: number,
  cost: number | undefined | null,
): number | null {
  if (cost == null || cost <= 0 || sellingPrice <= 0) return null;
  return ((sellingPrice - cost) / sellingPrice) * 100;
}

export function getMarginLevel(
  margin: number | null,
  thresholds?: MarginThresholds | null,
): MarginLevel {
  if (margin == null) return 'unknown';
  const { warningMargin, dangerMargin } =
    thresholds ?? DEFAULT_MARGIN_THRESHOLDS;
  if (margin >= warningMargin) return 'healthy';
  if (margin >= dangerMargin) return 'warning';
  return 'danger';
}

export function suggestSellingPrice(
  cost: number | undefined | null,
  thresholds?: MarginThresholds | null,
): number | null {
  if (cost == null || cost <= 0) return null;
  const targetMargin =
    (thresholds ?? DEFAULT_MARGIN_THRESHOLDS).warningMargin / 100;
  if (targetMargin >= 1) return null;
  return Math.ceil(cost / (1 - targetMargin));
}

export function getMarginLevelLabel(level: MarginLevel): string {
  switch (level) {
    case 'healthy':
      return 'Tốt';
    case 'warning':
      return 'Cảnh báo';
    case 'danger':
      return 'Nguy hiểm';
    default:
      return 'N/A';
  }
}

export function estimateNewAverageCost(
  existingTotalValue: number,
  existingTotalQty: number,
  importQty: number,
  importUnitPrice: number,
): number {
  const newTotalValue = existingTotalValue + importUnitPrice * importQty;
  const newTotalQty = existingTotalQty + importQty;
  return newTotalQty > 0 ? newTotalValue / newTotalQty : importUnitPrice;
}
