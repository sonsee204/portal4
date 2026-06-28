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
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { DataTable } from '@/components/organisms/DataTable';
import type { VenueFinancePortfolioRow } from '@/hooks/owner';
import {
  FINANCE_TABLE_ROW_CLASS,
  FINANCE_TABLE_SCROLL_CLASS,
} from '@/lib/finance/finance-table';
import { cn, formatCurrency } from '@/lib/utils';
import { buildAmountSummariesFromRows } from '@/lib/data-table/amount-summary';
import { getSignedValueClassName } from '@/lib/finance/stat-card-trend';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';
import type { OwnerFinancePageActions } from '../../_hooks/useOwnerFinancePageActions';

interface OwnerFinanceOverviewPortfolioTableProps {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
}

type PortfolioSortKey =
  | 'venueName'
  | 'grossRevenue'
  | 'netProfit'
  | 'netMarginPercent'
  | 'completedOrders';

const PORTFOLIO_SORT_FIELDS = [
  'venueName',
  'grossRevenue',
  'netProfit',
  'netMarginPercent',
  'completedOrders',
] as const;

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

export function OwnerFinanceOverviewPortfolioTable({
  data,
  actions,
}: OwnerFinanceOverviewPortfolioTableProps) {
  const sort = useDataTableSortUrl({
    allowedFields: PORTFOLIO_SORT_FIELDS,
    defaultField: 'grossRevenue',
    defaultDir: 'desc',
    syncUrl: data.pageTab === 'portfolio',
  });

  const rows = useMemo(() => {
    const venues = [...(data.portfolio?.venues ?? [])];
    venues.sort((left, right) => {
      const leftValue = getPortfolioSortValue(
        left,
        sort.sortField as PortfolioSortKey
      );
      const rightValue = getPortfolioSortValue(
        right,
        sort.sortField as PortfolioSortKey
      );
      if (typeof leftValue === 'string' && typeof rightValue === 'string') {
        return sort.sortDir === 'asc'
          ? leftValue.localeCompare(rightValue, 'vi')
          : rightValue.localeCompare(leftValue, 'vi');
      }
      const delta = Number(leftValue) - Number(rightValue);
      return sort.sortDir === 'asc' ? delta : -delta;
    });
    return venues;
  }, [data.portfolio?.venues, sort.sortDir, sort.sortField]);

  const amountSummaries = useMemo(
    () =>
      buildAmountSummariesFromRows(rows, [
        {
          columnKey: 'grossRevenue',
          getValue: (row) => row.grossRevenue.value,
          tone: 'signed',
        },
        {
          columnKey: 'netProfit',
          getValue: (row) => row.netProfit.value,
          tone: 'signed',
        },
      ]),
    [rows]
  );

  return (
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
        totalCount={data.portfolio?.totalVenues ?? rows.length}
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
        sortKey={sort.sortField}
        sortDir={sort.sortDir}
        onSort={sort.handleSort}
        amountSummaries={amountSummaries}
        renderRow={(row) => (
          <tr key={row.venueId} className={FINANCE_TABLE_ROW_CLASS}>
            <td className="text-body px-4 py-3 text-sm font-medium">
              {row.venueName}
            </td>
            <td
              className={cn(
                'px-4 py-3 text-right text-sm font-medium',
                getSignedValueClassName(row.grossRevenue.value)
              )}
            >
              {formatCurrency(row.grossRevenue.value)}
            </td>
            <td
              className={cn(
                'px-4 py-3 text-right text-sm font-medium',
                getSignedValueClassName(row.netProfit.value)
              )}
            >
              {formatCurrency(row.netProfit.value)}
            </td>
            <td
              className={cn(
                'px-4 py-3 text-right text-sm font-medium',
                getSignedValueClassName(row.netMarginPercent.value)
              )}
            >
              {row.netMarginPercent.value.toFixed(1)}%
            </td>
            <td className="text-body px-4 py-3 text-right text-sm">
              {row.completedOrders}
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => actions.handlePortfolioDrillDown(row)}
                >
                  Tổng quan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => actions.handlePortfolioFinanceDetail(row)}
                >
                  Tài chính
                </Button>
              </div>
            </td>
          </tr>
        )}
      />
    </GlassPanel>
  );
}
