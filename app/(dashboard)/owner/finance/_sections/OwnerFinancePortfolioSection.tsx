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

import { useMemo, useState } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { StatCard } from '@/components/molecules/StatCard';
import { DataTable } from '@/components/organisms/DataTable';
import { Button } from '@/components/atoms/Button';
import type { VenueFinancePortfolioRow } from '@/hooks/owner';
import {
  FINANCE_TABLE_ROW_CLASS,
  FINANCE_TABLE_SCROLL_CLASS,
} from '@/lib/finance/finance-table';
import { formatCurrency } from '@/lib/utils';
import { toStatCardTrend } from '@/lib/finance/stat-card-trend';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinancePortfolioSectionProps {
  data: OwnerFinancePageData;
}

type PortfolioSortKey =
  | 'venueName'
  | 'grossRevenue'
  | 'netProfit'
  | 'netMarginPercent'
  | 'completedOrders';

function getPortfolioSortValue(
  row: VenueFinancePortfolioRow,
  key: PortfolioSortKey
): string | number {
  switch (key) {
    case 'venueName':
      return row.venueName;
    case 'grossRevenue':
      return row.grossRevenue.value;
    case 'netProfit':
      return row.netProfit.value;
    case 'netMarginPercent':
      return row.netMarginPercent.value;
    case 'completedOrders':
      return row.completedOrders;
  }
}

function aggregatePortfolioMetric(
  venues: VenueFinancePortfolioRow[],
  pick: (row: VenueFinancePortfolioRow) => {
    value: number;
    previousValue: number;
  }
) {
  const value = venues.reduce((sum, row) => sum + pick(row).value, 0);
  const previousValue = venues.reduce(
    (sum, row) => sum + pick(row).previousValue,
    0
  );
  const changePercent =
    previousValue > 0
      ? Math.round(((value - previousValue) / previousValue) * 1000) / 10
      : 0;

  return { value, previousValue, changePercent };
}

export function OwnerFinancePortfolioSection({
  data,
}: OwnerFinancePortfolioSectionProps) {
  const [sortKey, setSortKey] = useState<PortfolioSortKey>('grossRevenue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const rows = useMemo(() => {
    const venues = [...(data.portfolio?.venues ?? [])];
    venues.sort((left, right) => {
      const leftValue = getPortfolioSortValue(left, sortKey);
      const rightValue = getPortfolioSortValue(right, sortKey);
      if (typeof leftValue === 'string' && typeof rightValue === 'string') {
        return sortDir === 'asc'
          ? leftValue.localeCompare(rightValue, 'vi')
          : rightValue.localeCompare(leftValue, 'vi');
      }
      const delta = Number(leftValue) - Number(rightValue);
      return sortDir === 'asc' ? delta : -delta;
    });
    return venues;
  }, [data.portfolio?.venues, sortDir, sortKey]);

  const summary = useMemo(() => {
    const venues = data.portfolio?.venues ?? [];
    if (venues.length === 0) return null;

    const grossRevenue = aggregatePortfolioMetric(
      venues,
      (row) => row.grossRevenue
    );
    const netProfit = aggregatePortfolioMetric(venues, (row) => row.netProfit);
    const netRevenue = aggregatePortfolioMetric(
      venues,
      (row) => row.netRevenue
    );
    const netMarginPercent = {
      value:
        netRevenue.value > 0
          ? Math.round((netProfit.value / netRevenue.value) * 1000) / 10
          : 0,
      previousValue:
        netRevenue.previousValue > 0
          ? Math.round(
              (netProfit.previousValue / netRevenue.previousValue) * 1000
            ) / 10
          : 0,
      changePercent: 0,
    };
    netMarginPercent.changePercent =
      netMarginPercent.previousValue > 0
        ? Math.round(
            ((netMarginPercent.value - netMarginPercent.previousValue) /
              netMarginPercent.previousValue) *
              1000
          ) / 10
        : 0;

    return { grossRevenue, netProfit, netMarginPercent };
  }, [data.portfolio?.venues]);

  const handleSort = (field: string) => {
    const key = field as PortfolioSortKey;
    if (sortKey === key) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('desc');
  };

  const handleDrillDown = (row: VenueFinancePortfolioRow) => {
    data.setAllVenues(false);
    data.setSelectedVenueId(row.venueId);
    data.setPageTab('finance');
  };

  return (
    <div className="space-y-6">
      <QueryState
        loading={data.portfolioLoading && !data.portfolio}
        error={data.portfolioError}
        empty={data.venues.length === 0}
        emptyMessage="Chưa có sân để xem danh mục."
        onRetry={() => void data.refetchPortfolio()}
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="bar-chart-outline"
            iconColor="text-violet-400"
            label="Doanh thu gộp"
            value={formatCurrency(summary?.grossRevenue.value ?? 0)}
            trend={toStatCardTrend(summary?.grossRevenue.changePercent)}
          />
          <StatCard
            icon="trending-up-outline"
            iconColor="text-emerald-400"
            label="Lãi ròng"
            value={formatCurrency(summary?.netProfit.value ?? 0)}
            trend={toStatCardTrend(summary?.netProfit.changePercent)}
          />
          <StatCard
            icon="pie-chart-outline"
            iconColor="text-sky-400"
            label="Biên LN ròng"
            value={`${summary?.netMarginPercent.value.toFixed(1) ?? 0}%`}
            trend={toStatCardTrend(summary?.netMarginPercent.changePercent)}
          />
          <StatCard
            icon="business-outline"
            iconColor="text-amber-400"
            label="Số cơ sở"
            value={String(data.portfolio?.totalVenues ?? rows.length)}
          />
        </div>

        <GlassPanel card className="space-y-4">
          <div>
            <h3 className="text-heading text-base font-bold">Danh mục cơ sở</h3>
            <p className="text-muted mt-1 text-sm">
              So sánh P&amp;L theo từng cơ sở trong kỳ.
            </p>
          </div>

          <DataTable<VenueFinancePortfolioRow>
            stickyHeader
            className={FINANCE_TABLE_SCROLL_CLASS}
            emptyTitle="Không có dữ liệu danh mục"
            columns={[
              { key: 'venueName', label: 'Cơ sở', sortable: true },
              {
                key: 'grossRevenue',
                label: 'Doanh thu gộp',
                align: 'right',
                sortable: true,
              },
              {
                key: 'netProfit',
                label: 'Lãi ròng',
                align: 'right',
                sortable: true,
              },
              {
                key: 'netMarginPercent',
                label: 'Biên LN',
                align: 'right',
                sortable: true,
              },
              {
                key: 'completedOrders',
                label: 'Đơn HT',
                align: 'right',
                sortable: true,
              },
              { key: 'actions', label: '', align: 'right' },
            ]}
            data={rows}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
            renderRow={(row) => (
              <tr key={row.venueId} className={FINANCE_TABLE_ROW_CLASS}>
                <td className="text-body px-4 py-3 text-sm font-medium">
                  {row.venueName}
                </td>
                <td className="text-body px-4 py-3 text-right text-sm">
                  {formatCurrency(row.grossRevenue.value)}
                </td>
                <td
                  className={
                    row.netProfit.value >= 0
                      ? 'px-4 py-3 text-right text-sm font-medium text-emerald-400'
                      : 'px-4 py-3 text-right text-sm font-medium text-red-400'
                  }
                >
                  {formatCurrency(row.netProfit.value)}
                </td>
                <td className="text-body px-4 py-3 text-right text-sm">
                  {row.netMarginPercent.value.toFixed(1)}%
                </td>
                <td className="text-body px-4 py-3 text-right text-sm">
                  {row.completedOrders}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDrillDown(row)}
                  >
                    Chi tiết
                  </Button>
                </td>
              </tr>
            )}
          />
        </GlassPanel>
      </QueryState>
    </div>
  );
}
