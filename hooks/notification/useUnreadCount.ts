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

import { useQuery } from '@apollo/client/react';
import { GET_UNREAD_NOTIFICATION_COUNT } from '@/graphql/notification/queries';

const POLL_INTERVAL = 30_000;

export function useUnreadCount() {
  const { data, loading, refetch } = useQuery<{
    getUnreadNotificationCount: number;
  }>(GET_UNREAD_NOTIFICATION_COUNT, {
    fetchPolicy: 'cache-and-network',
    pollInterval: POLL_INTERVAL,
  });

  return {
    unreadCount: data?.getUnreadNotificationCount ?? 0,
    loading,
    refetch,
  };
}
