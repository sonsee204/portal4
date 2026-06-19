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

import { IonIcon } from '@/components/atoms/IonIcon';
import { cn } from '@/lib/utils';

interface PromotionOptionCardProps {
  label: string;
  description?: string;
  icon?: string;
  accent?: string;
  selected: boolean;
  onSelect: () => void;
  className?: string;
}

export function PromotionOptionCard({
  label,
  description,
  icon,
  accent = '#8b5cf6',
  selected,
  onSelect,
  className,
}: PromotionOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left transition-all',
        selected
          ? 'border-primary/40 bg-primary/10 shadow-sm'
          : 'border-surface-border bg-surface hover:bg-surface-hover',
        className
      )}
    >
      {icon ? (
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          <IonIcon name={icon} size="sm" />
        </span>
      ) : null}
      <span className="min-w-0 flex-1">
        <span
          className="text-heading block text-sm font-semibold"
          style={selected ? { color: accent } : undefined}
        >
          {label}
        </span>
        {description ? (
          <span className="text-muted mt-0.5 block text-xs">{description}</span>
        ) : null}
      </span>
      {selected ? (
        <span style={{ color: accent }}>
          <IonIcon name="checkmark-circle" size="sm" className="shrink-0" />
        </span>
      ) : null}
    </button>
  );
}
