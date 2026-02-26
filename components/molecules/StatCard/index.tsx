'use client';

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Badge } from '@/components/atoms/Badge';
import type { BadgeVariant } from '@/config/theme';

export interface StatCardProps {
  icon: string;
  iconColor?: string;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
  className?: string;
}

const trendIcons = {
  up: 'trending-up-outline',
  down: 'trending-down-outline',
  neutral: 'remove-outline',
};

const trendColors = {
  up: 'text-emerald-400 bg-emerald-400/10',
  down: 'text-red-400 bg-red-400/10',
  neutral: 'text-muted bg-slate-400/10',
};

export function StatCard({
  icon,
  iconColor = 'text-primary',
  label,
  value,
  trend,
  badge,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'glass-panel group relative overflow-hidden rounded-xl p-6',
        className
      )}
    >
      {/* Decorative glow */}
      <div className="bg-primary/10 group-hover:bg-primary/20 absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl transition-all" />

      <div className="relative mb-4 flex items-start justify-between">
        <div
          className={cn(
            'border-surface-border bg-overlay-faint flex items-center justify-center rounded-xl border p-3',
            iconColor
          )}
        >
          <IonIcon name={icon} size="md" />
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold',
              trendColors[trend.direction]
            )}
          >
            <IonIcon name={trendIcons[trend.direction]} size="xs" />
            {trend.value}
          </span>
        )}
        {badge && <Badge variant={badge.variant}>{badge.text}</Badge>}
      </div>
      <p className="text-muted mb-1 text-sm font-medium">{label}</p>
      <h3 className="text-heading text-3xl font-bold">{value}</h3>
    </div>
  );
}
