'use client';

import { cn } from '@/lib/utils';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Use the stronger card variant with tinted border */
  card?: boolean;
}

export function GlassPanel({ children, className, card }: GlassPanelProps) {
  return (
    <div
      className={cn(
        card ? 'glass-card' : 'glass-panel',
        'rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
}
