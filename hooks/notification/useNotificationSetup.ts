'use client';

import { useEffect } from 'react';
import { useFcmToken } from './useFcmToken';
import { useNotificationSubscription } from './useNotificationSubscription';
import { onForegroundMessage } from '@/lib/firebase/messaging';
import { showInfo } from '@/lib/toast';

export function useNotificationSetup(userId: string | undefined) {
  useFcmToken(userId);
  useNotificationSubscription(userId);

  useEffect(() => {
    if (!userId) return;

    const unsub = onForegroundMessage((payload) => {
      if (payload.title) {
        showInfo(payload.title);
      }
    });

    return () => {
      unsub?.();
    };
  }, [userId]);
}
