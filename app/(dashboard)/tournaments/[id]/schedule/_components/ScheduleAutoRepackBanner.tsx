'use client';

import { Button } from '@/components/atoms/Button';
import type { PortalAutoRepackShift } from '@/lib/tournament/detect-schedule-auto-repack';

export type { PortalAutoRepackShift };

export function ScheduleAutoRepackBanner({
  open,
  courtLabels,
  shifts,
  onDismiss,
}: {
  open: boolean;
  courtLabels: string[];
  shifts: PortalAutoRepackShift[];
  onDismiss: () => void;
}) {
  if (!open || shifts.length === 0) return null;

  const courtList = courtLabels.slice(0, 3).join(', ');

  return (
    <div className="border-primary/30 bg-primary/10 mt-4 rounded-xl border p-4">
      <p className="text-heading text-sm font-semibold">
        Lịch{courtList ? ` ${courtList}` : ''} đã được dồn tự động —{' '}
        {shifts.length} trận đổi giờ
      </p>
      <ul className="text-secondary mt-2 space-y-1 text-xs">
        {shifts.slice(0, 3).map((s) => (
          <li key={s.matchId}>
            #{s.matchNumber} ({s.courtLabel}):{' '}
            <span className="line-through">{s.oldLabel}</span> →{' '}
            <span className="text-primary font-medium">{s.newLabel}</span>
          </li>
        ))}
      </ul>
      <Button variant="ghost" size="sm" className="mt-3" onClick={onDismiss}>
        Đóng
      </Button>
    </div>
  );
}
