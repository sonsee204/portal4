/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { VenueAction } from '@/graphql/generated';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { EmptyState } from '@/components/molecules/EmptyState';
import { OwnerProductStatsPageView } from './OwnerProductStatsPageView';

export function OwnerProductStatsPageShell() {
  return (
    <VenueActionGate
      action={VenueAction.ViewAnalytics}
      fallback={
        <div className="py-16">
          <EmptyState
            title="Không có quyền xem thống kê"
            description="Quyền xem thống kê cho phép truy cập báo cáo sản phẩm. Liên hệ chủ sân để được cấp quyền."
            icon="lock-closed-outline"
          />
        </div>
      }
    >
      <OwnerProductStatsPageView />
    </VenueActionGate>
  );
}
