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

import { useEffect } from 'react';
import { useFcmToken } from './useFcmToken';
import { useNotificationSubscription } from './useNotificationSubscription';
import { onForegroundMessage } from '@/lib/firebase/messaging';
import { toast } from 'sonner';

export function useNotificationSetup(userId: string | undefined) {
  useFcmToken(userId);
  useNotificationSubscription(userId);

  useEffect(() => {
    if (!userId) return;

    const unsub = onForegroundMessage((payload) => {
      if (!payload.title) return;

      const isChatMessage = payload.data?.action === 'OPEN_CHAT';

      if (isChatMessage) {
        // Chat messages: show sender name as title + message preview as description
        toast.message(payload.title, {
          description: payload.body,
          icon: '💬',
        });
      } else {
        toast.info(payload.title);
      }
    });

    return () => {
      unsub?.();
    };
  }, [userId]);
}
