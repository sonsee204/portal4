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
import { MARK_ALL_NOTIFICATIONS_AS_READ } from '@/graphql/notification/mutations';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT } from '@/graphql/notification/queries';
import type { MarkAllAsReadResponse, NotificationType } from '@/types/notification';

export function useMarkAllAsRead() {
  const [mutate, { loading }] = useMutation<{
    markAllNotificationsAsRead: MarkAllAsReadResponse;
  }>(MARK_ALL_NOTIFICATIONS_AS_READ);

  const markAllAsRead = useCallback(
    (type?: NotificationType) =>
      mutate({
        variables: type ? { type } : {},
        refetchQueries: [
          { query: GET_NOTIFICATIONS },
          { query: GET_UNREAD_NOTIFICATION_COUNT },
        ],
      }),
    [mutate],
  );

  return { markAllAsRead, loading };
}
