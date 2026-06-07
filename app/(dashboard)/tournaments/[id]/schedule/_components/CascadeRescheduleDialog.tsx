'use client';

import { useMemo, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { MatchStatus, type TournamentMatch } from '@/graphql/generated';

interface CascadeRescheduleDialogProps {
  open: boolean;
  anchorMatch: TournamentMatch | null;
  allMatches: TournamentMatch[];
  onConfirm: (matchId: string, shiftMinutes: number) => void;
  onDismiss: () => void;
  loading?: boolean;
}

export function CascadeRescheduleDialog({
  open,
  anchorMatch,
  allMatches,
  onConfirm,
  onDismiss,
  loading,
}: CascadeRescheduleDialogProps) {
  const [shift, setShift] = useState(15);

  const affected = useMemo(() => {
    if (!anchorMatch?.court?.name || !anchorMatch.scheduledAt) return [];
    const anchorMs = new Date(anchorMatch.scheduledAt).getTime();
    return allMatches.filter(
      (m) =>
        m._id !== anchorMatch._id &&
        m.court?.name === anchorMatch.court?.name &&
        m.scheduledAt &&
        new Date(m.scheduledAt).getTime() > anchorMs &&
        m.status === MatchStatus.NotStarted
    );
  }, [anchorMatch, allMatches]);

  if (!open || !anchorMatch) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <GlassPanel card className="w-full max-w-md p-5">
        <h2 className="text-heading text-base font-bold">Dịch đều lịch sân</h2>
        <p className="text-secondary mt-1 text-sm">
          Trận #{anchorMatch.matchNumber} · {anchorMatch.court?.name}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <label className="text-secondary text-sm">
            Phút (+ muộn / − sớm)
          </label>
          <input
            type="number"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value, 10) || 0)}
            className="border-surface-border bg-surface-elevated text-heading w-24 rounded-lg border px-2 py-1 text-sm"
          />
        </div>

        <p className="text-secondary mt-3 text-sm">
          {affected.length} trận sau trên cùng sân sẽ bị dịch.
        </p>

        <div className="mt-5 flex gap-2">
          <Button
            className="flex-1"
            onClick={() => onConfirm(anchorMatch._id, shift)}
            disabled={loading || shift === 0 || affected.length === 0}
          >
            Xác nhận
          </Button>
          <Button variant="ghost" onClick={onDismiss}>
            Huỷ
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
