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

import { cn, formatCurrency } from '@/lib/utils';
import { getSignedValueClassName } from '@/lib/finance/stat-card-trend';
import type { DataTableAmountSummary } from '@/lib/data-table/amount-summary';

interface SummaryColumnRef {
  key: string;
  label: string;
}

function getAmountSummaryClassName(summary: DataTableAmountSummary): string {
  if (summary.className) {
    return summary.className;
  }

  switch (summary.tone) {
    case 'positive':
      return 'text-emerald-400';
    case 'signed':
      return getSignedValueClassName(summary.total);
    default:
      return 'text-body';
  }
}

function formatSummaryValue(summary: DataTableAmountSummary): React.ReactNode {
  if (summary.format) {
    return summary.format(summary.total);
  }

  return formatCurrency(summary.total);
}

function getSummaryLabel(
  summary: DataTableAmountSummary,
  columns: SummaryColumnRef[]
): string {
  if (summary.label) {
    return summary.label;
  }

  return (
    columns.find((column) => column.key === summary.columnKey)?.label ?? ''
  );
}

interface DataTableAmountSummaryBarProps {
  columns: SummaryColumnRef[];
  summaries: DataTableAmountSummary[];
  partialNote?: string | null;
}

export function DataTableAmountSummaryBar({
  columns,
  summaries,
  partialNote,
}: DataTableAmountSummaryBarProps) {
  if (summaries.length === 0) {
    return null;
  }

  const singleSummary = summaries.length === 1 ? summaries[0] : null;

  return (
    <div className="border-surface-border from-primary-500/5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t bg-gradient-to-r to-transparent px-4 py-2.5">
      {singleSummary ? (
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-faint shrink-0 text-[11px] font-semibold tracking-wider uppercase">
            Tổng cộng
          </span>
          <span
            className={cn(
              'text-base font-bold tabular-nums',
              getAmountSummaryClassName(singleSummary)
            )}
          >
            {formatSummaryValue(singleSummary)}
          </span>
        </div>
      ) : (
        <>
          <span className="text-faint shrink-0 text-[11px] font-semibold tracking-wider uppercase">
            Tổng cộng
          </span>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1.5">
            {summaries.map((summary) => (
              <div
                key={summary.columnKey}
                className="flex items-baseline gap-1.5 whitespace-nowrap"
              >
                <span className="text-muted text-xs">
                  {getSummaryLabel(summary, columns)}
                </span>
                <span
                  className={cn(
                    'text-sm font-semibold tabular-nums',
                    getAmountSummaryClassName(summary)
                  )}
                >
                  {formatSummaryValue(summary)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {partialNote ? (
        <span className="text-faint ml-auto text-xs italic">{partialNote}</span>
      ) : null}
    </div>
  );
}
