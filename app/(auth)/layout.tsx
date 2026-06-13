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

import type { Metadata } from 'next';
import { Logo } from '@/components/atoms/Logo';
import { IonIcon } from '@/components/atoms/IonIcon';
import { AuthBackground } from './_components/AuthBackground';
import { AuthBrandPanel } from './_components/AuthBrandPanel';
import { AUTH } from '@/lib/strings';

export const metadata: Metadata = {
  title: 'Xác thực',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-bg relative flex min-h-screen">
      <AuthBackground />

      {/* Brand panel — visible on lg+ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%]">
        <AuthBrandPanel />
      </div>

      {/* Form panel */}
      <div className="relative z-10 flex flex-1 items-center justify-center p-5 sm:p-8 lg:p-12">
        <div className="glass-card w-full max-w-md rounded-2xl p-7 shadow-2xl sm:p-8">
          {/* Compact logo for mobile (brand panel has it on desktop) */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <Logo variant="full" />
          </div>

          {children}

          {/* Footer status bar */}
          <div className="border-surface-border mt-8 border-t pt-4">
            <div className="flex items-center justify-center gap-2 text-xs text-faint">
              <span className="flex items-center gap-1">
                <span className="neon-glow h-2 w-2 rounded-full bg-emerald-500" />
                {AUTH.FOOTER.SYSTEM_ONLINE}
              </span>
              <span className="text-surface-border">|</span>
              <span>{AUTH.FOOTER.VERSION}</span>
              <span className="text-surface-border">|</span>
              <span className="flex items-center gap-1">
                <IonIcon name="shield-checkmark-outline" size="xs" />
                {AUTH.FOOTER.SSL_SECURED}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
