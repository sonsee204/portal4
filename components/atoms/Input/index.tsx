'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  leftIcon?: string;
  rightIcon?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <IonIcon name={leftIcon} size="sm" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'bg-surface-dark flex h-10 w-full rounded-lg border text-sm text-white transition-colors',
            'placeholder:text-slate-500',
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
        {rightIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
            <IonIcon name={rightIcon} size="sm" />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
