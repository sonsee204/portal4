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

import { useMemo, useState } from 'react';
import {
  useTournament,
  useTournamentCategories,
} from '@/hooks/tournament';
import { mapMatchesToSchedule } from '@/lib/tournament/mappers/schedule';
import {
  buildMasterSchedule,
  computePrintReadiness,
  isCategoryDrawnForPrint,
} from '@/lib/tournament/print';
import type { PrintCategoryInput } from '@/lib/tournament/print/types';
import {
  mapCategoryToPrintInput,
  mapScheduleMatchToPrintScheduleInput,
  mapTournamentToPrintInput,
} from '@/lib/tournament/print/adapters';
import { useCategoryBracketDoc } from './useCategoryBracketDoc';
import { useAllCategoryBracketMatches } from './useAllCategoryBracketMatches';

export type PrintPageTab = 'schedule' | 'bracket';

export function useTournamentPrintPageData(tournamentId: string) {
  const [activeTab, setActiveTab] = useState<PrintPageTab>('schedule');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const { tournament, loading: tLoading, error: tError } =
    useTournament(tournamentId);
  const { categories, loading: cLoading } =
    useTournamentCategories(tournamentId);

  const printCategories = useMemo(
    () => categories.map(mapCategoryToPrintInput),
    [categories],
  );

  const printTournament = useMemo(
    () => (tournament ? mapTournamentToPrintInput(tournament) : null),
    [tournament],
  );

  // Derive drawn category IDs early — needed to drive per-category bracket
  // fetches before `readiness` is available.
  const drawnCategoryIds = useMemo(
    () =>
      printCategories
        .filter((c) => isCategoryDrawnForPrint(c.status))
        .map((c) => c.id),
    [printCategories],
  );

  // Fetch ALL matches for ALL drawn categories via per-category bracket
  // queries (`tournamentBracket(categoryId)`), which return every round in one
  // response.  The paginated tournament-wide connection stops at round 1 for
  // large tournaments — the cursor sort puts round-1 matches first and the
  // backend returns hasNextPage=false before later rounds appear.
  const { matches: allCategoryMatches, loading: mLoading } =
    useAllCategoryBracketMatches(drawnCategoryIds, cLoading || !tournamentId);

  const scheduleMatches = useMemo(
    () => mapMatchesToSchedule(allCategoryMatches, categories),
    [allCategoryMatches, categories],
  );

  const scheduleInputs = useMemo(
    () => scheduleMatches.map(mapScheduleMatchToPrintScheduleInput),
    [scheduleMatches],
  );

  const scheduledCount = useMemo(
    () => scheduleInputs.filter((m) => m.scheduledDate && m.startTime).length,
    [scheduleInputs],
  );

  const masterScheduleDoc = useMemo(() => {
    if (!printTournament) return null;
    return buildMasterSchedule(
      printTournament,
      printCategories,
      scheduleInputs,
      allCategoryMatches.length,
    );
  }, [printTournament, printCategories, scheduleInputs, allCategoryMatches.length]);

  const readiness = useMemo(
    () =>
      computePrintReadiness(
        printCategories,
        scheduledCount,
        allCategoryMatches.length,
      ),
    [printCategories, scheduledCount, allCategoryMatches.length],
  );

  const effectiveCategoryId =
    selectedCategoryId ||
    readiness.drawnCategoryIds[0] ||
    categories[0]?._id ||
    '';

  const activeCategory = useMemo(
    () => printCategories.find((c) => c.id === effectiveCategoryId),
    [printCategories, effectiveCategoryId],
  );

  // Fetch the selected category's FULL bracket (every round) directly instead
  // of slicing it out of the paginated tournament-wide match connection, which
  // can drop later rounds for large tournaments.
  const { doc: activeBracketDoc } = useCategoryBracketDoc(
    printTournament,
    activeCategory,
    activeTab !== 'bracket' || !activeCategory,
  );

  // Drawn categories (status-derived, independent of match data) used to drive
  // the "print all brackets" action — each is fetched on demand by its own
  // bracket loader component.
  const drawnPrintCategories = useMemo<PrintCategoryInput[]>(
    () =>
      printCategories
        .filter((c) => readiness.drawnCategoryIds.includes(c.id))
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [printCategories, readiness.drawnCategoryIds],
  );

  const loading = tLoading || cLoading || mLoading;
  const error = tError;

  return {
    tournamentId,
    tournament,
    printTournament,
    categories,
    activeTab,
    setActiveTab,
    selectedCategoryId: effectiveCategoryId,
    setSelectedCategoryId,
    masterScheduleDoc,
    activeBracketDoc,
    drawnPrintCategories,
    readiness,
    loading,
    error,
  };
}

export type TournamentPrintPageData = ReturnType<
  typeof useTournamentPrintPageData
>;
