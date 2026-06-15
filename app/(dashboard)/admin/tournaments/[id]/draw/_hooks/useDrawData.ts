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

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  useRegistrations,
  useTournamentBracket,
  useTournamentCategories,
} from '@/hooks/tournament';
import {
  GET_TOURNAMENT_GROUP_RANKINGS,
  GET_TOURNAMENT_RANKINGS,
} from '@/graphql/tournament/queries';
import {
  RegistrationStatus,
  TournamentFormat,
  type GetTournamentGroupRankingsQuery,
  type GetTournamentGroupRankingsQueryVariables,
  type GetTournamentRankingsQuery,
  type GetTournamentRankingsQueryVariables,
} from '@/graphql/generated';
import {
  areAllGroupMatchesDone,
  buildRoundsMap,
  categoryStatusLabel,
  computeEffectiveBracketSize,
  computeExpectedByes,
  computeRoundRobinMatchCount,
  computeTotalGroupMatches,
  getActiveGroupMatches,
  getUniqueGroupIds,
  isKnockoutSeeded,
  resolveActiveCategoryId,
  resolveActiveGroupTab,
  splitGroupKnockoutMatches,
} from './draw-page.derived';

export function useDrawData(tournamentId: string) {
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedGroupTab, setSelectedGroupTab] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const {
    categories,
    loading: cLoading,
    refetch: refetchCategories,
  } = useTournamentCategories(tournamentId);

  const activeCategoryId = resolveActiveCategoryId(
    selectedCategoryId,
    categories,
  );
  const activeCategory = categories.find((c) => c._id === activeCategoryId);

  const {
    matches,
    loading: bLoading,
    refetch,
    subscribeToMatchUpdates,
  } = useTournamentBracket(activeCategoryId, !activeCategoryId);

  const { total: totalRegs } = useRegistrations({
    tournamentId,
    filter: { categoryId: activeCategoryId || undefined },
    pagination: { page: 1, limit: 1 },
    skip: !activeCategoryId,
  });
  const { total: approvedCount } = useRegistrations({
    tournamentId,
    filter: {
      categoryId: activeCategoryId || undefined,
      registrationStatus: RegistrationStatus.Approved,
    },
    pagination: { page: 1, limit: 1 },
    skip: !activeCategoryId,
  });

  const pendingCount = (totalRegs ?? 0) - (approvedCount ?? 0);
  const categoryBracketSize = activeCategory?.bracketSize ?? 0;
  const effectiveBracketSize = computeEffectiveBracketSize(
    approvedCount ?? 0,
    categoryBracketSize,
  );
  const expectedByes = computeExpectedByes(
    effectiveBracketSize,
    approvedCount ?? 0,
  );

  useEffect(() => {
    if (!tournamentId || !activeCategoryId) return;
    const unsubscribe = subscribeToMatchUpdates(tournamentId);
    return () => unsubscribe();
  }, [subscribeToMatchUpdates, tournamentId, activeCategoryId]);

  const isRoundRobin = activeCategory?.format === TournamentFormat.RoundRobin;
  const isGroupKnockout =
    activeCategory?.format === TournamentFormat.GroupKnockout;

  const { groupMatches, knockoutMatches } = useMemo(
    () => splitGroupKnockoutMatches(matches),
    [matches],
  );
  const uniqueGroupIds = useMemo(
    () => getUniqueGroupIds(groupMatches),
    [groupMatches],
  );
  const activeGroupTab = resolveActiveGroupTab(selectedGroupTab, uniqueGroupIds);
  const allGroupMatchesDone = useMemo(
    () => areAllGroupMatchesDone(groupMatches),
    [groupMatches],
  );
  const knockoutSeeded = useMemo(
    () => isKnockoutSeeded(knockoutMatches),
    [knockoutMatches],
  );

  const { data: groupRankingsData, refetch: refetchGroupRankings } = useQuery<
    GetTournamentGroupRankingsQuery,
    GetTournamentGroupRankingsQueryVariables
  >(GET_TOURNAMENT_GROUP_RANKINGS, {
    variables: { categoryId: activeCategoryId, groupId: activeGroupTab },
    skip:
      !activeCategoryId ||
      !isGroupKnockout ||
      !activeGroupTab ||
      groupMatches.length === 0,
  });

  useEffect(() => {
    if (isGroupKnockout && activeGroupTab && groupMatches.length > 0) {
      void refetchGroupRankings();
    }
  }, [
    isGroupKnockout,
    activeGroupTab,
    groupMatches.length,
    refetchGroupRankings,
  ]);

  const { data: rankingsData } = useQuery<
    GetTournamentRankingsQuery,
    GetTournamentRankingsQueryVariables
  >(GET_TOURNAMENT_RANKINGS, {
    variables: { categoryId: activeCategoryId },
    skip: !activeCategoryId || !isRoundRobin || matches.length === 0,
  });

  const roundsMap = useMemo(() => buildRoundsMap(matches), [matches]);
  const activeGroupMatches = useMemo(
    () => getActiveGroupMatches(groupMatches, activeGroupTab),
    [groupMatches, activeGroupTab],
  );
  const knockoutRoundsMap = useMemo(
    () => buildRoundsMap(knockoutMatches),
    [knockoutMatches],
  );

  const groupCount =
    (activeCategory as { groupCount?: number })?.groupCount ?? 4;
  const advancingPerGroup =
    (activeCategory as { advancingPerGroup?: number })?.advancingPerGroup ?? 2;
  const totalGroupMatches = computeTotalGroupMatches(
    approvedCount ?? 0,
    groupCount,
  );
  const roundRobinMatchCount = computeRoundRobinMatchCount(approvedCount ?? 0);
  const statusBadge = categoryStatusLabel(activeCategory?.status as string);

  return {
    tournamentId,
    categories,
    cLoading,
    refetchCategories,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedGroupTab,
    setSelectedGroupTab,
    resetDialogOpen,
    setResetDialogOpen,
    activeCategoryId,
    activeCategory,
    matches,
    bLoading,
    refetch,
    approvedCount,
    pendingCount,
    effectiveBracketSize,
    expectedByes,
    isRoundRobin,
    isGroupKnockout,
    groupMatches,
    knockoutMatches,
    uniqueGroupIds,
    activeGroupTab,
    allGroupMatchesDone,
    knockoutSeeded,
    groupStandings: groupRankingsData?.tournamentGroupRankings ?? [],
    standings: rankingsData?.tournamentRankings ?? [],
    roundsMap,
    activeGroupMatches,
    knockoutRoundsMap,
    groupCount,
    advancingPerGroup,
    totalGroupMatches,
    roundRobinMatchCount,
    statusBadge,
  };
}

export type DrawPageData = ReturnType<typeof useDrawData>;
