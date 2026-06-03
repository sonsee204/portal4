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

/* eslint-disable no-undef */
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js',
);

firebase.initializeApp({
  apiKey: 'AIzaSyAYXiKqGdDZsWr7787MPaOXVBfBC2UXKyg',
  authDomain: 'hitri-services.firebaseapp.com',
  projectId: 'hitri-services',
  storageBucket: 'hitri-services.firebasestorage.app',
  messagingSenderId: '452823106325',
  appId: '1:452823106325:web:b529adf66727d50dad1f1c',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, image } = payload.notification ?? {};
  if (!title) return;

  self.registration.showNotification(title, {
    body: body ?? '',
    icon: '/icons/icon-192x192.png',
    image,
    data: payload.data,
  });
});
