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

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Badge } from '@/components/atoms/Badge';
import type { BadgeVariant } from '@/config/theme';
import { getSignedValueClassName } from '@/lib/finance/stat-card-trend';

export interface StatCardProps {
  icon: string;
  iconColor?: string;
  label: string;
  value: string | number;
  /** Raw number for signed value coloring (negative red, positive green). */
  signedValue?: number | null;
  /** Override value text color (takes precedence over signedValue coloring). */
  valueClassName?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  badge?: {
    text: string;
    variant: BadgeVariant;
  };
  hint?: string;
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
  signedValue,
  valueClassName,
  trend,
  badge,
  hint,
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
      {hint ? (
        <p className="text-faint mb-2 text-xs leading-snug">{hint}</p>
      ) : null}
      <h3
        className={cn(
          'text-3xl font-bold',
          valueClassName ??
            (signedValue != null
              ? getSignedValueClassName(signedValue)
              : 'text-heading')
        )}
      >
        {value}
      </h3>
    </div>
  );
}
