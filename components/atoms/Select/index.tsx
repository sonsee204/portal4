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

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  label?: string;
  options?: SelectOption[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, label, options, children, ...props }, ref) => {
    const select = (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'bg-surface text-heading flex h-10 w-full appearance-none rounded-lg border px-3 pr-10 text-sm transition-colors',
            'focus-visible:ring-primary/50 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-surface-border',
            className
          )}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <div className="text-faint pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <IonIcon name="chevron-down-outline" size="sm" />
        </div>
      </div>
    );

    if (label) {
      return (
        <div>
          <label className="text-body mb-1.5 block text-sm font-medium">
            {label}
          </label>
          {select}
        </div>
      );
    }

    return select;
  }
);

Select.displayName = 'Select';

export { Select };
