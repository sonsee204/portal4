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

import { useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import {
  useOrganizerCorrectLiveScore,
  useOrganizerAbortLiveMatch,
  useCorrectFinishedMatchResult,
  useOrganizerResetFinishedMatch,
} from '@/hooks/tournament';
import type { TournamentMatch } from '@/graphql/generated';
import {
  MatchStatus,
  OrganizerCorrectLiveScoreMode,
} from '@/graphql/generated';

const ENDED = new Set([
  MatchStatus.Finished,
  MatchStatus.Walkover,
  MatchStatus.Retirement,
  MatchStatus.Cancelled,
]);

const RESET_ELIGIBLE = new Set([
  MatchStatus.Finished,
  MatchStatus.Walkover,
  MatchStatus.Retirement,
]);

interface MatchCorrectionModalProps {
  match: TournamentMatch | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function MatchCorrectionModal({
  match,
  onClose,
  onSuccess,
}: MatchCorrectionModalProps) {
  const [reason, setReason] = useState('');
  const [setLines, setSetLines] = useState('');
  const [winner, setWinner] = useState<1 | 2>(1);
  const [confirmReset, setConfirmReset] = useState(false);

  const refresh = () => {
    onSuccess();
    onClose();
    setReason('');
    setConfirmReset(false);
  };

  const { correctLiveScore, loading: correcting } =
    useOrganizerCorrectLiveScore({ onSuccess: refresh });
  const { abortLiveMatch, loading: aborting } = useOrganizerAbortLiveMatch({
    onSuccess: refresh,
  });
  const { correctFinishedResult, loading: fixing } =
    useCorrectFinishedMatchResult({ onSuccess: refresh });
  const { resetFinishedMatch, loading: resetting } =
    useOrganizerResetFinishedMatch({ onSuccess: refresh });

  const loading = correcting || aborting || fixing || resetting;
  const reasonOk = reason.trim().length >= 10;

  if (!match) return null;

  const isLive = match.status === MatchStatus.Live;
  const isEnded = ENDED.has(match.status);
  const canReset = RESET_ELIGIBLE.has(match.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <GlassPanel card className="w-full max-w-md space-y-4 p-6">
        <h3 className="text-heading text-lg font-bold">
          Hiệu chỉnh trận #{match.matchNumber}
        </h3>
        <p className="text-secondary text-sm">
          {match.player1?.name ?? 'TBD'} vs {match.player2?.name ?? 'TBD'}
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder="Lý do (tối thiểu 10 ký tự)"
          className="border-surface-border bg-surface text-heading w-full rounded-lg border px-3 py-2 text-sm"
        />

        {isLive && (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={loading || !reasonOk}
              onClick={() =>
                void correctLiveScore({
                  matchId: match._id,
                  reason: reason.trim(),
                  mode: OrganizerCorrectLiveScoreMode.UndoPoints,
                  undoCount: 1,
                })
              }
            >
              Hoàn tác 1 điểm
            </Button>
            <Button
              size="sm"
              variant="danger"
              disabled={loading || !reasonOk}
              onClick={() =>
                void abortLiveMatch({
                  matchId: match._id,
                  reason: reason.trim(),
                })
              }
            >
              Huỷ trận LIVE
            </Button>
          </div>
        )}

        {isEnded && (
          <div className="space-y-3">
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-600 dark:text-red-400">
              Chỉ thao tác được khi trận vòng sau chưa bắt đầu.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {([1, 2] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setWinner(p)}
                  className={`rounded-lg border px-2 py-1.5 text-sm ${
                    winner === p
                      ? 'border-primary text-primary'
                      : 'border-surface-border text-secondary'
                  }`}
                >
                  VĐV {p} thắng
                </button>
              ))}
            </div>
            <textarea
              value={setLines}
              onChange={(e) => setSetLines(e.target.value)}
              rows={3}
              placeholder="Tỉ số từng set: 21-15"
              className="border-surface-border bg-surface text-heading w-full rounded-lg border px-3 py-2 font-mono text-sm"
            />
            <Button
              size="sm"
              variant="primary"
              className="w-full"
              disabled={loading || !reasonOk}
              onClick={() => {
                const setScores = setLines
                  .split('\n')
                  .map((l) => l.trim())
                  .filter(Boolean)
                  .map((line) => {
                    const [a, b] = line
                      .split(/[-:,\s]+/)
                      .map((n) => parseInt(n, 10));
                    return [
                      Number.isFinite(a) ? a : 0,
                      Number.isFinite(b) ? b : 0,
                    ];
                  });
                void correctFinishedResult({
                  matchId: match._id,
                  winner,
                  reason: reason.trim(),
                  setScores: setScores.length ? setScores : undefined,
                  expectedMatchUpdatedAt: match.updatedAt,
                });
              }}
            >
              Sửa kết quả
            </Button>

            {canReset && (
              <div className="space-y-2 border-t border-red-500/20 pt-3">
                {!confirmReset ? (
                  <Button
                    size="sm"
                    variant="danger"
                    className="w-full"
                    disabled={loading}
                    onClick={() => setConfirmReset(true)}
                  >
                    Reset trận — đấu lại từ đầu
                  </Button>
                ) : (
                  <div className="space-y-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                    <p className="text-xs leading-relaxed text-red-600 dark:text-red-400">
                      Trận sẽ về chưa bắt đầu, bảng điểm bị xoá và VĐV được gỡ
                      khỏi vòng sau. Không thể hoàn tác.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1"
                        disabled={loading}
                        onClick={() => setConfirmReset(false)}
                      >
                        Huỷ
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        disabled={loading || !reasonOk}
                        onClick={() =>
                          void resetFinishedMatch({
                            matchId: match._id,
                            reason: reason.trim(),
                            expectedMatchUpdatedAt: match.updatedAt,
                          })
                        }
                      >
                        Xác nhận reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button size="sm" variant="ghost" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
