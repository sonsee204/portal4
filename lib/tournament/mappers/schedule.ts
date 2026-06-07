import type { TournamentMatch as GqlMatch, TournamentCategory as GqlCategory } from '@/graphql/generated';
import type {
  MatchStatus,
  ScheduleMatch,
  ScheduleCourt,
  SchedulePlayerInfo,
} from '@/types/tournament-schedule';
import { categoryNeedsDrawBeforeSchedule } from '@/lib/tournament/category-schedule-eligibility';
import { parseScheduledAtLocal } from '@/lib/tournament/parse-scheduled-at-local';
import { getTimelineEndTime } from '@/lib/tournament/schedule-timeline-slot';

const SCHEDULE_STATUS_MAP: Record<string, MatchStatus> = {
  NOT_STARTED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
  WALKOVER: 'walkover',
  CANCELLED: 'cancelled',
  RETIREMENT: 'retirement',
  BYE: 'finished',
};

function computeEndTime(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMinutes = h * 60 + m + durationMinutes;
  const endH = Math.floor(totalMinutes / 60) % 24;
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
}

export function mapTournamentCourts(courts: { name: string; status?: string | null; notes?: string | null }[]): ScheduleCourt[] {
  return courts.map((c) => ({
    id: c.name,
    name: c.name,
    status: (c.status as 'available' | 'maintenance' | 'reserved') ?? 'available',
    notes: c.notes ?? undefined,
  }));
}

export function mapMatchesToSchedule(matches: GqlMatch[], categories: GqlCategory[]): ScheduleMatch[] {
  return matches
    .filter((m) => !m.isBye)
    .map((m) => {
      const cat = categories.find((c) => c._id === m.categoryId);
      const parsedSchedule = m.scheduledAt
        ? parseScheduledAtLocal(m.scheduledAt)
        : undefined;
      const scheduledDate = parsedSchedule?.scheduledDate;
      const startTime = parsedSchedule?.startTime;
      const durationSeconds = m.durationSeconds ?? undefined;

      const toPlayer = (
        p: typeof m.player1,
        slotLabel?: string | null,
      ): SchedulePlayerInfo | null => {
        if (p?.name) {
          const dob = (p as { dateOfBirth?: string | null }).dateOfBirth;
          const birthYear =
            dob?.trim() && dob.length >= 4 ? dob.slice(0, 4) : dob ?? undefined;
          const members = p.members
            ?.filter((m): m is NonNullable<typeof m> => !!m?.name?.trim())
            .map((m) => ({
              userId: m.userId ?? undefined,
              name: m.name!.trim(),
              avatarUrl: m.avatarUrl ?? undefined,
            }));

          return {
            name: p.name,
            club: p.club ?? undefined,
            dateOfBirth: birthYear ?? undefined,
            bibNumber: (p as { bibNumber?: number | null }).bibNumber ?? undefined,
            members: members?.length ? members : undefined,
          };
        }
        if (slotLabel?.trim()) {
          return { name: slotLabel.trim(), isPlaceholder: true };
        }
        return null;
      };
      const sets = m.scoreSummary?.sets?.map((s) => ({
        p1: s.player1,
        p2: s.player2,
      }));

      const base: ScheduleMatch = {
        id: m._id,
        matchNumber: m.matchNumber,
        categoryId: m.categoryId ?? '',
        categoryTitle: cat?.title ?? m.roundLabel ?? '',
        round: m.round ?? 1,
        roundLabel: m.roundLabel ?? '',
        players: [
          toPlayer(m.player1, m.player1SlotLabel ?? null),
          toPlayer(m.player2, m.player2SlotLabel ?? null),
        ],
        playerIds: [m.player1?.registrationId ?? null, m.player2?.registrationId ?? null],
        sets: sets?.length ? sets : undefined,
        status: SCHEDULE_STATUS_MAP[m.status] ?? 'scheduled',
        courtId: m.court?.name ?? undefined,
        startTime,
        scheduledDate,
        matchStartedAt: m.matchStartedAt ?? undefined,
        durationSeconds,
        estimatedDurationMinutes: m.estimatedDurationMinutes ?? 30,
        refereeId: m.refereeId ?? undefined,
        refereeName: m.refereeName ?? undefined,
        winner: (m.winner as 1 | 2 | undefined) ?? undefined,
        updatedAt: m.updatedAt ?? undefined,
        needsDrawBeforeSchedule: categoryNeedsDrawBeforeSchedule(cat?.status),
      };

      return {
        ...base,
        endTime: getTimelineEndTime(base),
      };
    });
}

// Kept for schedule form end-time previews
export { computeEndTime };
