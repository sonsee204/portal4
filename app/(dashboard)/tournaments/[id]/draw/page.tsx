'use client';

import { use, useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
} from '@/hooks/tournament';

function categoryStatusLabel(status?: string): {
  text: string;
  className: string;
} | null {
  switch (status) {
    case 'DRAW_PENDING':
      return {
        text: 'Chờ bốc thăm',
        className: 'bg-amber-500/10 text-amber-400',
      };
    case 'DRAW_COMPLETED':
      return {
        text: 'Đã bốc thăm',
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

  const roundsMap = useMemo(() => {
    const map = new Map<number, typeof matches>();
    for (const m of matches) {
      const arr = map.get(m.round) ?? [];
      arr.push(m);
      map.set(m.round, arr);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, [matches]);

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

      <div className="mt-4 flex items-center gap-3">
        <Button
          size="sm"
          disabled={
            isLoading ||
            !activeCategoryId ||
            matches.length > 0 /* đã có bảng đấu */
          }
          onClick={() => void generateBracket(activeCategoryId)}
        >
          {generating ? 'Đang tạo...' : 'Tạo nhánh đấu'}
        </Button>
        {matches.length > 0 && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isLoading}
            onClick={handleReset}
            className="text-red-400"
          >
            Xoá nhánh đấu
          </Button>
        )}
      </div>

      <div className="mt-6">
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
                Chưa có nhánh đấu. Hãy tạo nhánh đấu để bắt đầu.
              </p>
            </div>
          </GlassPanel>
        ) : (
          <div className="space-y-4">
            {roundsMap.map(([roundNum, roundMatches]) => (
              <GlassPanel key={roundNum} card>
                <h3 className="text-heading mb-3 text-sm font-bold">
                  {roundMatches[0]?.roundLabel ?? `Vòng ${roundNum}`}
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
        )}
      </div>

      <ConfirmDialog
        open={resetDialogOpen}
        onClose={() => setResetDialogOpen(false)}
        onConfirm={handleConfirmReset}
        title="Xoá nhánh đấu"
        description={TOURNAMENT.CONFIRM_RESET_BRACKET}
        confirmLabel="Xoá nhánh đấu"
        variant="danger"
        loading={resetting}
      />
    </>
  );
}
