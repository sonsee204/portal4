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

import { use, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TOURNAMENT } from '@/lib/strings';
import {
  useMatchScorecard,
  useScorePoint,
  useUndoPoint,
  useTournament,
} from '@/hooks/tournament';
import { webTournamentManageUrl } from '@/lib/tournaments/web-urls';
import { TournamentPageSupportShell } from '@/components/molecules/TournamentPageSupportShell';

export default function ScoringPage({
  params,
}: {
  params: Promise<{ id: string; matchId: string }>;
}) {
  const { id: tournamentId, matchId } = use(params);
  const router = useRouter();
  const { tournament } = useTournament(tournamentId);

  const { scorecard, loading, subscribeToScoreUpdates } =
    useMatchScorecard(matchId);
  const { scorePoint, loading: scoring } = useScorePoint();
  const { undoPoint, loading: undoing } = useUndoPoint();

  const refereeSetupUrl = webTournamentManageUrl(
    tournamentId,
    'scoring',
    matchId
  );

  useEffect(() => {
    const unsubscribe = subscribeToScoreUpdates();
    return () => unsubscribe();
  }, [subscribeToScoreUpdates]);

  const handleScore = useCallback(
    (player: number) => {
      void scorePoint({ matchId, scoringPlayer: player });
    },
    [matchId, scorePoint]
  );

  const handleUndo = useCallback(() => {
    void undoPoint(matchId);
  }, [matchId, undoPoint]);

  const isActionLoading = scoring || undoing;

  if (loading) {
    return (
      <TournamentPageSupportShell tournament={tournament}>
        <GlassPanel card>
          <div className="flex items-center justify-center py-20">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        </GlassPanel>
      </TournamentPageSupportShell>
    );
  }

  if (!scorecard) {
    return (
      <TournamentPageSupportShell tournament={tournament}>
        <>
          <PageHeader
            title={TOURNAMENT.LABEL_SCORING}
            description="Chuẩn bị trận & tung đồng xu"
          >
            <Button
              variant="ghost"
              size="sm"
              iconLeft="arrow-back-outline"
              onClick={() => router.back()}
            >
              Quay lại
            </Button>
          </PageHeader>
          <GlassPanel card className="mt-6">
            <div className="space-y-4 py-12 text-center">
              <p className="text-secondary">
                Trận chưa bắt đầu. Mở màn chấm điểm trọng tài trên Ao Trình để
                tung đồng xu và chọn giao cầu.
              </p>
              <Button
                size="sm"
                iconLeft="open-outline"
                onClick={() => {
                  window.open(refereeSetupUrl, '_blank', 'noopener,noreferrer');
                }}
              >
                Mở màn chấm điểm trọng tài
              </Button>
            </div>
          </GlassPanel>
        </>
      </TournamentPageSupportShell>
    );
  }

  const currentSet = scorecard.sets[scorecard.currentSetIndex];

  return (
    <TournamentPageSupportShell tournament={tournament}>
      <>
        <PageHeader
          title={`Trận đấu #${matchId.slice(-4)}`}
          description={`${scorecard.status} • Set ${scorecard.currentSetIndex + 1}/${scorecard.bestOf}`}
        >
          <Button
            variant="ghost"
            size="sm"
            iconLeft="arrow-back-outline"
            onClick={() => router.back()}
          >
            Quay lại
          </Button>
        </PageHeader>

        <div className="mt-6 space-y-6">
          <GlassPanel card>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {scorecard.sets.map((set) => (
                  <div
                    key={set.setNumber}
                    className="bg-bg-secondary rounded-lg px-3 py-2 text-center"
                  >
                    <div className="text-secondary text-[10px] uppercase">
                      Set {set.setNumber}
                    </div>
                    <div className="text-heading text-lg font-bold">
                      {set.player1Score}-{set.player2Score}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-secondary text-xs">Trạng thái</div>
                <div className="text-heading font-semibold">
                  {scorecard.status}
                </div>
              </div>
            </div>
          </GlassPanel>

          {currentSet && (
            <GlassPanel card>
              <div className="text-center">
                <div className="text-secondary mb-2 text-sm">Set hiện tại</div>
                <div className="text-heading text-5xl font-bold tracking-wider">
                  {currentSet.player1Score} - {currentSet.player2Score}
                </div>
                {scorecard.servingPlayer && (
                  <div className="text-secondary mt-2 text-xs">
                    Đang giao: VĐV {scorecard.servingPlayer}
                  </div>
                )}
              </div>
            </GlassPanel>
          )}

          {scorecard.status !== 'FINISHED' && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                size="lg"
                disabled={isActionLoading}
                onClick={() => handleScore(1)}
                className="h-24 text-xl"
              >
                VĐV 1
              </Button>
              <Button
                size="lg"
                variant="outline"
                disabled={isActionLoading}
                onClick={() => handleScore(2)}
                className="h-24 text-xl"
              >
                VĐV 2
              </Button>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              disabled={isActionLoading || scorecard.pointHistory.length === 0}
              onClick={handleUndo}
            >
              Hoàn tác điểm cuối
            </Button>
          </div>

          <GlassPanel card>
            <h3 className="text-heading mb-3 text-sm font-bold">
              Lịch sử điểm
            </h3>
            {scorecard.pointHistory.length === 0 ? (
              <p className="text-secondary text-sm">Chưa có điểm nào.</p>
            ) : (
              <div className="max-h-60 space-y-1 overflow-y-auto">
                {[...scorecard.pointHistory].reverse().map((point) => (
                  <div
                    key={point.id}
                    className="bg-bg-secondary flex items-center justify-between rounded px-3 py-2 text-xs"
                  >
                    <span className="text-secondary">
                      Set {point.setNumber}
                    </span>
                    <span className="text-heading font-medium">
                      VĐV {point.scoringPlayer} ghi điểm
                    </span>
                    <span className="text-secondary">
                      {point.scoreAfter.join('-')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassPanel>
        </div>
      </>
    </TournamentPageSupportShell>
  );
}
