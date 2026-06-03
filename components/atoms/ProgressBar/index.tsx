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
      <div className="bg-overlay-subtle h-2 w-full overflow-hidden rounded-full">
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
