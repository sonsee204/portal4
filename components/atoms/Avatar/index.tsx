'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { avatarStatusColors, type AvatarStatus } from '@/config/theme';

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  status?: AvatarStatus;
  fallback?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const dotSizes = {
  sm: 'h-2 w-2 border',
  md: 'h-3 w-3 border-2',
  lg: 'h-3.5 w-3.5 border-2',
};

export function Avatar({
  src,
  alt = '',
  size = 'md',
  status,
  fallback,
  className,
}: AvatarProps) {
  const initials =
    fallback ??
    alt
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      {src ? (
        <span
          className={cn(
            'border-surface-border relative block overflow-hidden rounded-full border-2',
            sizeClasses[size]
          )}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={size === 'sm' ? '32px' : size === 'md' ? '40px' : '48px'}
            className="object-cover"
            unoptimized
          />
        </span>
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-400 font-bold text-white',
            sizeClasses[size],
            size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'border-bg absolute right-0 bottom-0 rounded-full',
            avatarStatusColors[status],
            dotSizes[size]
          )}
        />
      )}
    </div>
  );
}
