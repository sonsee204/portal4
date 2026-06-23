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

export interface CourtRevenueBreakdownItem {
  label: string;
  revenue: number;
}

/** Booking line items use `${courtName} (start - end)` as the breakdown label. */
export function extractCourtLabelFromBreakdownLabel(label: string): string {
  const slotSeparatorIndex = label.indexOf(' (');
  if (slotSeparatorIndex > 0) {
    return label.slice(0, slotSeparatorIndex).trim();
  }

  return label.trim();
}

export function aggregateRevenueByCourt(
  items: CourtRevenueBreakdownItem[],
): Array<{ label: string; value: number }> {
  const totals = new Map<string, number>();

  for (const item of items) {
    const courtLabel = extractCourtLabelFromBreakdownLabel(item.label);
    totals.set(courtLabel, (totals.get(courtLabel) ?? 0) + item.revenue);
  }

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}
