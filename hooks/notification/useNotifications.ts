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
import { useCallback, useMemo } from 'react';
import { GET_NOTIFICATIONS } from '@/graphql/queries/notification';
import type { Notification, NotificationList } from '@/types/notification';

const PAGE_SIZE = 15;

interface UseNotificationsOptions {
  /** GraphQL enum value: BOOKING, TOURNAMENT, SOCIAL, etc. */
  type?: string;
  isRead?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const filter = useMemo(() => {
    const f: Record<string, unknown> = {};
    if (options.type) f.type = options.type;
    if (options.isRead !== undefined) f.isRead = options.isRead;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [options.type, options.isRead]);

  const { data, loading, error, fetchMore, refetch } = useQuery<{
    getNotifications: NotificationList;
  }>(GET_NOTIFICATIONS, {
    variables: {
      filter,
      pagination: { page: 1, limit: PAGE_SIZE },
    },
    fetchPolicy: 'cache-and-network',
  });

  const notifications: Notification[] =
    data?.getNotifications?.notifications ?? [];
  const total = data?.getNotifications?.total ?? 0;
  const unreadCount = data?.getNotifications?.unreadCount ?? 0;
  const hasMore = data?.getNotifications?.hasMore ?? false;

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = Math.floor(notifications.length / PAGE_SIZE) + 1;
    return fetchMore({
      variables: {
        filter,
        pagination: { page: nextPage, limit: PAGE_SIZE },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          getNotifications: {
            ...fetchMoreResult.getNotifications,
            notifications: [
              ...prev.getNotifications.notifications,
              ...fetchMoreResult.getNotifications.notifications,
            ],
          },
        };
      },
    });
  }, [hasMore, loading, notifications.length, fetchMore, filter]);

  return {
    notifications,
    total,
    unreadCount,
    hasMore,
    loading,
    error,
    loadMore,
    refetch,
  };
}
