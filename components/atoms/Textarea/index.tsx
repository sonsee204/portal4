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

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, label, ...props }, ref) => {
    const textarea = (
      <textarea
        ref={ref}
        className={cn(
          'bg-surface text-heading flex w-full resize-none rounded-lg border px-3 py-3 text-sm transition-colors',
          'placeholder:text-faint',
          'focus-visible:ring-primary/50 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-red-500 focus-visible:ring-red-500'
            : 'border-surface-border',
          className
        )}
        {...props}
      />
    );

    if (label) {
      return (
        <div>
          <label className="text-body mb-1.5 block text-sm font-medium">
            {label}
          </label>
          {textarea}
        </div>
      );
    }

    return textarea;
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
