'use client';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/atoms/Avatar';
import type { AvatarStatus } from '@/config/theme';

export interface UserCellProps {
  name: string;
  subtitle?: string;
  src?: string;
  status?: AvatarStatus;
  className?: string;
}

export function UserCell({
  name,
  subtitle,
  src,
  status,
  className,
}: UserCellProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar src={src} alt={name} status={status} size="md" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        {subtitle && (
          <p className="truncate text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
