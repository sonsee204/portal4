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
import { MARK_NOTIFICATION_ACTION_TAKEN } from '@/graphql/notification/mutations';
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
