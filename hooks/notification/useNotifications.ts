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
import { useMemo } from 'react';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT } from '@/graphql/queries/notification';
import type {
  GetNotificationsQuery,
  GetNotificationsQueryVariables,
  NotificationFilterInput,
} from '@/graphql/generated';
import type { Notification } from '@/types/notification';
import {
  connectionNodes,
  mergeConnectionEdges,
  useConnectionLoadMore,
} from '@/hooks/shared/useCursorConnection';
import { NOTIFICATION_LIST_FIRST } from '@/lib/constants/pagination';

const PAGE_SIZE = NOTIFICATION_LIST_FIRST;

interface UseNotificationsOptions {
  /** GraphQL enum value: BOOKING, TOURNAMENT, SOCIAL, etc. */
  type?: string;
  isRead?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const filter = useMemo((): NotificationFilterInput | undefined => {
    const f: NotificationFilterInput = {};
    if (options.type) f.type = options.type as NotificationFilterInput['type'];
    if (options.isRead !== undefined) f.isRead = options.isRead;
    return Object.keys(f).length > 0 ? f : undefined;
  }, [options.type, options.isRead]);

  const { data, loading, error, fetchMore, refetch } = useQuery<
    GetNotificationsQuery,
    GetNotificationsQueryVariables
  >(GET_NOTIFICATIONS, {
    variables: {
      filter,
      pagination: { first: PAGE_SIZE, after: null },
    },
    fetchPolicy: 'cache-and-network',
  });

  const { data: unreadData } = useQuery<{ getUnreadNotificationCount: number }>(
    GET_UNREAD_NOTIFICATION_COUNT,
    { fetchPolicy: 'cache-and-network' },
  );

  const connection = data?.notificationsConnection;
  const notifications = connectionNodes(connection?.edges) as unknown as Notification[];
  const pageInfo = connection?.pageInfo;
  const total = connection?.totalCount ?? 0;
  const unreadCount = unreadData?.getUnreadNotificationCount ?? 0;
  const hasMore = pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage: hasMore,
    endCursor: pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      filter,
      pagination: { first: PAGE_SIZE, after },
    }),
    mergeResults: (prev, next) => ({
      ...prev,
      notificationsConnection: {
        ...next.notificationsConnection!,
        edges: mergeConnectionEdges(
          prev.notificationsConnection?.edges ?? [],
          next.notificationsConnection?.edges ?? [],
        ),
      },
    }),
  });

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
