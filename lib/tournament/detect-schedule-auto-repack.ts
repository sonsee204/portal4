import type { ScheduleMatch } from '@/types/tournament-schedule';
import { isScheduleMatchEnded } from '@/lib/tournament/match-ended';
import {
  getTimelineScheduledDate,
  getTimelineStartTime,
} from '@/lib/tournament/schedule-timeline-slot';

export interface AutoRepackShiftRow {
  matchId: string;
  matchNumber: number;
  courtLabel: string;
  oldTime: string;
  newTime: string;
}

export type AutoRepackBannerKind = 'repack' | 'actualized';

export type AutoRepackBannerPayload = {
  kind: AutoRepackBannerKind;
  shifts: AutoRepackShiftRow[];
  courtLabels: string[];
  anchorMatchNumber?: number;
};

type CourtLike = { id: string; name: string };

export function detectScheduleAutoRepack(
  prevSnapshot: Map<string, string>,
  matches: ScheduleMatch[],
  courts: CourtLike[],
): { nextSnapshot: Map<string, string>; banner: AutoRepackBannerPayload | null } {
  const nextSnapshot = new Map<string, string>();
  const shifts: AutoRepackShiftRow[] = [];
  const courtsAffected = new Set<string>();
  const shiftedMatchIds = new Map<string, ScheduleMatch>();

  for (const m of matches) {
    const startTime = getTimelineStartTime(m);
    const scheduledDate = getTimelineScheduledDate(m);
    if (!startTime || !scheduledDate) continue;
    const nextVal = `${m.courtId ?? ''}|${scheduledDate}|${startTime}`;
    nextSnapshot.set(m.id, nextVal);
    const oldVal = prevSnapshot.get(m.id);
    if (oldVal && oldVal !== nextVal) {
      const [, oldDate, oldTime] = oldVal.split('|');
      const courtLabel =
        courts.find((c) => c.id === m.courtId)?.name ?? m.courtId ?? '';
      if (courtLabel) courtsAffected.add(courtLabel);
      shifts.push({
        matchId: m.id,
        matchNumber: m.matchNumber,
        courtLabel,
        oldTime: `${oldDate}T${oldTime}:00`,
        newTime: `${scheduledDate}T${startTime}:00`,
      });
      shiftedMatchIds.set(m.id, m);
    }
  }

  let banner: AutoRepackBannerPayload | null = null;
  if (prevSnapshot.size > 0 && shifts.length > 0) {
    const byCourt = new Map<string, number>();
    for (const s of shifts) {
      byCourt.set(s.courtLabel, (byCourt.get(s.courtLabel) ?? 0) + 1);
    }
    const likelyRepack =
      [...byCourt.values()].some((c) => c >= 2) || shifts.length >= 2;
    const onlyActualized =
      shifts.length === 1 &&
      isScheduleMatchEnded(shiftedMatchIds.get(shifts[0]!.matchId)?.status);

    if (likelyRepack || onlyActualized) {
      banner = {
        kind: onlyActualized && !likelyRepack ? 'actualized' : 'repack',
        shifts,
        courtLabels: [...courtsAffected],
        anchorMatchNumber: onlyActualized ? shifts[0]?.matchNumber : undefined,
      };
    }
  }

  return { nextSnapshot, banner };
}
