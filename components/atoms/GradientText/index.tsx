'use client';

import { cn } from '@/lib/utils';

export interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

export function GradientText({
  children,
  className,
  from = 'from-violet-500',
  to = 'to-emerald-400',
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        from,
        to,
        className
      )}
    >
      {children}
    </span>
  );
}
