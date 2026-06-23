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
import type { DrawMode } from '@/lib/tournament/draw/types';

interface ManualDrawModeToggleProps {
  mode: DrawMode;
  onChange: (mode: DrawMode) => void;
  disabled?: boolean;
}

export function ManualDrawModeToggle({
  mode,
  onChange,
  disabled,
}: ManualDrawModeToggleProps) {
  return (
    <div className="bg-surface-elevated inline-flex rounded-full border border-surface-border p-1">
      {(['auto', 'manual'] as const).map((value) => (
        <button
          key={value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
            mode === value
              ? 'bg-primary/10 text-primary border border-primary/30'
              : 'text-secondary hover:text-heading',
          )}
        >
          {value === 'auto' ? 'Tự động' : 'Xếp thủ công'}
        </button>
      ))}
    </div>
  );
}
