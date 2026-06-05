'use client';

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging,
  type Unsubscribe,
} from 'firebase/messaging';
import { app } from './config';

let messagingInstance: Messaging | null = null;
let supportPromise: Promise<boolean> | null = null;

// Hàm khởi tạo an toàn, không throw unhandled rejection
async function initMessagingSafe(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (!('Notification' in window)) return null;

  if (supportPromise === null) {
    supportPromise = isSupported().catch(() => false);
  }
  const supported = await supportPromise;
  if (!supported) return null;

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

    const messaging = await initMessagingSafe();
    if (!messaging) return null;

    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      ),
    });

    return token;
  } catch (error) {
    console.error('Lỗi request permission:', error);
    return null;
  }
}

// Hàm này vẫn trả về một function unsubscribe ngay lập tức,
// nhưng việc đăng ký thực sự được thực hiện bất đồng bộ.
// Unsubscribe khi được gọi sẽ hủy đăng ký nếu đã đăng ký xong.
export function onForegroundMessage(
  callback: (payload: {
    title?: string;
    body?: string;
    data?: Record<string, string>;
  }) => void
): () => void {
  let unsubscribe: Unsubscribe | null = null;
  let isUnsubscribed = false;

  // Thực hiện đăng ký bất đồng bộ
  initMessagingSafe()
    .then((messaging) => {
      if (isUnsubscribed || !messaging) return;
      unsubscribe = onMessage(messaging, (payload) => {
        callback({
          title: payload.notification?.title,
          body: payload.notification?.body,
          data: payload.data,
        });
      });
    })
    .catch(() => {});

  // Trả về function để hủy đăng ký
  return () => {
    isUnsubscribed = true;
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }
  };
}
