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

import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useAuthStore } from '@/stores/auth';
import { getHomePath } from '@/lib/permissions';
import { useLogout } from '@/hooks/useLogout';

export default function ForbiddenPage() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role ?? null);
  const capabilities = useAuthStore((s) => s.user?.portalCapabilities ?? []);
  const { logout, isLoggingOut } = useLogout();

  const homePath = getHomePath(role, capabilities);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <GlassPanel card className="max-w-md space-y-6 p-8 text-center">
        <div className="bg-primary/10 border-primary/20 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border">
          <IonIcon
            name="shield-outline"
            size="lg"
            className="text-primary text-3xl"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-heading text-xl font-bold">
            Không có quyền truy cập
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            Tài khoản của bạn không có quyền xem trang này. Liên hệ quản trị
            viên nếu bạn cho rằng đây là lỗi.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="primary"
            iconLeft="home-outline"
            onClick={() => router.push(homePath)}
          >
            Về trang chủ
          </Button>
          <Button
            variant="ghost"
            iconLeft="log-out-outline"
            disabled={isLoggingOut}
            onClick={() => void logout()}
          >
            Đăng xuất
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
}
