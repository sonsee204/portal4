'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { TOURNAMENT } from '@/lib/strings';
import {
  useTournamentCategories,
  useTournamentBracket,
  useGenerateBracket,
  useResetBracket,
  useRegistrations,
} from '@/hooks/tournament';
import { RegistrationStatus, TournamentFormat } from '@/graphql/generated';
import {
  GET_TOURNAMENT_RANKINGS,
  GET_TOURNAMENT_GROUP_RANKINGS,
} from '@/graphql/queries/tournament';
import { SEED_KNOCKOUT_BRACKET } from '@/graphql/mutations/tournament';
import { IonIcon } from '@/components/atoms/IonIcon';
import { showError } from '@/lib/toast';
import type {
  GetTournamentRankingsQuery,
  GetTournamentRankingsQueryVariables,
  GetTournamentGroupRankingsQuery,
  GetTournamentGroupRankingsQueryVariables,
  SeedKnockoutBracketMutation,
  SeedKnockoutBracketMutationVariables,
} from '@/graphql/generated';

function categoryStatusLabel(status?: string): {
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

export default function DrawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const {
    categories,
    loading: cLoading,
    refetch: refetchCategories,
  } = useTournamentCategories(tournamentId);
  const activeCategoryId = selectedCategoryId || categories[0]?._id || '';
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
  const effectiveBracketSize = (() => {
    if (!approvedCount || approvedCount < 2) return 0;
    let p = 1;
    while (p < approvedCount) p *= 2;
    return categoryBracketSize ? Math.max(categoryBracketSize, p) : p;
  })();
  const expectedByes =
    effectiveBracketSize > 0 ? effectiveBracketSize - (approvedCount ?? 0) : 0;

  useEffect(() => {
    if (!tournamentId || !activeCategoryId) return;
    const unsubscribe = subscribeToMatchUpdates(tournamentId);
    return () => unsubscribe();
  }, [subscribeToMatchUpdates, tournamentId, activeCategoryId]);

  const onSuccess = useCallback(() => {
    void refetch();
    void refetchCategories();
  }, [refetch, refetchCategories]);
  const { generateBracket, loading: generating } = useGenerateBracket({
    onSuccess,
  });
  const { resetBracket, loading: resetting } = useResetBracket({ onSuccess });

  const isLoading = generating || resetting;

  const handleReset = () => setResetDialogOpen(true);
  const handleConfirmReset = () => {
    setResetDialogOpen(false);
    void resetBracket(activeCategoryId);
  };

  const isRoundRobin = activeCategory?.format === TournamentFormat.RoundRobin;
  const isGroupKnockout =
    activeCategory?.format === TournamentFormat.GroupKnockout;

  // GROUP_KNOCKOUT derived state
  const [selectedGroupTab, setSelectedGroupTab] = useState<string>('');
  const groupMatches = useMemo(
    () => matches.filter((m) => m.round < 100),
    [matches]
  );
  const knockoutMatches = useMemo(
    () => matches.filter((m) => m.round >= 100),
    [matches]
  );
  const uniqueGroupIds = useMemo(
    () =>
      [
        ...new Set(
          groupMatches
            .map((m) => m.groupId)
            .filter((g): g is string => Boolean(g))
        ),
      ].sort(),
    [groupMatches]
  );
  const activeGroupTab = selectedGroupTab || uniqueGroupIds[0] || '';

  const allGroupMatchesDone = useMemo(() => {
    if (groupMatches.length === 0) return false;
    return groupMatches.every(
      (m) =>
        m.isBye ||
        ['FINISHED', 'WALKOVER', 'RETIREMENT'].includes(m.status as string)
    );
  }, [groupMatches]);

  const knockoutSeeded = useMemo(() => {
    const r1 = knockoutMatches.filter((m) => m.round === 101);
    return r1.length > 0 && r1.some((m) => m.player1 || m.player2);
  }, [knockoutMatches]);

  const [seedKnockout, { loading: seeding }] = useMutation<
    SeedKnockoutBracketMutation,
    SeedKnockoutBracketMutationVariables
  >(SEED_KNOCKOUT_BRACKET, {
    onCompleted: () => {
      void refetch();
    },
    onError: (err) => showError(err.message),
  });

  // Per-group standings (GROUP_KNOCKOUT)
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
  const groupStandings = groupRankingsData?.tournamentGroupRankings ?? [];

  // Refetch group rankings when active group tab changes or matches update
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

  // Round-robin standings
  const { data: rankingsData } = useQuery<
    GetTournamentRankingsQuery,
    GetTournamentRankingsQueryVariables
  >(GET_TOURNAMENT_RANKINGS, {
    variables: { categoryId: activeCategoryId },
    skip: !activeCategoryId || !isRoundRobin || matches.length === 0,
  });
  const standings = rankingsData?.tournamentRankings ?? [];

  const roundsMap = useMemo(() => {
    const map = new Map<number, typeof matches>();
    for (const m of matches) {
      const arr = map.get(m.round) ?? [];
      arr.push(m);
      map.set(m.round, arr);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [matches]);

  // GROUP_KNOCKOUT: matches for the active group tab
  const activeGroupMatches = useMemo(
    () =>
      groupMatches
        .filter((m) => m.groupId === activeGroupTab)
        .sort(
          (a, b) => a.round - b.round || a.bracketPosition! - b.bracketPosition!
        ),
    [groupMatches, activeGroupTab]
  );

  const knockoutRoundsMap = useMemo(() => {
    const map = new Map<number, typeof matches>();
    for (const m of knockoutMatches) {
      const arr = map.get(m.round) ?? [];
      arr.push(m);
      map.set(m.round, arr);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [knockoutMatches]);

  // Expected group-stage matches for GROUP_KNOCKOUT stats
  const groupCount =
    (activeCategory as { groupCount?: number })?.groupCount ?? 4;
  const advancingPerGroup =
    (activeCategory as { advancingPerGroup?: number })?.advancingPerGroup ?? 2;
  const groupMatchesPerGroup = Math.floor(
    (Math.ceil((approvedCount ?? 0) / groupCount) *
      (Math.ceil((approvedCount ?? 0) / groupCount) - 1)) /
      2
  );
  const totalGroupMatches = groupMatchesPerGroup * groupCount;

  const statusBadge = categoryStatusLabel(activeCategory?.status as string);

  if (cLoading) {
    return (
      <GlassPanel card>
        <div className="flex items-center justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </GlassPanel>
    );
  }

  return (
    <>
      <PageHeader
        title={TOURNAMENT.LABEL_DRAW}
        description="Quản lý bốc thăm và xếp hạt giống cho từng nội dung."
      >
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/tournaments')}
        >
          Quay lại
        </Button>
      </PageHeader>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const badge = categoryStatusLabel(cat.status as string);
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategoryId(cat._id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategoryId === cat._id
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-secondary hover:text-primary'
              }`}
            >
              {cat.title}
              {badge && activeCategoryId !== cat._id && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${badge.className}`}
                >
                  {badge.text}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {statusBadge && (
        <div className="mt-3">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBadge.className}`}
          >
            {statusBadge.text}
          </span>
        </div>
      )}

      {activeCategoryId && (approvedCount ?? 0) > 0 && matches.length === 0 && (
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          <div className="bg-surface-elevated rounded-lg px-3 py-2">
            <span className="text-secondary">VĐV đã duyệt:</span>{' '}
            <span className="text-heading font-semibold">{approvedCount}</span>
          </div>
          {isGroupKnockout ? (
            <>
              <div className="bg-surface-elevated rounded-lg px-3 py-2">
                <span className="text-secondary">Số bảng:</span>{' '}
                <span className="text-heading font-semibold">{groupCount}</span>
              </div>
              <div className="bg-surface-elevated rounded-lg px-3 py-2">
                <span className="text-secondary">VĐV đi tiếp / bảng:</span>{' '}
                <span className="text-heading font-semibold">
                  {advancingPerGroup}
                </span>
              </div>
              <div className="bg-surface-elevated rounded-lg px-3 py-2">
                <span className="text-secondary">Tổng trận vòng bảng:</span>{' '}
                <span className="text-heading font-semibold">
                  ~{totalGroupMatches}
                </span>
              </div>
            </>
          ) : isRoundRobin ? (
            <div className="bg-surface-elevated rounded-lg px-3 py-2">
              <span className="text-secondary">Tổng số trận:</span>{' '}
              <span className="text-heading font-semibold">
                {Math.floor(
                  ((approvedCount ?? 0) * ((approvedCount ?? 0) - 1)) / 2
                )}
              </span>
            </div>
          ) : (
            <>
              <div className="bg-surface-elevated rounded-lg px-3 py-2">
                <span className="text-secondary">Nhánh đấu:</span>{' '}
                <span className="text-heading font-semibold">
                  {effectiveBracketSize} slot
                </span>
              </div>
              <div className="bg-surface-elevated rounded-lg px-3 py-2">
                <span className="text-secondary">Số BYE dự kiến:</span>{' '}
                <span className="text-heading font-semibold">
                  {expectedByes}
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {pendingCount > 0 && matches.length === 0 && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-4 py-2">
          <IonIcon
            name="warning-outline"
            size="sm"
            className="mt-0.5 shrink-0 text-amber-500"
          />
          <span className="text-xs text-amber-600 dark:text-amber-400">
            Có {pendingCount} đăng ký chưa duyệt. Chỉ những VĐV đã duyệt mới
            được xếp vào bảng đấu.
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          size="sm"
          disabled={isLoading || !activeCategoryId || matches.length > 0}
          onClick={() => void generateBracket(activeCategoryId)}
        >
          {generating
            ? 'Đang tạo...'
            : isGroupKnockout
              ? 'Tạo bảng đấu'
              : isRoundRobin
                ? 'Tạo lịch đấu vòng tròn'
                : 'Tạo nhánh đấu'}
        </Button>

        {isGroupKnockout &&
          allGroupMatchesDone &&
          !knockoutSeeded &&
          matches.length > 0 && (
            <Button
              size="sm"
              variant="primary"
              iconLeft="git-branch-outline"
              disabled={seeding}
              onClick={() =>
                void seedKnockout({
                  variables: { categoryId: activeCategoryId },
                })
              }
            >
              {seeding ? 'Đang xếp...' : 'Xếp VĐV vào vòng loại trực tiếp'}
            </Button>
          )}

        {matches.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isLoading}
            onClick={handleReset}
            className="text-red-400"
          >
            {isGroupKnockout
              ? 'Xoá bảng đấu'
              : isRoundRobin
                ? 'Xoá lịch đấu'
                : 'Xoá nhánh đấu'}
          </Button>
        )}
      </div>

      <div className="mt-6 space-y-6">
        {bLoading ? (
          <GlassPanel card>
            <div className="flex items-center justify-center py-12">
              <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </GlassPanel>
        ) : matches.length === 0 ? (
          <GlassPanel card>
            <div className="py-12 text-center">
              <p className="text-secondary">
                {isGroupKnockout
                  ? 'Chưa có bảng đấu. Hãy tạo bảng đấu để bắt đầu.'
                  : isRoundRobin
                    ? 'Chưa có lịch đấu. Hãy tạo lịch đấu vòng tròn để bắt đầu.'
                    : 'Chưa có nhánh đấu. Hãy tạo nhánh đấu để bắt đầu.'}
              </p>
            </div>
          </GlassPanel>
        ) : isGroupKnockout ? (
          // ── GROUP_KNOCKOUT: two-phase display ──
          <>
            {/* Phase 1: Group Stage */}
            <GlassPanel card>
              <div className="mb-4 flex items-center gap-2">
                <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
                  <IonIcon
                    name="grid-outline"
                    size="sm"
                    className="text-primary"
                  />
                </div>
                <h3 className="text-heading text-sm font-bold">Vòng bảng</h3>
                {allGroupMatchesDone && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                    Hoàn thành
                  </span>
                )}
              </div>

              {/* Group tabs */}
              {uniqueGroupIds.length > 0 && (
                <div className="mb-4 flex gap-2">
                  {uniqueGroupIds.map((gId) => (
                    <button
                      key={gId}
                      onClick={() => setSelectedGroupTab(gId)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                        activeGroupTab === gId
                          ? 'bg-primary text-white'
                          : 'bg-surface-elevated text-secondary hover:text-primary'
                      }`}
                    >
                      Bảng {gId}
                    </button>
                  ))}
                </div>
              )}

              {/* Active group matches */}
              {activeGroupMatches.length > 0 ? (
                <div className="space-y-2">
                  {activeGroupMatches.map((m) => (
                    <div
                      key={m._id}
                      className="bg-bg-secondary flex items-center justify-between rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-secondary font-mono text-xs">
                          #{m.matchNumber}
                        </span>
                        <span className="text-heading text-sm font-medium">
                          {m.player1?.name ?? 'TBD'}
                        </span>
                        <span className="text-secondary text-xs">vs</span>
                        <span className="text-heading text-sm font-medium">
                          {m.player2?.name ?? 'TBD'}
                        </span>
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          ['FINISHED', 'WALKOVER', 'RETIREMENT'].includes(
                            m.status as string
                          )
                            ? 'text-emerald-500'
                            : m.status === 'LIVE'
                              ? 'text-primary'
                              : 'text-secondary'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-sm">
                  Không có trận nào trong Bảng {activeGroupTab}
                </p>
              )}

              {/* Per-group standings */}
              {groupStandings.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-heading mb-2 flex items-center gap-2 text-xs font-semibold">
                    <IonIcon
                      name="podium-outline"
                      size="sm"
                      className="text-primary"
                    />
                    Bảng xếp hạng — Bảng {activeGroupTab}
                    <span className="text-muted font-normal">
                      (top {advancingPerGroup} đi tiếp)
                    </span>
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-surface-border border-b">
                          <th className="text-secondary py-2 pr-3 text-left font-medium">
                            #
                          </th>
                          <th className="text-secondary py-2 pr-3 text-left font-medium">
                            VĐV
                          </th>
                          <th className="text-secondary py-2 pr-3 text-center font-medium">
                            ĐT
                          </th>
                          <th className="text-secondary py-2 pr-3 text-center font-medium">
                            T
                          </th>
                          <th className="text-secondary py-2 pr-3 text-center font-medium">
                            B
                          </th>
                          <th className="text-secondary py-2 pr-3 text-center font-medium">
                            Điểm
                          </th>
                          <th className="text-secondary py-2 text-center font-medium">
                            Hiệu set
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupStandings.map((row, i) => (
                          <tr
                            key={row.registrationId}
                            className={`border-surface-border border-b last:border-0 ${
                              i < advancingPerGroup ? 'bg-emerald-500/5' : ''
                            }`}
                          >
                            <td className="py-2 pr-3">
                              <span
                                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                                  i < advancingPerGroup
                                    ? 'bg-emerald-500/20 text-emerald-500'
                                    : 'text-secondary'
                                }`}
                              >
                                {i + 1}
                              </span>
                            </td>
                            <td className="text-heading py-2 pr-3">
                              {row.playerName}
                            </td>
                            <td className="text-secondary py-2 pr-3 text-center">
                              {row.matchesPlayed}
                            </td>
                            <td className="py-2 pr-3 text-center text-emerald-500">
                              {row.matchesWon}
                            </td>
                            <td className="py-2 pr-3 text-center text-red-400">
                              {row.matchesLost}
                            </td>
                            <td className="text-heading py-2 pr-3 text-center font-semibold">
                              {row.groupPoints}
                            </td>
                            <td className="text-secondary py-2 text-center">
                              {row.setsWon - row.setsLost >= 0 ? '+' : ''}
                              {row.setsWon - row.setsLost}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </GlassPanel>

            {/* Phase 2: Knockout Stage */}
            {knockoutMatches.length > 0 && (
              <GlassPanel card>
                <div className="mb-4 flex items-center gap-2">
                  <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
                    <IonIcon
                      name="git-branch-outline"
                      size="sm"
                      className="text-primary"
                    />
                  </div>
                  <h3 className="text-heading text-sm font-bold">
                    Vòng loại trực tiếp
                  </h3>
                  {knockoutSeeded ? (
                    <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                      Đã xếp VĐV
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                      Chờ xếp VĐV
                    </span>
                  )}
                </div>

                {!knockoutSeeded && !allGroupMatchesDone && (
                  <p className="text-secondary text-sm">
                    Hoàn thành tất cả trận vòng bảng để xếp VĐV vào vòng loại
                    trực tiếp.
                  </p>
                )}

                {knockoutSeeded && (
                  <div className="space-y-4">
                    {knockoutRoundsMap.map(([roundNum, roundMatches]) => (
                      <div key={roundNum}>
                        <h4 className="text-secondary mb-2 text-xs font-semibold">
                          {roundMatches[0]?.roundLabel ??
                            `Vòng ${roundNum - 100}`}
                        </h4>
                        <div className="space-y-2">
                          {roundMatches.map((m) => (
                            <div
                              key={m._id}
                              className="bg-bg-secondary flex items-center justify-between rounded-lg px-4 py-3"
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-secondary font-mono text-xs">
                                  #{m.matchNumber}
                                </span>
                                <span className="text-heading text-sm font-medium">
                                  {m.player1?.name ?? 'TBD'}
                                </span>
                                <span className="text-secondary text-xs">
                                  vs
                                </span>
                                <span className="text-heading text-sm font-medium">
                                  {m.player2?.name ?? 'TBD'}
                                </span>
                              </div>
                              <span
                                className={`text-xs font-medium ${m.isBye ? 'text-yellow-400' : 'text-secondary'}`}
                              >
                                {m.isBye ? 'BYE' : m.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassPanel>
            )}
          </>
        ) : (
          // ── ROUND_ROBIN / SINGLE_ELIMINATION ──
          <>
            <div className="space-y-4">
              {roundsMap.map(([roundNum, roundMatches]) => (
                <GlassPanel key={roundNum} card>
                  <h3 className="text-heading mb-3 text-sm font-bold">
                    {isRoundRobin
                      ? (roundMatches[0]?.roundLabel ?? `Lượt ${roundNum}`)
                      : (roundMatches[0]?.roundLabel ?? `Vòng ${roundNum}`)}
                  </h3>
                  <div className="space-y-2">
                    {roundMatches.map((m) => (
                      <div
                        key={m._id}
                        className="bg-bg-secondary flex items-center justify-between rounded-lg px-4 py-3"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-secondary font-mono text-xs">
                            #{m.matchNumber}
                          </span>
                          <span className="text-heading text-sm font-medium">
                            {m.player1?.name ?? 'TBD'}
                          </span>
                          <span className="text-secondary text-xs">vs</span>
                          <span className="text-heading text-sm font-medium">
                            {m.player2?.name ?? 'TBD'}
                          </span>
                        </div>
                        <span
                          className={`text-xs font-medium ${m.isBye ? 'text-yellow-400' : 'text-secondary'}`}
                        >
                          {m.isBye ? 'BYE' : m.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassPanel>
              ))}
            </div>

            {isRoundRobin && standings.length > 0 && (
              <GlassPanel card>
                <h3 className="text-heading mb-3 flex items-center gap-2 text-sm font-bold">
                  <IonIcon
                    name="podium-outline"
                    size="sm"
                    className="text-primary"
                  />
                  Bảng xếp hạng tạm thời
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-surface-border border-b">
                        <th className="text-secondary py-2 pr-3 text-left font-medium">
                          #
                        </th>
                        <th className="text-secondary py-2 pr-3 text-left font-medium">
                          VĐV
                        </th>
                        <th className="text-secondary py-2 pr-3 text-center font-medium">
                          ĐT
                        </th>
                        <th className="text-secondary py-2 pr-3 text-center font-medium">
                          T
                        </th>
                        <th className="text-secondary py-2 pr-3 text-center font-medium">
                          B
                        </th>
                        <th className="text-secondary py-2 pr-3 text-center font-medium">
                          Điểm
                        </th>
                        <th className="text-secondary py-2 text-center font-medium">
                          Tỉ lệ T
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.map((row, i) => (
                        <tr
                          key={row.registrationId}
                          className={`border-surface-border border-b last:border-0 ${i < 3 ? 'font-medium' : ''}`}
                        >
                          <td className="py-2 pr-3">
                            <span
                              className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                                i === 0
                                  ? 'bg-yellow-500/20 text-yellow-500'
                                  : i === 1
                                    ? 'bg-slate-400/20 text-slate-400'
                                    : i === 2
                                      ? 'bg-orange-600/20 text-orange-500'
                                      : 'text-secondary'
                              }`}
                            >
                              {row.rank}
                            </span>
                          </td>
                          <td className="text-heading py-2 pr-3">
                            {row.playerName}
                          </td>
                          <td className="text-secondary py-2 pr-3 text-center">
                            {row.matchesPlayed}
                          </td>
                          <td className="py-2 pr-3 text-center text-emerald-500">
                            {row.matchesWon}
                          </td>
                          <td className="py-2 pr-3 text-center text-red-400">
                            {row.matchesLost}
                          </td>
                          <td className="text-heading py-2 pr-3 text-center font-semibold">
                            {row.groupPoints}
                          </td>
                          <td className="text-secondary py-2 text-center">
                            {row.winRate != null
                              ? `${Math.round(row.winRate * 100)}%`
                              : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassPanel>
            )}
          </>
        )}
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleConfirmReset}
        title={
          isGroupKnockout
            ? 'Xoá bảng đấu'
            : isRoundRobin
              ? 'Xoá lịch đấu'
              : 'Xoá nhánh đấu'
        }
        description={TOURNAMENT.CONFIRM_RESET_BRACKET}
        confirmLabel={
          isGroupKnockout
            ? 'Xoá bảng đấu'
            : isRoundRobin
              ? 'Xoá lịch đấu'
              : 'Xoá nhánh đấu'
        }
        variant="danger"
        loading={resetting}
      />
    </>
  );
}
