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

import { TOURNAMENT } from '@/lib/strings';
import {
  CategoryStatus,
  TournamentFormat,
  type TournamentCategory,
} from '@/graphql/generated';

export function RandomAllocationBanner({ count }: { count: number }) {
  return (
    <div
      role="note"
      className="dark:bg-surface-elevated overflow-hidden rounded-xl border border-amber-500 bg-white shadow-sm"
    >
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0 bg-amber-500" aria-hidden="true" />
        <div className="flex flex-1 flex-wrap items-center gap-3 py-4 pr-4 pl-5 sm:gap-4 sm:pl-6">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white uppercase">
                {TOURNAMENT.LATE_ENTRY_RANDOM_WARNING_LABEL}
              </span>
              <p className="text-heading text-sm font-semibold">
                {TOURNAMENT.LATE_ENTRY_RANDOM_TITLE}
              </p>
            </div>
            <p className="text-secondary text-sm leading-relaxed">
              {TOURNAMENT.LATE_ENTRY_RANDOM_HINT(count)}
            </p>
          </div>
          <div className="bg-primary flex min-w-[3.25rem] shrink-0 flex-col items-center rounded-xl px-3 py-2 text-white shadow-sm">
            <span className="text-xl leading-none font-bold tabular-nums">
              {count}
            </span>
            <span className="mt-0.5 text-[10px] font-semibold tracking-widest uppercase opacity-90">
              BYE
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3 text-sm">
      <span className="text-muted w-24 shrink-0">{label}</span>
      <span className="text-heading min-w-0 flex-1 font-medium">{value}</span>
    </div>
  );
}

export function isLateEntryEligibleCategory(c: TournamentCategory): boolean {
  const drawn =
    c.status === CategoryStatus.DrawCompleted ||
    c.status === CategoryStatus.InProgress;
  const formatOk =
    c.format === TournamentFormat.SingleElimination ||
    c.format === TournamentFormat.DoubleElimination;
  return drawn && formatOk;
}
