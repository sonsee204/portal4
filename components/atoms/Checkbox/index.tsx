'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(
          'inline-flex cursor-pointer items-center gap-2 select-none',
          props.disabled && 'pointer-events-none opacity-50',
          className
        )}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className="border-surface-border bg-surface text-primary focus:ring-primary/50 h-4 w-4 rounded focus:ring-2 focus:ring-offset-0"
          {...props}
        />
        {label && <span className="text-body text-sm">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
