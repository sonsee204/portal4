'use client';

import { useQuery } from '@apollo/client/react';
import { GET_UNREAD_NOTIFICATION_COUNT } from '@/graphql/queries/notification';

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
