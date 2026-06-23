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

import type {
  ManualBracketSlotInput,
  TournamentMatch,
  TournamentRegistration,
  TournamentCategory,
} from '@/graphql/generated';
import type {
  BracketCategoryData,
  BracketMatch,
  BracketPlayer,
  DrawPlayer,
  DrawSlot,
  MatchStatus,
} from './types';

type RegistrationFragment = Pick<
  TournamentRegistration,
  '_id' | 'athleteName' | 'club' | 'seed' | 'avatarUrl' | 'members' | 'bibNumber'
>;

const BRACKET_STATUS_MAP: Record<string, MatchStatus> = {
  NOT_STARTED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
  BYE: 'finished',
  WALKOVER: 'walkover',
  CANCELLED: 'cancelled',
  RETIREMENT: 'retirement',
};

const BYE_PLAYER: BracketPlayer = { id: 'bye', name: 'BYE' };

export function mapRegistrationToDrawPlayer(
  reg: RegistrationFragment,
): DrawPlayer {
  return {
    id: reg._id,
    name: reg.athleteName,
    club: reg.members?.[0]?.club ?? reg.club ?? undefined,
    seed: reg.seed ?? undefined,
    avatarUrl: reg.members?.[0]?.avatarUrl ?? reg.avatarUrl ?? undefined,
    bibNumber: reg.bibNumber ?? undefined,
  };
}

export function createEmptySlots(bracketSize: number): DrawSlot[] {
  return Array.from({ length: bracketSize }, (_, slotIndex) => ({ slotIndex }));
}

import { syncAllPairByes } from './manual-draw.derived';

export function slotsToKnockoutInput(slots: DrawSlot[]): ManualBracketSlotInput[] {
  const normalized = syncAllPairByes(slots, slots.length / 2);
  const input: ManualBracketSlotInput[] = [];
  for (const slot of normalized) {
    if (slot.isBye) {
      input.push({ slotIndex: slot.slotIndex, registrationId: null });
    } else if (slot.player) {
      input.push({
        slotIndex: slot.slotIndex,
        registrationId: slot.player.id,
      });
    }
  }
  return input;
}

function formatScheduledAt(raw: string): string {
  return new Date(raw).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function mapToBracketMatch(m: TournamentMatch): BracketMatch {
  const mapPlayer = (
    p: TournamentMatch['player1'],
    slotLabel?: string | null,
    winnerSlot?: number | null,
    slotNum?: 1 | 2,
  ): BracketPlayer | null => {
    if (!p?.name && slotLabel?.trim()) {
      return { id: 'slot-placeholder', name: slotLabel.trim(), isPlaceholder: true };
    }
    if (!p?.name) return null;
    const sets = m.scoreSummary?.sets;
    const currentLiveSet =
      m.status === 'LIVE' && sets && sets.length > 0 ? sets[sets.length - 1] : null;
    return {
      id: p.registrationId ?? p.userId ?? '',
      name: p.name,
      club: p.club ?? undefined,
      seed: p.seed ?? undefined,
      avatarUrl: p.avatarUrl ?? undefined,
      bibNumber: p.bibNumber ?? undefined,
      score:
        slotNum === 1
          ? currentLiveSet?.player1 ?? m.scoreSummary?.finalScore?.[0]
          : currentLiveSet?.player2 ?? m.scoreSummary?.finalScore?.[1],
      winner: winnerSlot != null && slotNum != null ? m.winner === slotNum : undefined,
      members: p.members
        ?.filter((x): x is NonNullable<typeof x> => !!x && !!x.name)
        .map((x) => ({
          userId: x.userId ?? undefined,
          name: x.name!,
          avatarUrl: x.avatarUrl ?? undefined,
        })),
    };
  };

  let p1 = mapPlayer(m.player1, m.player1SlotLabel, m.winner, 1);
  let p2 = mapPlayer(m.player2, m.player2SlotLabel, m.winner, 2);
  if (m.isBye) {
    if (!p1) p1 = BYE_PLAYER;
    if (!p2) p2 = BYE_PLAYER;
  }

  return {
    id: m._id,
    matchNumber: m.matchNumber,
    status: BRACKET_STATUS_MAP[m.status] ?? 'scheduled',
    isBye: m.isBye || undefined,
    scheduledAt: m.scheduledAt ? formatScheduledAt(m.scheduledAt) : undefined,
    court: m.court?.name,
    refereeName: m.refereeName ?? undefined,
    sets: m.scoreSummary?.sets?.map((s) => ({ p1: s.player1, p2: s.player2 })),
    players: [p1, p2],
  };
}

export function mapMatchesToBracketTree(
  matches: TournamentMatch[],
  category: Pick<TournamentCategory, '_id' | 'title' | 'ageLabel'>,
): BracketCategoryData {
  const knockout = matches.filter((m) => m.round < 100 && m.roundLabel !== 'Tranh Hạng 3');
  const roundsMap = new Map<number, TournamentMatch[]>();
  for (const m of knockout) {
    const arr = roundsMap.get(m.round) ?? [];
    arr.push(m);
    roundsMap.set(m.round, arr);
  }

  const rounds = [...roundsMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, roundMatches]) => {
      const label = roundMatches[0]?.roundLabel ?? `Vòng ${roundMatches[0]?.round}`;
      return {
        label,
        matches: roundMatches
          .sort(
            (a, b) =>
              (a.bracketPosition ?? a.matchNumber) - (b.bracketPosition ?? b.matchNumber),
          )
          .map(mapToBracketMatch),
      };
    });

  return {
    categoryId: category._id,
    categoryTitle: category.title,
    ageLabel: category.ageLabel ?? '',
    rounds,
  };
}
