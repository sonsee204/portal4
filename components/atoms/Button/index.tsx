'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import {
  buttonVariants,
  buttonSizes,
  type ButtonVariant,
  type ButtonSize,
} from '@/config/theme';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: string;
  iconRight?: string;
  href?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      iconLeft,
      iconRight,
      children,
      href,
      ...props
    },
    ref
  ) => {
    const inner = (
      <>
        {iconLeft && <IonIcon name={iconLeft} size="sm" className="-ml-0.5" />}
        {children}
        {iconRight && (
          <IonIcon name={iconRight} size="sm" className="-mr-0.5" />
        )}
      </>
    );

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
          'focus-visible:ring-primary focus-visible:ring-offset-bg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.98]',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {inner}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
