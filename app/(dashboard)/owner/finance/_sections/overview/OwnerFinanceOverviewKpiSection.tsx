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

import { useMemo } from 'react';
import { StatCard } from '@/components/molecules/StatCard';
import { buildPortfolioSummary } from '@/lib/finance/portfolio-aggregate';
import { toStatCardTrendFromMetric } from '@/lib/finance/stat-card-trend';
import { formatCurrency } from '@/lib/utils';
import type { OverviewMode } from '../../_hooks/useOwnerFinanceOverviewLayout';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewKpiSectionProps {
  data: OwnerFinancePageData;
  mode: OverviewMode;
}

export function OwnerFinanceOverviewKpiSection({
  data,
  mode,
}: OwnerFinanceOverviewKpiSectionProps) {
  const summary = useMemo(
    () => buildPortfolioSummary(data.portfolio?.venues ?? []),
    [data.portfolio?.venues]
  );

  const collected = data.report?.pnl.collected;

  if (mode === 'allVenues') {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon="bar-chart-outline"
          iconColor="text-violet-400"
          label="Doanh thu gộp"
          value={formatCurrency(summary?.grossRevenue.value ?? 0)}
          signedValue={summary?.grossRevenue.value ?? 0}
          trend={toStatCardTrendFromMetric(summary?.grossRevenue, {
            metricKind: 'revenue',
          })}
        />
        <StatCard
          icon="trending-up-outline"
          iconColor="text-emerald-400"
          label="Lãi ròng"
          value={formatCurrency(summary?.netProfit.value ?? 0)}
          signedValue={summary?.netProfit.value ?? 0}
          trend={toStatCardTrendFromMetric(summary?.netProfit, {
            metricKind: 'pnl',
          })}
        />
        <StatCard
          icon="pie-chart-outline"
          iconColor="text-sky-400"
          label="Biên LN ròng"
          value={`${summary?.netMarginPercent.value.toFixed(1) ?? 0}%`}
          signedValue={summary?.netMarginPercent.value ?? 0}
          trend={toStatCardTrendFromMetric(summary?.netMarginPercent, {
            metricKind: 'rate',
          })}
        />
        <StatCard
          icon="business-outline"
          iconColor="text-amber-400"
          label="Số cơ sở"
          value={String(data.portfolio?.totalVenues ?? 0)}
        />
        <StatCard
          icon="checkmark-done-outline"
          iconColor="text-indigo-400"
          label="Tổng đơn HT"
          value={String(summary?.completedOrders.value ?? 0)}
        />
        <StatCard
          icon="wallet-outline"
          iconColor="text-teal-400"
          label="Lợi nhuận gộp"
          value={formatCurrency(summary?.grossProfit.value ?? 0)}
          signedValue={summary?.grossProfit.value ?? 0}
          trend={toStatCardTrendFromMetric(summary?.grossProfit, {
            metricKind: 'pnl',
          })}
        />
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        icon="bar-chart-outline"
        iconColor="text-violet-400"
        label="Doanh thu gộp"
        value={formatCurrency(summary?.grossRevenue.value ?? 0)}
        signedValue={summary?.grossRevenue.value ?? 0}
        trend={toStatCardTrendFromMetric(summary?.grossRevenue, {
          metricKind: 'revenue',
        })}
      />
      <StatCard
        icon="trending-up-outline"
        iconColor="text-emerald-400"
        label="Lãi ròng"
        value={formatCurrency(summary?.netProfit.value ?? 0)}
        signedValue={summary?.netProfit.value ?? 0}
        trend={toStatCardTrendFromMetric(summary?.netProfit, {
          metricKind: 'pnl',
        })}
      />
      <StatCard
        icon="pie-chart-outline"
        iconColor="text-sky-400"
        label="Biên LN ròng"
        value={`${summary?.netMarginPercent.value.toFixed(1) ?? 0}%`}
        signedValue={summary?.netMarginPercent.value ?? 0}
        trend={toStatCardTrendFromMetric(summary?.netMarginPercent, {
          metricKind: 'rate',
        })}
      />
      <StatCard
        icon="checkmark-done-outline"
        iconColor="text-indigo-400"
        label="Đơn hoàn thành"
        value={String(summary?.completedOrders.value ?? 0)}
      />
      <StatCard
        icon="wallet-outline"
        iconColor="text-teal-400"
        label="Lợi nhuận gộp"
        value={formatCurrency(summary?.grossProfit.value ?? 0)}
        signedValue={summary?.grossProfit.value ?? 0}
        trend={toStatCardTrendFromMetric(summary?.grossProfit, {
          metricKind: 'pnl',
        })}
      />
      <StatCard
        icon="cash-outline"
        iconColor="text-amber-400"
        label="Đã thu"
        value={formatCurrency(collected?.value ?? 0)}
        signedValue={collected?.value ?? 0}
        trend={toStatCardTrendFromMetric(collected, { metricKind: 'revenue' })}
      />
    </div>
  );
}
