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

import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';
import { app } from './config';

let messagingInstance: Messaging | null = null;

function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined') return null;
  if (!('Notification' in window)) return null;
  if (!messagingInstance) {
    try {
      messagingInstance = getMessaging(app);
    } catch {
      return null;
    }
  }
  return messagingInstance;
}

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function requestNotificationPermission(): Promise<string | null> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const messaging = getMessagingInstance();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js',
      ),
    });

    return token;
  } catch {
    return null;
  }
}

export function onForegroundMessage(
  callback: (payload: { title?: string; body?: string; data?: Record<string, string> }) => void,
): (() => void) | null {
  const messaging = getMessagingInstance();
  if (!messaging) return null;

  return onMessage(messaging, (payload) => {
    callback({
      title: payload.notification?.title,
      body: payload.notification?.body,
      data: payload.data,
    });
  });
}
