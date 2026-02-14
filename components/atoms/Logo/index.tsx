'use client';

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface LogoProps {
  /** "full" shows mark + text, "mark" shows only the mark */
  variant?: 'full' | 'mark';
  className?: string;
  href?: string;
}

function LogoMark({ className }: { className?: string }) {
  return (
    <div
      className={cn('flex h-9 w-9 items-center justify-center', className)}
      aria-hidden
    >
      <Image
        src="/logo.svg"
        alt="HITRI Logo"
        width={36}
        height={36}
        className="h-full w-full object-contain"
      />
    </div>
  );
}

export function Logo({ variant = 'full', className, href = '/' }: LogoProps) {
  const content = (
    <div className={cn('flex items-center gap-2.5', className)}>
      <LogoMark />
      {variant === 'full' && (
        <div>
          <h1 className="text-lg font-bold tracking-wide text-white">
            HITRI <span className="text-primary">TECH</span>
          </h1>
          <p className="text-primary/70 text-[10px] font-medium tracking-widest">
            PORTAL v0.1
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
