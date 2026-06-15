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

export interface FilterChip {
  label: string;
  value: string;
  count?: number;
}

export interface FilterChipsProps {
  chips: FilterChip[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterChips({
  chips,
  active,
  onChange,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          onClick={() => onChange(chip.value)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            active === chip.value
              ? 'bg-primary text-white'
              : 'bg-surface border-surface-border hover:bg-surface-hover text-muted hover:text-heading border'
          )}
        >
          {chip.label}
          {chip.count != null && (
            <span
              className={cn(
                'flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                active === chip.value
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-hover text-faint'
              )}
            >
              {chip.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
