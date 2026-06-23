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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { cn, formatCurrency } from '@/lib/utils';
import {
  toStatCardTrendFromMetric,
  getSignedValueClassName,
} from '@/lib/finance/stat-card-trend';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinancePnlSectionProps {
  data: OwnerFinancePageData;
  variant?: 'full' | 'compact';
}

type PnlKey =
  | 'grossRevenue'
  | 'collected'
  | 'refunds'
  | 'netRevenue'
  | 'cogs'
  | 'grossProfit'
  | 'operatingExpenses'
  | 'netProfit';

interface PnlRow {
  key: PnlKey;
  label: string;
  hint?: string;
  emphasize?: boolean;
}

const CASHFLOW_ROWS: PnlRow[] = [
  {
    key: 'grossRevenue',
    label: 'Doanh thu gộp',
    hint: 'Tổng đơn đã hoàn thành trong kỳ',
  },
  {
    key: 'collected',
    label: 'Đã thu',
    hint: 'Tiền thực nhận trong kỳ (kể cả thu trước từ đơn chưa hoàn thành)',
  },
  {
    key: 'refunds',
    label: 'Hoàn tiền',
    hint: 'Tiền hoàn theo ngày hoàn tất',
  },
  {
    key: 'netRevenue',
    label: 'Doanh thu thuần',
    hint: 'Đã thu − Hoàn tiền',
    emphasize: true,
  },
];

const PROFIT_ROWS: PnlRow[] = [
  {
    key: 'cogs',
    label: 'Giá vốn (COGS)',
    hint: 'Xuất kho bán hàng',
  },
  {
    key: 'grossProfit',
    label: 'Lợi nhuận gộp',
    hint: 'Doanh thu thuần − giá vốn',
  },
  {
    key: 'operatingExpenses',
    label: 'Chi phí vận hành',
    hint: 'Chi phí ghi nhận thủ công',
  },
  {
    key: 'netProfit',
    label: 'Lãi / lỗ ròng',
    hint: 'Lợi nhuận gộp − Chi phí vận hành',
    emphasize: true,
  },
];

const COMPACT_ROWS: PnlRow[] = [
  {
    key: 'grossRevenue',
    label: 'Doanh thu gộp',
  },
  {
    key: 'cogs',
    label: 'Giá vốn (COGS)',
  },
  {
    key: 'grossProfit',
    label: 'Lợi nhuận gộp',
  },
  {
    key: 'operatingExpenses',
    label: 'Chi phí vận hành',
  },
  {
    key: 'netProfit',
    label: 'Lãi / lỗ ròng',
    emphasize: true,
  },
];

function PnlRowItem({
  row,
  metric,
}: {
  row: PnlRow;
  metric?: {
    value: number;
    previousValue?: number;
    changePercent?: number | null;
  } | null;
}) {
  const trend = toStatCardTrendFromMetric(metric);
  const value = metric?.value ?? 0;

  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <span
          className={
            row.emphasize
              ? 'text-heading text-sm font-bold'
              : 'text-body text-sm font-medium'
          }
        >
          {row.label}
        </span>
        {row.hint ? (
          <p className="text-faint mt-0.5 text-xs leading-snug">{row.hint}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {trend ? (
          <span
            className={
              trend.direction === 'up'
                ? 'text-xs font-semibold text-emerald-400'
                : trend.direction === 'down'
                  ? 'text-xs font-semibold text-red-400'
                  : 'text-muted text-xs font-semibold'
            }
          >
            {trend.direction === 'up'
              ? '↑'
              : trend.direction === 'down'
                ? '↓'
                : '•'}{' '}
            {trend.value}
          </span>
        ) : null}
        <span
          className={cn(
            row.emphasize ? 'text-lg font-bold' : 'text-base font-semibold',
            getSignedValueClassName(value)
          )}
        >
          {formatCurrency(value)}
        </span>
      </div>
    </div>
  );
}

export function OwnerFinancePnlSection({
  data,
  variant = 'full',
}: OwnerFinancePnlSectionProps) {
  const pnl = data.report?.pnl;
  const isCompact = variant === 'compact';

  return (
    <GlassPanel card>
      <QueryState
        loading={data.reportLoading && !data.report}
        error={data.reportError}
        empty={!data.allVenues && !data.selectedVenueId}
        emptyMessage="Chọn sân hoặc bật Tất cả sân để xem tài chính."
        onRetry={() => void data.refetchReport()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-heading text-base font-bold">
              {isCompact ? 'P&L tóm tắt' : 'Báo cáo P&L'}
            </h3>
            {!isCompact && data.report?.period ? (
              <p className="text-muted mt-1 text-sm">
                {data.report.period.from} → {data.report.period.to}
                {' · '}
                So với {data.report.period.previousFrom} →{' '}
                {data.report.period.previousTo}
              </p>
            ) : null}
          </div>
          {!isCompact && pnl ? (
            <div className="text-right">
              <p className="text-muted text-xs">Biên lợi nhuận ròng</p>
              <p
                className={cn(
                  'text-2xl font-bold',
                  getSignedValueClassName(pnl.netMarginPercent.value)
                )}
              >
                {pnl.netMarginPercent.value.toFixed(1)}%
              </p>
            </div>
          ) : null}
        </div>

        {isCompact ? (
          <div className="divide-surface-border divide-y">
            {COMPACT_ROWS.map((row) => (
              <PnlRowItem key={row.key} row={row} metric={pnl?.[row.key]} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-muted mb-1 text-xs font-semibold tracking-wide uppercase">
                Dòng tiền
              </p>
              <div className="divide-surface-border divide-y">
                {CASHFLOW_ROWS.map((row) => (
                  <PnlRowItem key={row.key} row={row} metric={pnl?.[row.key]} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-muted mb-1 text-xs font-semibold tracking-wide uppercase">
                Lợi nhuận
              </p>
              <div className="divide-surface-border divide-y">
                {PROFIT_ROWS.map((row) => (
                  <PnlRowItem key={row.key} row={row} metric={pnl?.[row.key]} />
                ))}
              </div>
            </div>
          </div>
        )}
      </QueryState>
    </GlassPanel>
  );
}
