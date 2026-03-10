'use client';

import { useEffect, useRef } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { NOTIFICATION_CREATED_SUBSCRIPTION } from '@/graphql/subscriptions/notification';
import { GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT } from '@/graphql/queries/notification';
import type { Notification } from '@/types/notification';

export function useNotificationSubscription(userId: string | undefined) {
  const client = useApolloClient();
  const subRef = useRef<{ unsubscribe: () => void } | null>(null);

  useEffect(() => {
    if (!userId) return;

    subRef.current = client.subscribe<{
      notificationCreated: Notification;
    }>({
      query: NOTIFICATION_CREATED_SUBSCRIPTION,
      variables: { userId },
    }).subscribe({
      next({ data }) {
        if (!data?.notificationCreated) return;

        // Refetch all active GET_NOTIFICATIONS queries (each may have different
        // variables/filters) and the standalone count query so every UI surface
        // updates atomically without needing to guess the cached variables.
        void client.refetchQueries({
          include: [GET_NOTIFICATIONS, GET_UNREAD_NOTIFICATION_COUNT],
        });
      },
    });

    return () => {
      subRef.current?.unsubscribe();
    };
  }, [userId, client]);
}
