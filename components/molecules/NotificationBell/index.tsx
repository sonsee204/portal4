'use client';

import { useState } from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { NotificationDropdown } from '@/components/molecules/NotificationDropdown';
import { useUnreadCount } from '@/hooks/notification';
import { cn } from '@/lib/utils';

export interface NotificationBellProps {
  className?: string;
}

export function NotificationBell({ className }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const { unreadCount } = useUnreadCount();

  return (
    <div className={cn('relative', className)}>
      <IconButton
        icon="notifications-outline"
        iconSize="md"
        badge={unreadCount > 0}
        onClick={() => setOpen(!open)}
        aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} mới)` : ''}`}
        className={cn(open && 'bg-surface-hover')}
      />

      <NotificationDropdown open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
