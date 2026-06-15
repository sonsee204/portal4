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
  useTournamentScheduleMatches,
} from '@/hooks/tournament';
import { mapMatchesToSchedule } from '@/lib/tournament/mappers/schedule';
import {
  buildBracketDocument,
  buildMasterSchedule,
  computePrintReadiness,
} from '@/lib/tournament/print';
import type { PrintBracketDocument } from '@/lib/tournament/print/types';
import {
  mapCategoryToPrintInput,
  mapGqlMatchToPrintInput,
  mapScheduleMatchToPrintScheduleInput,
  mapTournamentToPrintInput,
} from '@/lib/tournament/print/adapters';

export type PrintPageTab = 'schedule' | 'bracket';

export function useTournamentPrintPageData(tournamentId: string) {
  const [activeTab, setActiveTab] = useState<PrintPageTab>('schedule');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  const { tournament, loading: tLoading, error: tError } =
    useTournament(tournamentId);
  const { categories, loading: cLoading } =
    useTournamentCategories(tournamentId);
  const {
    matches: rawMatches,
    loading: mLoading,
    error: mError,
  } = useTournamentScheduleMatches({ tournamentId });

  const scheduleMatches = useMemo(
    () => mapMatchesToSchedule(rawMatches, categories),
    [rawMatches, categories],
  );

  const printCategories = useMemo(
    () => categories.map(mapCategoryToPrintInput),
    [categories],
  );

  const printTournament = useMemo(
    () => (tournament ? mapTournamentToPrintInput(tournament) : null),
    [tournament],
  );

  const printMatches = useMemo(
    () => rawMatches.map(mapGqlMatchToPrintInput),
    [rawMatches],
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
      rawMatches.length,
    );
  }, [printTournament, printCategories, scheduleInputs, rawMatches.length]);

  const bracketDocsByCategoryId = useMemo(() => {
    if (!printTournament) return new Map<string, PrintBracketDocument>();
    const map = new Map<string, PrintBracketDocument>();
    for (const cat of printCategories) {
      const doc = buildBracketDocument(printTournament, cat, printMatches);
      if (doc) map.set(cat.id, doc);
    }
    return map;
  }, [printTournament, printCategories, printMatches]);

  const readiness = useMemo(
    () =>
      computePrintReadiness(
        printCategories,
        scheduledCount,
        rawMatches.length,
      ),
    [printCategories, scheduledCount, rawMatches.length],
  );

  const effectiveCategoryId =
    selectedCategoryId ||
    readiness.drawnCategoryIds[0] ||
    categories[0]?._id ||
    '';

  const activeBracketDoc =
    bracketDocsByCategoryId.get(effectiveCategoryId) ?? null;

  const drawnBracketDocs = useMemo(
    () =>
      [...bracketDocsByCategoryId.entries()]
        .map(([id, doc]) => ({ categoryId: id, doc }))
        .sort((a, b) => {
          const oa =
            printCategories.find((c) => c.id === a.categoryId)?.displayOrder ?? 0;
          const ob =
            printCategories.find((c) => c.id === b.categoryId)?.displayOrder ?? 0;
          return oa - ob;
        }),
    [bracketDocsByCategoryId, printCategories],
  );

  const loading = tLoading || cLoading || mLoading;
  const error = tError ?? mError;

  return {
    tournamentId,
    tournament,
    categories,
    activeTab,
    setActiveTab,
    selectedCategoryId: effectiveCategoryId,
    setSelectedCategoryId,
    masterScheduleDoc,
    activeBracketDoc,
    drawnBracketDocs,
    readiness,
    loading,
    error,
  };
}

export type TournamentPrintPageData = ReturnType<
  typeof useTournamentPrintPageData
>;
