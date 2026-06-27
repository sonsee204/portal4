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

import type { ReactNode } from 'react';

export type AmountSummaryTone = 'default' | 'positive' | 'signed';

export type DataTableAmountSummaryScope = 'loaded' | 'full';

export interface DataTableAmountSummary {
  columnKey: string;
  label?: string;
  total: number;
  format?: (value: number) => ReactNode;
  className?: string;
  tone?: AmountSummaryTone;
  /** `full` = period/server total; `loaded` = sum of visible rows (default) */
  scope?: DataTableAmountSummaryScope;
}

export interface BuildAmountSummariesSpec<T> {
  columnKey: string;
  label?: string;
  getValue: (row: T) => number | null | undefined;
  tone?: AmountSummaryTone;
}

export function sumDataTableAmounts<T>(
  rows: readonly T[],
  getValue: (row: T) => number | null | undefined,
): number {
  return rows.reduce((total, row) => {
    const value = getValue(row);
    return total + (typeof value === 'number' && Number.isFinite(value) ? value : 0);
  }, 0);
}

export function buildAmountSummariesFromRows<T>(
  rows: readonly T[],
  specs: readonly BuildAmountSummariesSpec<T>[],
  options?: { scope?: DataTableAmountSummary['scope'] },
): DataTableAmountSummary[] {
  const scope = options?.scope ?? 'loaded';

  return specs.map((spec) => ({
    columnKey: spec.columnKey,
    label: spec.label,
    total: sumDataTableAmounts(rows, spec.getValue),
    tone: spec.tone,
    scope,
  }));
}
