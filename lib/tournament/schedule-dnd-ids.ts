export const UNSCHEDULED_POOL_DROP_ID = 'schedule-unscheduled-pool';
export const SCHEDULE_MATCH_PREFIX = 'schedule-match-';
export const SCHEDULE_UNSCHEDULED_PREFIX = 'schedule-unscheduled-';
export const COURT_DROP_PREFIX = 'court-drop-';
export const REFEREE_CHIP_PREFIX = 'referee-chip-';
export const REFEREE_MATCH_DROP_PREFIX = 'referee-match-drop-';

export function scheduleMatchId(matchId: string): string {
  return `${SCHEDULE_MATCH_PREFIX}${matchId}`;
}

export function unscheduledMatchId(matchId: string): string {
  return `${SCHEDULE_UNSCHEDULED_PREFIX}${matchId}`;
}

export function courtDropId(courtId: string): string {
  return `${COURT_DROP_PREFIX}${courtId}`;
}

export function refereeChipId(refereePoolId: string): string {
  return `${REFEREE_CHIP_PREFIX}${refereePoolId}`;
}

export function refereeMatchDropId(matchId: string): string {
  return `${REFEREE_MATCH_DROP_PREFIX}${matchId}`;
}

export function parseScheduleMatchId(id: string): string | null {
  if (!id.startsWith(SCHEDULE_MATCH_PREFIX)) return null;
  return id.slice(SCHEDULE_MATCH_PREFIX.length) || null;
}

export function parseUnscheduledMatchId(id: string): string | null {
  if (!id.startsWith(SCHEDULE_UNSCHEDULED_PREFIX)) return null;
  return id.slice(SCHEDULE_UNSCHEDULED_PREFIX.length) || null;
}

export function parseCourtDropId(id: string): string | null {
  if (!id.startsWith(COURT_DROP_PREFIX)) return null;
  return id.slice(COURT_DROP_PREFIX.length) || null;
}

export function parseRefereeChipId(id: string): string | null {
  if (!id.startsWith(REFEREE_CHIP_PREFIX)) return null;
  return id.slice(REFEREE_CHIP_PREFIX.length) || null;
}

export function parseRefereeMatchDropId(id: string): string | null {
  if (!id.startsWith(REFEREE_MATCH_DROP_PREFIX)) return null;
  return id.slice(REFEREE_MATCH_DROP_PREFIX.length) || null;
}
