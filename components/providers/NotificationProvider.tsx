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
