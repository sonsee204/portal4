'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      error,
      label,
      leftIcon,
      rightIcon,
      onRightIconClick,
      ...props
    },
    ref
  ) => {
    const input = (
      <div className="relative">
        {leftIcon && (
          <div className="text-faint pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <IonIcon name={leftIcon} size="sm" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'bg-surface text-heading flex h-10 w-full rounded-lg border text-sm transition-colors',
            'placeholder:text-faint',
            'focus-visible:ring-primary/50 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error
              ? 'border-red-500 focus-visible:ring-red-500'
              : 'border-surface-border',
            leftIcon ? 'pl-10' : 'px-3',
            rightIcon ? 'pr-10' : 'pr-3',
            className
          )}
          {...props}
        />
        {rightIcon &&
          (onRightIconClick ? (
            <button
              type="button"
              onClick={onRightIconClick}
              className="focus-visible:ring-primary focus-visible:ring-offset-bg text-faint hover:text-muted absolute inset-y-0 right-0 flex items-center rounded-r-lg pr-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              tabIndex={0}
              aria-label={undefined}
            >
              <IonIcon name={rightIcon} size="sm" />
            </button>
          ) : (
            <div className="text-faint pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <IonIcon name={rightIcon} size="sm" />
            </div>
          ))}
      </div>
    );

    if (label) {
      return (
        <div>
          <label className="text-body mb-1.5 block text-sm font-medium">
            {label}
          </label>
          {input}
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </div>
      );
    }

    return (
      <>
        {input}
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </>
    );
  }
);

Input.displayName = 'Input';

export { Input };
