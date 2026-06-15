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

type ScheduleRoundBadgeProps = {
  round: number;
  roundLabel: string;
  size?: 'xs' | 'sm' | 'md';
  /** `solid` — nền primary, chữ trắng (thẻ vòng đang chọn) */
  tone?: 'default' | 'solid';
  className?: string;
};

/**
 * Nhãn vòng đấu — cùng phong cách pill primary (`bg-primary/12`) với lưới phân công.
 */
export function ScheduleRoundBadge({
  round,
  roundLabel,
  size = 'xs',
  tone = 'default',
  className,
}: ScheduleRoundBadgeProps) {
  const solid = tone === 'solid';

  return (
    <span
      title={`Vòng ${round}: ${roundLabel}`}
      className={cn(
        'inline-flex max-w-full min-w-0 items-center gap-0.5 truncate rounded-md ring-1',
        solid
          ? 'bg-primary ring-primary/40 text-white'
          : 'bg-primary/12 text-primary ring-primary/15',
        size === 'xs' && 'px-1.5 py-0.5 text-[8px] leading-tight font-semibold',
        size === 'sm' && 'px-2 py-0.5 text-[10px] leading-tight font-semibold',
        size === 'md' && 'px-2.5 py-1 text-xs leading-tight font-semibold',
        className
      )}
    >
      <IonIcon
        name="layers-outline"
        className={cn(
          'shrink-0',
          solid ? 'text-white' : 'text-primary',
          size === 'xs' && 'h-2.5 w-2.5',
          size === 'sm' && 'h-3 w-3',
          size === 'md' && 'h-3.5 w-3.5'
        )}
      />
      <span className="min-w-0 truncate font-semibold tracking-tight normal-case">
        {roundLabel}
      </span>
    </span>
  );
}
