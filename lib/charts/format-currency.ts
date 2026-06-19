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

function formatCompactUnit(value: number): string {
  if (value >= 100) return String(Math.round(value));
  return value.toFixed(1).replace(/\.0$/, '');
}

/**
 * Compact axis labels for charts: K / M / B (VND-friendly).
 * Tooltip should still use full `formatCurrency`.
 */
export function formatCompactCurrency(amount: number): string {
  if (!Number.isFinite(amount)) return '0';
  if (amount === 0) return '0';

  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);

  if (abs >= 1_000_000_000) {
    return `${sign}${formatCompactUnit(abs / 1_000_000_000)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${formatCompactUnit(abs / 1_000_000)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${formatCompactUnit(abs / 1_000)}K`;
  }

  return `${sign}${Math.round(abs)}đ`;
}
