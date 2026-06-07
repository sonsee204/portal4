'use client';

import type { ScheduleMatch, ScheduleCourt } from '@/types/tournament-schedule';
import { TournamentCourtTimelineGrid } from './TournamentCourtTimelineGrid';
import { ScheduleMatchCard } from './ScheduleMatchCard';

/** Chip trận gọn — đủ rộng cho #trận + vòng + phút */
export const SCHEDULE_COURT_COL_MIN_WIDTH_PX = 200;

interface ScheduleGridProps {
  courts: ScheduleCourt[];
  matches: ScheduleMatch[];
  /** [startMinutesOfDay, endMinutesOfDay] */
  dayRange: [number, number];
  onClickEmpty: (courtId: string, time: string) => void;
  onClickMatch: (matchId: string) => void;
  highlightedMatchIds?: ReadonlySet<string>;
  dimUnhighlighted?: boolean;
  courtBufferMinutes?: number;
}

export function ScheduleGrid({
  courts,
  matches,
  dayRange,
  onClickEmpty,
  onClickMatch,
  highlightedMatchIds,
  dimUnhighlighted,
  courtBufferMinutes,
}: ScheduleGridProps) {
  return (
    <TournamentCourtTimelineGrid
      courts={courts}
      matches={matches}
      dayRange={dayRange}
      onClickEmpty={onClickEmpty}
      courtColMinWidthPx={SCHEDULE_COURT_COL_MIN_WIDTH_PX}
      cardSizing="slot"
      highlightedMatchIds={highlightedMatchIds}
      dimUnhighlighted={dimUnhighlighted}
      courtBufferMinutes={courtBufferMinutes}
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
