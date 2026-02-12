'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { IconSize } from '@/config/theme';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  iconSize?: IconSize;
  size?: 'sm' | 'md' | 'lg';
  /** Show a notification dot */
  badge?: boolean;
  variant?: 'ghost' | 'outline';
  /** Tooltip text (rendered via title attribute) */
  tooltip?: string;
}

const sizeClasses = {
  sm: 'p-1.5 rounded-md',
  md: 'p-2 rounded-lg',
  lg: 'p-2.5 rounded-lg',
};

const iconSizeMap: Record<string, IconSize> = {
  sm: 'sm',
  md: 'md',
  lg: 'md',
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon,
      iconSize,
      size = 'md',
      badge,
      variant = 'ghost',
      tooltip,
      ...props
    },
    ref
  ) => {
    const resolvedIconSize = iconSize ?? iconSizeMap[size];
    return (
      <button
        ref={ref}
        title={tooltip}
        className={cn(
          'relative inline-flex items-center justify-center text-slate-400 transition-colors',
          'hover:bg-surface-hover hover:text-white',
          'focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          sizeClasses[size],
          variant === 'outline' && 'border-surface-border border',
          className
        )}
        {...props}
      >
        <IonIcon name={icon} size={resolvedIconSize} />
        {badge && (
          <span className="bg-primary border-bg-dark absolute top-1 right-1 h-2.5 w-2.5 rounded-full border-2" />
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';

export { IconButton };
