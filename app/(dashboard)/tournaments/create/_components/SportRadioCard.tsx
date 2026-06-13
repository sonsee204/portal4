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

const sportOptions = [
  { value: 'football', label: 'Bóng đá', icon: 'football-outline' },
  { value: 'badminton', label: 'Cầu lông', icon: 'tennisball-outline' },
  { value: 'pickleball', label: 'Pickleball', icon: 'baseball-outline' },
  { value: 'tennis', label: 'Tennis', icon: 'tennisball-outline' },
];

export function SportRadioCard({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {sportOptions.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
            selected === opt.value
              ? 'border-primary bg-primary/10 text-primary shadow-primary/10 shadow-md'
              : 'border-surface-border bg-surface hover:bg-surface-hover text-muted hover:text-heading'
          )}
        >
          <IonIcon name={opt.icon} size="lg" />
          <span className="text-xs font-medium">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}
