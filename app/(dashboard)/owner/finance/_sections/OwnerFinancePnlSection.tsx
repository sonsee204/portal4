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
import { formatCurrency } from '@/lib/utils';
import { toStatCardTrend } from '@/lib/finance/stat-card-trend';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinancePnlSectionProps {
  data: OwnerFinancePageData;
}

const PNL_ROWS = [
  { key: 'netRevenue', label: 'Doanh thu thuần' },
  { key: 'cogs', label: 'Giá vốn (COGS)' },
  { key: 'grossProfit', label: 'Lợi nhuận gộp' },
  { key: 'operatingExpenses', label: 'Chi phí vận hành' },
  { key: 'netProfit', label: 'Lãi / lỗ ròng' },
] as const;

export function OwnerFinancePnlSection({ data }: OwnerFinancePnlSectionProps) {
  const pnl = data.report?.pnl;

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
              Báo cáo P&L
            </h3>
            {data.report?.period ? (
              <p className="text-muted mt-1 text-sm">
                {data.report.period.from} → {data.report.period.to}
                {' · '}
                So với {data.report.period.previousFrom} →{' '}
                {data.report.period.previousTo}
              </p>
            ) : null}
          </div>
          {pnl ? (
            <div className="text-right">
              <p className="text-muted text-xs">Biên lợi nhuận ròng</p>
              <p className="text-heading text-2xl font-bold">
                {pnl.netMarginPercent.value.toFixed(1)}%
              </p>
            </div>
          ) : null}
        </div>

        <div className="divide-surface-border divide-y">
          {PNL_ROWS.map((row) => {
            const metric = pnl?.[row.key];
            const trend = toStatCardTrend(metric?.changePercent);
            const isProfitRow = row.key === 'netProfit';
            const value = metric?.value ?? 0;

            return (
              <div
                key={row.key}
                className="flex items-center justify-between gap-4 py-3"
              >
                <span className="text-body text-sm font-medium">
                  {row.label}
                </span>
                <div className="flex items-center gap-3">
                  {trend ? (
                    <span
                      className={
                        trend.direction === 'up'
                          ? 'text-emerald-400 text-xs font-semibold'
                          : trend.direction === 'down'
                            ? 'text-red-400 text-xs font-semibold'
                            : 'text-muted text-xs font-semibold'
                      }
                    >
                      {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '•'}{' '}
                      {trend.value}
                    </span>
                  ) : null}
                  <span
                    className={
                      isProfitRow
                        ? value >= 0
                          ? 'text-emerald-400 text-lg font-bold'
                          : 'text-red-400 text-lg font-bold'
                        : 'text-heading text-lg font-bold'
                    }
                  >
                    {formatCurrency(value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </QueryState>
    </GlassPanel>
  );
}
