'use client';

import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';
import { MARK_ALL_NOTIFICATIONS_AS_READ } from '@/graphql/mutations/notification';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT } from '@/graphql/queries/notification';
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
