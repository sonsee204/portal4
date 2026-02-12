'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { IconSize } from '@/config/theme';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  iconSize?: IconSize;
  /** Show a notification dot */
  badge?: boolean;
  variant?: 'ghost' | 'outline';
}

const sizeClasses = {
  ghost: 'p-2 rounded-lg',
  outline: 'p-2 rounded-lg border border-surface-border',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, icon, iconSize = 'md', badge, variant = 'ghost', ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center text-slate-400 transition-colors',
          'hover:bg-surface-hover hover:text-white',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[variant],
          className
        )}
        {...props}
      >
        <IonIcon name={icon} size={iconSize} />
        {badge && (
          <span className="bg-primary border-bg-dark absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full border-2" />
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
