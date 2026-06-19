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

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { EmptyState } from '@/components/molecules/EmptyState';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { canAccessOwnerRoute } from '@/lib/venue/permissions';

interface VenueRouteGuardProps {
  children: ReactNode;
}

export function VenueRouteGuard({ children }: VenueRouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { loading, selectedVenueId, permissions, isOwner, venues } =
    useVenueContext();

  if (loading && venues.length === 0) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted text-sm">Đang tải cơ sở...</p>
      </div>
    );
  }

  if (!selectedVenueId) {
    return (
      <div className="py-16">
        <EmptyState
          title="Chưa chọn cơ sở"
          description="Thêm hoặc chọn cơ sở trong menu phía trên để tiếp tục."
          icon="business-outline"
        />
      </div>
    );
  }

  const allowed = canAccessOwnerRoute(pathname, permissions, isOwner);

  if (!allowed) {
    return (
      <div className="py-16">
        <EmptyState
          title="Không có quyền truy cập trang này"
          description="Tài khoản của bạn không có quyền với cơ sở đang chọn. Hãy chọn cơ sở khác hoặc liên hệ chủ sân để được cấp quyền."
          icon="lock-closed-outline"
          actionLabel="Về Tổng quan"
          onAction={() => router.push('/owner')}
        />
      </div>
    );
  }

  return <>{children}</>;
}
