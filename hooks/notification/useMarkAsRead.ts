/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';
import { MARK_NOTIFICATION_AS_READ } from '@/graphql/mutations/notification';
import type { Notification } from '@/types/notification';

export function useMarkAsRead() {
  const [mutate, { loading }] = useMutation<{
    markNotificationAsRead: Notification;
  }>(MARK_NOTIFICATION_AS_READ);

  const markAsRead = useCallback(
    (notification: Notification) =>
      mutate({
        variables: { notificationId: notification._id },
        optimisticResponse: {
          markNotificationAsRead: {
            ...notification,
            __typename: 'Notification',
            isRead: true,
            readAt: new Date().toISOString(),
          } as Notification & { __typename: 'Notification' },
        },
        update(cache) {
          // Decrement all unread count fields in the cache so the badge and
          // every notification list (regardless of filter variables) stay in sync.
          cache.modify({
            fields: {
              getUnreadNotificationCount(existing: number) {
                return Math.max(0, existing - 1);
              },
              getNotifications(existing) {
                if (!existing?.unreadCount) return existing;
                return {
                  ...existing,
                  unreadCount: Math.max(0, (existing.unreadCount as number) - 1),
                };
              },
            },
          });
        },
      }),
    [mutate],
  );

  return { markAsRead, loading };
}
