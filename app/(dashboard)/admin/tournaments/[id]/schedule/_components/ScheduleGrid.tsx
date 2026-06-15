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

import type { ScheduleMatch, ScheduleCourt } from '@/types/tournament-schedule';
import { TournamentCourtTimelineGrid } from './TournamentCourtTimelineGrid';
import { ScheduleMatchCard } from './ScheduleMatchCard';

export const SCHEDULE_COURT_COL_MIN_WIDTH_PX = 200;

interface ScheduleGridProps {
  courts: ScheduleCourt[];
  matches: ScheduleMatch[];
  dayRange: [number, number];
  selectedDate: string;
  isPastDate?: boolean;
  onClickEmpty: (courtId: string, time: string) => void;
  onClickMatch: (matchId: string) => void;
  highlightedMatchIds?: ReadonlySet<string>;
  dimUnhighlighted?: boolean;
  courtBufferMinutes?: number;
  dragDropEnabled?: boolean;
  emptyColumnHint?: string;
}

export function ScheduleGrid({
  courts,
  matches,
  dayRange,
  selectedDate,
  isPastDate = false,
  onClickEmpty,
  onClickMatch,
  highlightedMatchIds,
  dimUnhighlighted,
  courtBufferMinutes,
  dragDropEnabled = false,
  emptyColumnHint,
}: ScheduleGridProps) {
  return (
    <TournamentCourtTimelineGrid
      courts={courts}
      matches={matches}
      dayRange={dayRange}
      onClickEmpty={onClickEmpty}
      emptyColumnHint={emptyColumnHint}
      courtColMinWidthPx={SCHEDULE_COURT_COL_MIN_WIDTH_PX}
      cardSizing="slot"
      highlightedMatchIds={highlightedMatchIds}
      dimUnhighlighted={dimUnhighlighted}
      courtBufferMinutes={courtBufferMinutes}
      dragDropEnabled={dragDropEnabled && !isPastDate}
      selectedDate={selectedDate}
      isPastDate={isPastDate}
      renderMatchCard={(match, layout) => (
        <ScheduleMatchCard
          match={match}
          onClick={() => onClickMatch(match.id)}
          heightPx={layout.heightPx}
          cardSizing={layout.cardSizing}
          gridChipOnly
        />
      )}
    />
  );
}
