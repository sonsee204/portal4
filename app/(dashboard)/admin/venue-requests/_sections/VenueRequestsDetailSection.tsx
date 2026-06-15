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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { EmptyState } from '@/components/molecules/EmptyState';
import { VenueRequestDetail } from '../_components/VenueRequestDetail';
import type { VenueRequestsPageActions } from '../_hooks/useVenueRequestsPageActions';
import type { VenueRequestsPageData } from '../_hooks/useVenueRequestsPageData';

interface VenueRequestsDetailSectionProps {
  data: VenueRequestsPageData;
  actions: VenueRequestsPageActions;
}

export function VenueRequestsDetailSection({
  data,
  actions,
}: VenueRequestsDetailSectionProps) {
  const { selectedRequest } = data;
  const { handleApprove, handleReject, approving, rejecting } = actions;

  if (selectedRequest) {
    return (
      <VenueRequestDetail
        request={selectedRequest}
        onApprove={handleApprove}
        onReject={handleReject}
        loading={approving || rejecting}
      />
    );
  }

  return (
    <GlassPanel card>
      <EmptyState
        icon="business-outline"
        title="Chọn yêu cầu"
        description="Chọn một yêu cầu từ bảng bên trên để xem chi tiết."
      />
    </GlassPanel>
  );
}
