'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { Notification, NotificationType } from '@/types/portal';

/* ------------------------------------------------------------------ */
/* NotificationDropdown                                                */
/* ------------------------------------------------------------------ */

export interface NotificationDropdownProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

export function NotificationDropdown({
  open,
  onClose,
  notifications,
  onMarkAllRead,
  onNotificationClick,
  className,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute top-full right-0 z-50 mt-2 w-96 max-w-[calc(100vw-2rem)] rounded-xl shadow-2xl',
        'bg-surface-dark border border-white/10',
        'animate-in fade-in slide-in-from-top-2 duration-200',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-white">Thông báo</h3>
          {unreadCount > 0 && (
            <span className="bg-primary flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-primary hover:text-primary/80 text-xs font-medium transition-colors"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Notification list */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-surface-dark mb-3 flex h-16 w-16 items-center justify-center rounded-full">
              <IonIcon
                name="notifications-outline"
                size="lg"
                className="text-slate-500"
              />
            </div>
            <p className="text-sm text-slate-400">Không có thông báo mới</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onClick={() => {
                onNotificationClick?.(notification);
                if (notification.actionUrl) {
                  onClose();
                }
              }}
            />
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-white/10 p-2">
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

/* ------------------------------------------------------------------ */
/* NotificationItem                                                    */
/* ------------------------------------------------------------------ */

interface NotificationItemProps {
  notification: Notification;
  onClick?: () => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const typeConfig = notificationTypeConfig[notification.type];

  const content = (
    <div
      className={cn(
        'flex cursor-pointer gap-3 border-b border-white/5 px-4 py-3 transition-colors',
        'hover:bg-white/5',
        !notification.read && 'bg-primary/5'
      )}
      onClick={onClick}
    >
      {/* Icon */}
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

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'text-sm font-semibold',
              notification.read ? 'text-slate-300' : 'text-white'
            )}
          >
            {notification.title}
          </h4>
          {!notification.read && (
            <div className="bg-primary mt-1 h-2 w-2 shrink-0 rounded-full" />
          )}
        </div>
        <p className="mt-0.5 line-clamp-2 text-sm text-slate-400">
          {notification.message}
        </p>
        <p className="mt-1 text-xs text-slate-500">{notification.timestamp}</p>
      </div>
    </div>
  );

  if (notification.actionUrl) {
    return (
      <Link href={notification.actionUrl} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

/* ------------------------------------------------------------------ */
/* Type config                                                         */
/* ------------------------------------------------------------------ */

const notificationTypeConfig: Record<
  NotificationType,
  { icon: string; bgClass: string; iconClass: string }
> = {
  info: {
    icon: 'information-circle-outline',
    bgClass: 'bg-blue-500/10',
    iconClass: 'text-blue-400',
  },
  success: {
    icon: 'checkmark-circle-outline',
    bgClass: 'bg-emerald-500/10',
    iconClass: 'text-emerald-400',
  },
  warning: {
    icon: 'warning-outline',
    bgClass: 'bg-amber-500/10',
    iconClass: 'text-amber-400',
  },
  error: {
    icon: 'close-circle-outline',
    bgClass: 'bg-red-500/10',
    iconClass: 'text-red-400',
  },
};
