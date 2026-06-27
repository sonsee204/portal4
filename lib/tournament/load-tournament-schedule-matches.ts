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
import { fetchAllConnectionPages } from '@/hooks/shared/useCursorConnection';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';

export type ScheduleMatchConnectionPage = {
  edges: Array<{ cursor: string; node: TournamentMatch }>;
  pageInfo: { hasNextPage: boolean; endCursor?: string | null };
  totalCount: number;
};

export type ScheduleMatchLoadResult = {
  matches: TournamentMatch[];
  expectedTotal: number;
  loadedTotal: number;
  isComplete: boolean;
  perCategoryTotals: Record<string, number>;
};

export function dedupeTournamentMatchesById(
  matches: TournamentMatch[],
): TournamentMatch[] {
  if (matches.length <= 1) return matches;
  const byId = new Map<string, TournamentMatch>();
  for (const match of matches) {
    byId.set(match._id, match);
  }
  return byId.size === matches.length ? matches : [...byId.values()];
}

export function sortTournamentMatchesByNumber(
  matches: TournamentMatch[],
): TournamentMatch[] {
  return [...matches].sort((a, b) => a.matchNumber - b.matchNumber);
}

async function loadCategoryMatches(
  categoryId: string,
  fetchCategoryPage: (
    categoryId: string,
    after?: string | null,
  ) => Promise<ScheduleMatchConnectionPage>,
): Promise<{
  categoryId: string;
  matches: TournamentMatch[];
  totalCount: number;
  isComplete: boolean;
}> {
  let totalCount = 0;
  const { nodes, stoppedReason } = await fetchAllConnectionPages<TournamentMatch>(
    {
      getExpectedTotal: () => (totalCount > 0 ? totalCount : undefined),
      getMaxPages: () =>
        totalCount > 0
          ? Math.ceil(totalCount / CURSOR_PAGE_MAX) + 2
          : 500,
      fetchPage: async (after) => {
        const page = await fetchCategoryPage(categoryId, after);
        totalCount = page.totalCount || totalCount;
        return {
          edges: page.edges,
          pageInfo: page.pageInfo,
        };
      },
    },
  );

  const deduped = dedupeTournamentMatchesById(nodes);
  const isComplete =
    stoppedReason === 'complete' &&
    (totalCount === 0 || deduped.length >= totalCount);

  return {
    categoryId,
    matches: deduped,
    totalCount,
    isComplete,
  };
}

export async function loadTournamentScheduleMatchesComplete(args: {
  fetchCategoryPage: (
    categoryId: string,
    after?: string | null,
  ) => Promise<ScheduleMatchConnectionPage>;
  categoryIds: string[];
  globalFallback?: () => Promise<ScheduleMatchLoadResult>;
}): Promise<ScheduleMatchLoadResult> {
  const { fetchCategoryPage, categoryIds, globalFallback } = args;

  if (categoryIds.length === 0) {
    if (globalFallback) return globalFallback();
    return {
      matches: [],
      expectedTotal: 0,
      loadedTotal: 0,
      isComplete: true,
      perCategoryTotals: {},
    };
  }

  const perCategoryResults = await Promise.all(
    categoryIds.map((categoryId) =>
      loadCategoryMatches(categoryId, fetchCategoryPage),
    ),
  );

  const perCategoryTotals: Record<string, number> = {};
  const merged: TournamentMatch[] = [];

  for (const result of perCategoryResults) {
    perCategoryTotals[result.categoryId] = result.totalCount;
    merged.push(...result.matches);
  }

  const matches = sortTournamentMatchesByNumber(
    dedupeTournamentMatchesById(merged),
  );
  const expectedTotal = Object.values(perCategoryTotals).reduce(
    (sum, count) => sum + count,
    0,
  );
  const loadedTotal = matches.length;
  const isComplete =
    perCategoryResults.every((result) => result.isComplete) &&
    loadedTotal >= expectedTotal;

  return {
    matches,
    expectedTotal,
    loadedTotal,
    isComplete,
    perCategoryTotals,
  };
}
