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
          'bg-surface-dark flex w-full resize-none rounded-lg border px-3 py-3 text-sm text-white transition-colors',
          'placeholder:text-slate-500',
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
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
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
