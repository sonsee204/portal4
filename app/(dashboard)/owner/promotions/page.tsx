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

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { VenueAction } from '@/graphql/generated';
import { useOwnerPromotionsPageActions } from './_hooks/useOwnerPromotionsPageActions';
import { useOwnerPromotionsPageData } from './_hooks/useOwnerPromotionsPageData';
import { PromotionActionConfirmDialog } from './_components/PromotionActionConfirmDialog';
import { PromotionDetailModal } from './_components/PromotionDetailModal';
import { PendingApprovalPanel } from './_components/PendingApprovalPanel';
import { OwnerPromotionsHeaderSection } from './_sections/OwnerPromotionsHeaderSection';
import { OwnerPromotionsStatsSection } from './_sections/OwnerPromotionsStatsSection';
import { OwnerPromotionsTableSection } from './_sections/OwnerPromotionsTableSection';

export default function OwnerPromotionsPage() {
  const data = useOwnerPromotionsPageData();
  const actions = useOwnerPromotionsPageActions(data);
  const { openPromotionDetail } = actions;
  const searchParams = useSearchParams();
  const promotionIdParam = searchParams.get('promotionId');

  useEffect(() => {
    if (promotionIdParam) {
      openPromotionDetail(promotionIdParam);
    }
  }, [promotionIdParam, openPromotionDetail]);

  return (
    <VenueActionGate
      action={VenueAction.ManagePromotions}
      fallback={
        <GlassPanel card className="mt-6">
          <p className="text-muted text-sm">
            Bạn không có quyền quản lý khuyến mãi tại cơ sở này.
          </p>
        </GlassPanel>
      }
    >
      <OwnerPromotionsHeaderSection actions={actions} />
      <OwnerPromotionsStatsSection data={data} />

      <div className="mt-6 space-y-4">
        <PendingApprovalPanel
          promotions={data.pendingPromotions}
          disabled={actions.isMutating}
          actions={actions}
        />
        <OwnerPromotionsTableSection data={data} actions={actions} />
      </div>

      <PromotionActionConfirmDialog actions={actions} />
      <PromotionDetailModal
        promotionId={actions.detailPromotionId}
        open={Boolean(actions.detailPromotionId)}
        onClose={actions.closePromotionDetail}
        actions={actions}
      />
    </VenueActionGate>
  );
}
