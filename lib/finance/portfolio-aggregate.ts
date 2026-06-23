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

import type { VenueFinancePortfolioRow } from '@/hooks/owner';

export type PortfolioMetric = {
  value: number;
  previousValue: number;
  changePercent: number;
};

export function aggregatePortfolioMetric<T>(
  venues: T[],
  pick: (row: T) => { value: number; previousValue: number },
): PortfolioMetric {
  const value = venues.reduce((sum, row) => sum + pick(row).value, 0);
  const previousValue = venues.reduce(
    (sum, row) => sum + pick(row).previousValue,
    0,
  );
  const changePercent =
    previousValue !== 0
      ? Math.round(((value - previousValue) / Math.abs(previousValue)) * 1000) /
        10
      : value !== 0
        ? value > 0
          ? 100
          : -100
        : 0;

  return { value, previousValue, changePercent };
}

export function computeNetMarginPercent(
  netProfit: PortfolioMetric,
  netRevenue: PortfolioMetric,
): PortfolioMetric {
  const value =
    netRevenue.value > 0
      ? Math.round((netProfit.value / netRevenue.value) * 1000) / 10
      : 0;
  const previousValue =
    netRevenue.previousValue > 0
      ? Math.round((netProfit.previousValue / netRevenue.previousValue) * 1000) /
        10
      : 0;
  const changePercent =
    previousValue !== 0
      ? Math.round(((value - previousValue) / Math.abs(previousValue)) * 1000) /
        10
      : value !== 0
        ? value > 0
          ? 100
          : -100
        : 0;

  return { value, previousValue, changePercent };
}

export type PortfolioSummary = {
  grossRevenue: PortfolioMetric;
  netProfit: PortfolioMetric;
  netMarginPercent: PortfolioMetric;
  grossProfit: PortfolioMetric;
  completedOrders: PortfolioMetric;
};

export function buildPortfolioSummary(
  venues: VenueFinancePortfolioRow[],
): PortfolioSummary | null {
  if (venues.length === 0) return null;

  const grossRevenue = aggregatePortfolioMetric(
    venues,
    (row) => row.grossRevenue,
  );
  const netProfit = aggregatePortfolioMetric(venues, (row) => row.netProfit);
  const netRevenue = aggregatePortfolioMetric(venues, (row) => row.netRevenue);
  const grossProfit = aggregatePortfolioMetric(venues, (row) => row.grossProfit);
  const completedOrders = aggregatePortfolioMetric(venues, (row) => ({
    value: row.completedOrders,
    previousValue: 0,
  }));

  return {
    grossRevenue,
    netProfit,
    netMarginPercent: computeNetMarginPercent(netProfit, netRevenue),
    grossProfit,
    completedOrders,
  };
}
