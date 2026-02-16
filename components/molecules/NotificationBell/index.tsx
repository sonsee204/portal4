'use client';

import { useState } from 'react';
import { IconButton } from '@/components/atoms/IconButton';
import { NotificationDropdown } from '@/components/molecules/NotificationDropdown';
import { mockNotifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types/mock';

export interface NotificationBellProps {
  count?: number;
  className?: string;
}

export function NotificationBell({ count, className }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayCount = count ?? unreadCount;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read when clicked
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className={cn('relative', className)}>
      <IconButton
        icon="notifications-outline"
        iconSize="md"
        badge={displayCount > 0}
        onClick={() => setOpen(!open)}
        aria-label={`Thông báo${displayCount > 0 ? ` (${displayCount} mới)` : ''}`}
        className={cn(open && 'bg-surface-hover')}
      />

      <NotificationDropdown
        open={open}
        onClose={() => setOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
      />
    </div>
  );
}
