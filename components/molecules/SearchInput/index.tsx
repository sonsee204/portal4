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
import { forwardRef, type InputHTMLAttributes } from 'react';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, ...props }, ref) => {
    return (
      <div className={cn('group relative', wrapperClassName)}>
        <span className="group-focus-within:text-primary pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted transition-colors">
          <IonIcon name="search-outline" size="sm" />
        </span>
        <input
          ref={ref}
          type="text"
          className={cn(
            'border-surface-border bg-surface w-full rounded-full border py-2.5 pr-4 pl-11 text-sm text-heading',
            'placeholder:text-faint',
            'shadow-lg shadow-black/20',
            'focus:ring-primary/50 focus:border-primary/50 transition-all outline-none focus:ring-2',
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
