'use client';

import { IconButton } from '@/components/atoms/IconButton';
import { cn } from '@/lib/utils';

export interface NotificationBellProps {
  count?: number;
  className?: string;
  onClick?: () => void;
}

export function NotificationBell({
  count = 0,
  className,
  onClick,
}: NotificationBellProps) {
  return (
    <IconButton
      icon="notifications-outline"
      iconSize="md"
      badge={count > 0}
      onClick={onClick}
      aria-label={`Notifications${count > 0 ? ` (${count} new)` : ''}`}
      className={cn(className)}
    />
  );
}
