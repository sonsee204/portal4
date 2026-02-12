'use client';

import { cn } from '@/lib/utils';
import { badgeVariants, type BadgeVariant } from '@/config/theme';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  /** Show an animated pulse dot before the text */
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  dot,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        badgeVariants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full',
            variant === 'live' || variant === 'success'
              ? 'animate-pulse bg-emerald-400'
              : variant === 'warning'
                ? 'animate-pulse bg-amber-400'
                : variant === 'danger'
                  ? 'bg-red-400'
                  : variant === 'info'
                    ? 'bg-blue-400'
                    : 'bg-current'
          )}
        />
      )}
      {children}
    </span>
  );
}
