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
import { OwnerStockHistoryPageView } from './OwnerStockHistoryPageView';

export function OwnerStockHistoryPageShell() {
  return (
    <VenueActionGate
      actions={[VenueAction.ViewAnalytics, VenueAction.ManageProducts]}
      fallback={
        <div className="py-16">
          <EmptyState
            title="Không có quyền xem lịch sử kho"
            description="Cần quyền xem thống kê hoặc quản lý sản phẩm. Liên hệ chủ sân để được cấp quyền."
            icon="lock-closed-outline"
          />
        </div>
      }
    >
      <OwnerStockHistoryPageView />
    </VenueActionGate>
  );
}
