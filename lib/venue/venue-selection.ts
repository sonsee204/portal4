/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

/** Sentinel value for finance stats venue switcher — aggregate all venues. */
export const ALL_VENUES_SELECTION_ID = '__all_venues__';

export const ALL_VENUES_SELECTION_LABEL = 'Tất cả sân';

const STATS_ALL_VENUES_PATHS = [
  '/owner/stats/overview',
  '/owner/stats/finance',
] as const;

/** Stats pages where the header switcher can aggregate all venues. */
export function isStatsAllVenuesPath(pathname: string): boolean {
  return (STATS_ALL_VENUES_PATHS as readonly string[]).includes(pathname);
}

/** @deprecated Use isStatsAllVenuesPath — finance tab only. */
export function isFinanceStatsFinancePath(pathname: string): boolean {
  return pathname === '/owner/stats/finance';
}
