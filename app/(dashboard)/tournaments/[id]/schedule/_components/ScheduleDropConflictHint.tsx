'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import type { DropSeverity } from '@/lib/tournament/validate-schedule-drop';

interface ScheduleDropConflictHintProps {
  severity: DropSeverity;
  messages: string[];
}

export function ScheduleDropConflictHint({
  severity,
  messages,
}: ScheduleDropConflictHintProps) {
  if (messages.length === 0) return null;

  const colorClass =
    severity === 'block'
      ? 'border-red-500/35 bg-red-500/10 text-red-700 dark:text-red-300'
      : severity === 'warn'
        ? 'border-amber-500/35 bg-amber-500/10 text-amber-800 dark:text-amber-300'
        : 'border-emerald-500/35 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';

  return (
    <div
      className={`border-surface-border bg-surface pointer-events-none fixed bottom-6 left-1/2 z-[100] flex max-w-md -translate-x-1/2 items-start gap-2 rounded-xl border px-3 py-2 shadow-lg ${colorClass}`}
      role="status"
      aria-live="polite"
    >
      <IonIcon name="alert-circle-outline" size="sm" className="mt-0.5 shrink-0" />
      <p className="text-xs leading-snug">{messages[0]}</p>
    </div>
  );
}
