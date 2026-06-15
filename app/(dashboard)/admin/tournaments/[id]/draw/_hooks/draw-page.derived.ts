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

import type { TournamentMatch } from '@/graphql/generated';

export function categoryStatusLabel(status?: string): {
  text: string;
  className: string;
} | null {
  switch (status) {
    case 'PENDING':
      return { text: 'Chưa mở', className: 'bg-slate-500/10 text-slate-400' };
    case 'REGISTRATION_OPEN':
      return {
        text: 'Đang đăng ký',
        className: 'bg-green-500/10 text-green-400',
      };
    case 'DRAW_PENDING':
      return {
        text: 'Chờ lên lịch',
        className: 'bg-amber-500/10 text-amber-400',
      };
    case 'DRAW_COMPLETED':
      return {
        text: 'Đã lên lịch',
        className: 'bg-blue-500/10 text-blue-400',
      };
    case 'IN_PROGRESS':
      return {
        text: 'Đang thi đấu',
        className: 'bg-emerald-500/10 text-emerald-400',
      };
    case 'COMPLETED':
      return {
        text: 'Hoàn thành',
        className: 'bg-slate-500/10 text-slate-400',
      };
    default:
      return null;
  }
}

export function computeEffectiveBracketSize(
  approvedCount: number,
  categoryBracketSize: number,
): number {
  if (!approvedCount || approvedCount < 2) return 0;
  let p = 1;
  while (p < approvedCount) p *= 2;
  return categoryBracketSize ? Math.max(categoryBracketSize, p) : p;
}

export function computeExpectedByes(
  effectiveBracketSize: number,
  approvedCount: number,
): number {
  return effectiveBracketSize > 0
    ? effectiveBracketSize - approvedCount
    : 0;
}

export function splitGroupKnockoutMatches(matches: TournamentMatch[]) {
  return {
    groupMatches: matches.filter((m) => m.round < 100),
    knockoutMatches: matches.filter((m) => m.round >= 100),
  };
}

export function getUniqueGroupIds(groupMatches: TournamentMatch[]): string[] {
  return [
    ...new Set(
      groupMatches
        .map((m) => m.groupId)
        .filter((g): g is string => Boolean(g)),
    ),
  ].sort();
}

export function isGroupMatchFinished(status: string): boolean {
  return ['FINISHED', 'WALKOVER', 'RETIREMENT'].includes(status);
}

export function areAllGroupMatchesDone(groupMatches: TournamentMatch[]): boolean {
  if (groupMatches.length === 0) return false;
  return groupMatches.every((m) => m.isBye || isGroupMatchFinished(m.status));
}

export function isKnockoutSeeded(knockoutMatches: TournamentMatch[]): boolean {
  const r1 = knockoutMatches.filter((m) => m.round === 101);
  return r1.length > 0 && r1.some((m) => m.player1 || m.player2);
}

export function buildRoundsMap(
  matches: TournamentMatch[],
): Array<[number, TournamentMatch[]]> {
  const map = new Map<number, TournamentMatch[]>();
  for (const m of matches) {
    const arr = map.get(m.round) ?? [];
    arr.push(m);
    map.set(m.round, arr);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

export function getActiveGroupMatches(
  groupMatches: TournamentMatch[],
  activeGroupTab: string,
): TournamentMatch[] {
  return groupMatches
    .filter((m) => m.groupId === activeGroupTab)
    .sort(
      (a, b) => a.round - b.round || a.bracketPosition! - b.bracketPosition!,
    );
}

export function computeTotalGroupMatches(
  approvedCount: number,
  groupCount: number,
): number {
  const perGroup = Math.ceil(approvedCount / groupCount);
  const groupMatchesPerGroup = Math.floor((perGroup * (perGroup - 1)) / 2);
  return groupMatchesPerGroup * groupCount;
}

export function computeRoundRobinMatchCount(approvedCount: number): number {
  return Math.floor((approvedCount * (approvedCount - 1)) / 2);
}

export function resolveActiveCategoryId(
  selectedCategoryId: string,
  categories: ReadonlyArray<{ _id: string }>,
): string {
  return selectedCategoryId || categories[0]?._id || '';
}

export function resolveActiveGroupTab(
  selectedGroupTab: string,
  uniqueGroupIds: string[],
): string {
  return selectedGroupTab || uniqueGroupIds[0] || '';
}
