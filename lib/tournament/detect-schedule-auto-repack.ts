import type { TournamentMatch } from '@/graphql/generated';

export interface PortalAutoRepackShift {
  matchId: string;
  matchNumber: number;
  courtLabel: string;
  oldLabel: string;
  newLabel: string;
}

export type AutoRepackBannerPayload = {
  shifts: PortalAutoRepackShift[];
  courtLabels: string[];
};

export function autoRepackBannerKey(payload: AutoRepackBannerPayload): string {
  return [...payload.shifts.map((s) => s.matchId)].sort().join(',');
}

export function detectScheduleAutoRepack(
  prevSnapshot: Map<string, string>,
  matches: TournamentMatch[],
  formatScheduleDate: (iso: string) => string
): { nextSnapshot: Map<string, string>; banner: AutoRepackBannerPayload | null } {
  const nextSnapshot = new Map<string, string>();
  const shifts: PortalAutoRepackShift[] = [];
  const courtsAffected = new Set<string>();

  for (const m of matches) {
    if (!m.scheduledAt || !m.court?.name) continue;
    const nextVal = `${m.court.name}|${m.scheduledAt}`;
    nextSnapshot.set(m._id, nextVal);
    const oldVal = prevSnapshot.get(m._id);
    if (oldVal && oldVal !== nextVal) {
      courtsAffected.add(m.court.name);
      shifts.push({
        matchId: m._id,
        matchNumber: m.matchNumber,
        courtLabel: m.court.name,
        oldLabel: formatScheduleDate(oldVal.split('|')[1] ?? ''),
        newLabel: formatScheduleDate(m.scheduledAt),
      });
    }
  }

  const banner =
    prevSnapshot.size > 0 && shifts.length >= 2
      ? { shifts, courtLabels: [...courtsAffected] }
      : null;

  return { nextSnapshot, banner };
}
