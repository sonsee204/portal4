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

import { type ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useNotificationSetup } from '@/hooks/notification';

function NotificationInit() {
  const user = useAuthStore((s) => s.user);
  useNotificationSetup(user?._id);
  return null;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {isInitialized && user && <NotificationInit />}
      {children}
    </>
  );
}
