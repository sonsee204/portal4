'use client';

import { cn } from '@/lib/utils';
import { progressVariants, type ProgressVariant } from '@/config/theme';

export interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  showLabel = false,
  animated = false,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs">
          <span className="text-muted">{`${Math.round(pct)}%`}</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-500',
            progressVariants[variant],
            animated && 'animate-pulse'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
