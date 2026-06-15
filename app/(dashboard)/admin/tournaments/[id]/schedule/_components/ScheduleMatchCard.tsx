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

import { cn } from '@/lib/utils';
import type { ScheduleMatch } from '@/types/tournament-schedule';
import { ScheduleRoundBadge } from './ScheduleRoundBadge';
import {
  getCategoryScheduleAccent,
  SCHEDULE_MATCH_SLOT_SURFACE,
} from '@/lib/tournament/category-schedule-accent';
import type { TimelineCardSizing } from './timeline-card-layout';
import { isScheduleMatchEnded } from '@/lib/tournament/match-ended';
import { isScheduleMatchOverdue } from '@/lib/tournament/schedule-overdue';
import {
  getEffectiveDurationMinutes,
  hasActualDurationDrift,
} from '@/lib/tournament/schedule-timeline-slot';

interface ScheduleMatchCardProps {
  match: ScheduleMatch;
  onClick: () => void;
  heightPx?: number;
  cardSizing?: TimelineCardSizing;
  gridChipOnly?: boolean;
}

const statusDotClass: Record<string, string> = {
  scheduled: 'bg-blue-400',
  live: 'bg-emerald-400 animate-pulse',
  finished: 'bg-slate-400',
  walkover: 'bg-slate-400',
};

export function ScheduleMatchCard({
  match,
  onClick,
  gridChipOnly = true,
}: ScheduleMatchCardProps) {
  const isEnded = isScheduleMatchEnded(match.status);
  const isOverdue = isScheduleMatchOverdue(match);
  const accent = getCategoryScheduleAccent(match.categoryId);
  const round = match.round ?? 1;

  if (!gridChipOnly) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      title={`Trận #${match.matchNumber} · ${match.roundLabel ?? ''} · ${match.categoryTitle}`}
      className={cn(
        'flex h-full w-full items-center gap-1 overflow-hidden rounded-xl border-l-4 pr-1.5 pl-2 text-left shadow-sm transition-colors hover:shadow-md',
        SCHEDULE_MATCH_SLOT_SURFACE,
        accent.border,
        isEnded && 'opacity-50'
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 shrink-0 rounded-full',
          statusDotClass[match.status] ?? 'bg-slate-400'
        )}
      />
      <span
        className={cn(
          'text-heading shrink-0 text-[10px] font-bold tabular-nums',
          accent.number
        )}
      >
        #{match.matchNumber}
      </span>
      {isOverdue ? (
        <span className="shrink-0 rounded border border-amber-500/25 bg-amber-500/15 px-1 py-px text-[8px] font-semibold text-amber-600">
          QH
        </span>
      ) : null}
      {match.roundLabel ? (
        <span className="bg-primary/12 text-primary inline-block min-w-0 flex-1 truncate rounded-md px-1 py-0.5 text-[9px] font-semibold tracking-tight">
          {match.roundLabel}
        </span>
      ) : (
        <div className="min-w-0 flex-1 overflow-hidden">
          <ScheduleRoundBadge
            round={round}
            roundLabel={match.roundLabel}
            size="xs"
            className="max-w-full"
          />
        </div>
      )}
      {match.status === 'live' && match.sets?.length ? (
        <span className="bg-primary/15 text-primary shrink-0 rounded px-1 py-0.5 text-[9px] font-bold tabular-nums">
          {match.sets[match.sets.length - 1]?.p1}-
          {match.sets[match.sets.length - 1]?.p2}
        </span>
      ) : (
        <span className="text-muted shrink-0 text-[9px] font-semibold tabular-nums">
          {getEffectiveDurationMinutes(match)}′
          {hasActualDurationDrift(match) ? (
            <span className="text-emerald-600 dark:text-emerald-400">*</span>
          ) : null}
        </span>
      )}
    </button>
  );
}
