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
import {
  toStatCardTrend,
  type FinanceMetricKind,
} from '@/lib/finance/stat-card-trend';

interface FinanceSignedTrendBadgeProps {
  metric?: {
    value?: number | null;
    changePercent?: number | null;
    previousValue?: number | null;
  } | null;
  metricKind?: FinanceMetricKind;
  className?: string;
}

const trendIcons = {
  up: 'trending-up-outline',
  down: 'trending-down-outline',
  neutral: 'remove-outline',
} as const;

const trendColors = {
  up: 'text-emerald-400 bg-emerald-400/10',
  down: 'text-red-400 bg-red-400/10',
  neutral: 'text-muted bg-slate-400/10',
} as const;

export function FinanceSignedTrendBadge({
  metric,
  metricKind = 'revenue',
  className,
}: FinanceSignedTrendBadgeProps) {
  const trend = toStatCardTrend(metric?.changePercent, metric?.previousValue, {
    metricKind,
    value: metric?.value,
  });

  if (!trend) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold',
        trendColors[trend.direction],
        className
      )}
    >
      <IonIcon name={trendIcons[trend.direction]} size="xs" />
      {trend.value}
    </span>
  );
}
