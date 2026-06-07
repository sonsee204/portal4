'use client';

import { cn } from '@/lib/utils';
import type { DropSeverity } from '@/lib/tournament/validate-schedule-drop';

const SEVERITY_RING: Record<DropSeverity, string> = {
  ok: 'ring-2 ring-emerald-500/40',
  warn: 'ring-2 ring-amber-500/40',
  block: 'ring-2 ring-red-500/40',
};

interface ScheduleCourtDropHighlightProps {
  severity: DropSeverity;
  isActive: boolean;
}

export function ScheduleCourtDropHighlight({
  severity,
  isActive,
}: ScheduleCourtDropHighlightProps) {
  if (!isActive) return null;
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-10 rounded-sm transition-shadow',
        SEVERITY_RING[severity],
        severity === 'ok' && 'bg-emerald-500/5',
        severity === 'warn' && 'bg-amber-500/5',
        severity === 'block' && 'bg-red-500/5',
      )}
      aria-hidden
    />
  );
}
