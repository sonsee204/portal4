'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from '@/hooks/notification';
import { getNotificationHref } from '@/lib/notification-navigation';
import type { Notification } from '@/types/notification';

export interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

export function NotificationDropdown({
  open,
  onClose,
  className,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, loading } = useNotifications();
  const { markAsRead } = useMarkAsRead();
  const { markAllAsRead } = useMarkAllAsRead();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  const displayedNotifications = notifications.slice(0, 10);

  const handleNotificationClick = (notification: Notification) => {
    // Fire-and-forget: don't await markAsRead so navigation is never blocked
    // by a slow or failed network request.
    if (!notification.isRead) {
      void markAsRead(notification);
    }
    const href = getNotificationHref(notification.data, notification._id);
    if (href) {
      router.push(href);
    }
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute top-full right-0 z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl',
        'bg-surface border-surface-border border',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      <div className="border-surface-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-heading font-semibold">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="bg-primary flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => void markAllAsRead()}
            className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading && displayedNotifications.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        ) : displayedNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-surface-hover mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <IonIcon
                name="notifications-outline"
                size="lg"
                className="text-faint"
              />
            </div>
            <p className="text-muted text-sm">Không có thông báo mới</p>
          </div>
        ) : (
          displayedNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClick={() => void handleNotificationClick(notification)}
            />
          ))
        )}
      </div>

      {displayedNotifications.length > 0 && (
        <div className="border-surface-border border-t p-2">
          <Link
            href="/notifications"
            onClick={onClose}
            className="text-primary hover:bg-primary/10 flex items-center justify-center gap-1 rounded-lg py-2 text-sm font-medium transition-colors"
          >
            Xem tất cả thông báo
            <IonIcon name="arrow-forward-outline" size="sm" />
          </Link>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const typeConfig =
    notificationTypeConfig[notification.type] ?? notificationTypeConfig.system;

  return (
    <div
      className={cn(
        'border-surface-border flex cursor-pointer gap-3 border-b px-4 py-3 transition-colors',
        'hover:bg-surface-hover',
        !notification.isRead && 'bg-primary/5'
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
          typeConfig.bgClass
        )}
      >
        <IonIcon
          name={notification.icon || typeConfig.icon}
          size="md"
          className={typeConfig.iconClass}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'text-sm font-semibold',
              notification.isRead ? 'text-body' : 'text-heading'
            )}
          >
            {notification.title}
          </h4>
          {!notification.isRead && (
            <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
          )}
        </div>
        <p className="text-muted mt-0.5 line-clamp-2 text-sm">
          {notification.description}
        </p>
        <p className="text-faint mt-1 text-xs">
          {formatTimeAgo(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHr < 24) return `${diffHr} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

const notificationTypeConfig: Record<
  string,
  { icon: string; bgClass: string; iconClass: string }
> = {
  booking: {
    icon: 'calendar-outline',
    bgClass: 'bg-blue-500/10',
    iconClass: 'text-blue-500',
  },
  booking_reminder: {
    icon: 'alarm-outline',
    bgClass: 'bg-blue-500/10',
    iconClass: 'text-blue-500',
  },
  booking_pass: {
    icon: 'ticket-outline',
    bgClass: 'bg-indigo-500/10',
    iconClass: 'text-indigo-500',
  },
  tournament: {
    icon: 'trophy-outline',
    bgClass: 'bg-amber-500/10',
    iconClass: 'text-amber-500',
  },
  payment: {
    icon: 'card-outline',
    bgClass: 'bg-emerald-500/10',
    iconClass: 'text-emerald-500',
  },
  social: {
    icon: 'people-outline',
    bgClass: 'bg-purple-500/10',
    iconClass: 'text-purple-500',
  },
  system: {
    icon: 'information-circle-outline',
    bgClass: 'bg-slate-500/10',
    iconClass: 'text-slate-500',
  },
  new_message: {
    icon: 'chatbubble-outline',
    bgClass: 'bg-cyan-500/10',
    iconClass: 'text-cyan-500',
  },
  group_invite: {
    icon: 'people-circle-outline',
    bgClass: 'bg-violet-500/10',
    iconClass: 'text-violet-500',
  },
  post_report: {
    icon: 'flag-outline',
    bgClass: 'bg-red-500/10',
    iconClass: 'text-red-500',
  },
  order: {
    icon: 'bag-outline',
    bgClass: 'bg-orange-500/10',
    iconClass: 'text-orange-500',
  },
};
