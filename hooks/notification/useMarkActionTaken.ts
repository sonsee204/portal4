'use client';

import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';
import { MARK_NOTIFICATION_ACTION_TAKEN } from '@/graphql/mutations/notification';
import type { Notification } from '@/types/notification';

export function useMarkActionTaken() {
  const [mutate, { loading }] = useMutation<{
    markNotificationActionTaken: Notification;
  }>(MARK_NOTIFICATION_ACTION_TAKEN);

  const markActionTaken = useCallback(
    (notificationId: string) =>
      mutate({ variables: { notificationId } }),
    [mutate],
  );

  return { markActionTaken, loading };
}
