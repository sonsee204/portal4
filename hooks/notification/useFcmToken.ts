'use client';

import { useEffect, useRef } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  SAVE_FCM_TOKEN,
  REMOVE_FCM_TOKEN,
} from '@/graphql/mutations/notification';
import { requestNotificationPermission } from '@/lib/firebase/messaging';

let storedToken: string | null = null;

export function getFcmToken(): string | null {
  return storedToken;
}

export function clearStoredFcmToken() {
  storedToken = null;
}

export function useFcmToken(userId: string | undefined) {
  const [saveFcmToken] = useMutation(SAVE_FCM_TOKEN);
  const [removeFcmToken] = useMutation(REMOVE_FCM_TOKEN);
  const initialized = useRef(false);

  useEffect(() => {
    if (!userId || initialized.current) return;
    initialized.current = true;

    (async () => {
      const token = await requestNotificationPermission();
      if (!token) return;
      storedToken = token;
      try {
        await saveFcmToken({ variables: { token } });
      } catch {
        // Non-critical
      }
    })();

    return () => {
      if (storedToken) {
        removeFcmToken({ variables: { token: storedToken } }).catch(() => { });
        storedToken = null;
      }
      initialized.current = false;
    };
  }, [userId, saveFcmToken, removeFcmToken]);
}
