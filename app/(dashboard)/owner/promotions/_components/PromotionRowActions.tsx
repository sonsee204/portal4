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

import { IconButton } from '@/components/atoms/IconButton';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { VenuePromotionNode } from '@/hooks/owner';
import { getPromotionRowActionAvailability } from '@/lib/promotion/promotion-row-actions';
import { cn } from '@/lib/utils';
import type { OwnerPromotionsPageActions } from '../_hooks/useOwnerPromotionsPageActions';
import { ViewPromotionDetailButton } from './ViewPromotionDetailButton';

interface PromotionRowActionsProps {
  promotion: VenuePromotionNode;
  actions: OwnerPromotionsPageActions;
}

const toneClassName = {
  primary: 'text-primary hover:text-primary hover:bg-primary/10',
  danger: 'text-red-500 hover:text-red-600 hover:bg-red-500/10',
  success: 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10',
} as const;

export function PromotionRowActions({
  promotion,
  actions,
}: PromotionRowActionsProps) {
  const {
    isMutating,
    isVenueOwner,
    openPromotionDetail,
    openActionDialog,
    handleEditPromotion,
  } = actions;

  const availability = getPromotionRowActionAvailability({
    status: promotion.status,
    endDate: promotion.endDate,
    isVenueOwner,
  });

  return (
    <div className="flex flex-wrap justify-end gap-0.5">
      <ViewPromotionDetailButton
        promotionId={promotion._id}
        onOpen={openPromotionDetail}
        disabled={isMutating}
      />

      {availability.canEdit && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <IconButton
            icon="create-outline"
            size="sm"
            tooltip="Chỉnh sửa"
            aria-label="Chỉnh sửa"
            disabled={isMutating}
            className={toneClassName.primary}
            onClick={() => handleEditPromotion(promotion._id)}
          />
        </VenueActionGate>
      )}

      {availability.canActivate && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <IconButton
            icon="play-outline"
            size="sm"
            tooltip="Kích hoạt"
            aria-label="Kích hoạt"
            disabled={isMutating}
            className={toneClassName.success}
            onClick={() => openActionDialog('activate', promotion._id)}
          />
        </VenueActionGate>
      )}

      {availability.canPause && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <IconButton
            icon="pause-outline"
            size="sm"
            tooltip="Tạm dừng"
            aria-label="Tạm dừng"
            disabled={isMutating}
            className={toneClassName.primary}
            onClick={() => openActionDialog('pause', promotion._id)}
          />
        </VenueActionGate>
      )}

      {availability.canApprove && (
        <VenueActionGate action={VenueAction.ManagePromotions} ownerOnly>
          <IconButton
            icon="checkmark-outline"
            size="sm"
            tooltip="Duyệt"
            aria-label="Duyệt"
            disabled={isMutating}
            className={toneClassName.success}
            onClick={() => openActionDialog('approve', promotion._id)}
          />
        </VenueActionGate>
      )}

      {availability.canReject && (
        <VenueActionGate action={VenueAction.ManagePromotions} ownerOnly>
          <IconButton
            icon="close-outline"
            size="sm"
            tooltip="Từ chối"
            aria-label="Từ chối"
            disabled={isMutating}
            className={toneClassName.danger}
            onClick={() => openActionDialog('reject', promotion._id)}
          />
        </VenueActionGate>
      )}

      {availability.canCancel && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <IconButton
            icon="ban-outline"
            size="sm"
            tooltip="Hủy khuyến mãi"
            aria-label="Hủy khuyến mãi"
            disabled={isMutating}
            className={toneClassName.danger}
            onClick={() => openActionDialog('cancel', promotion._id)}
          />
        </VenueActionGate>
      )}

      {availability.canDelete && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <IconButton
            icon="trash-outline"
            size="sm"
            tooltip="Xóa"
            aria-label="Xóa"
            disabled={isMutating}
            className={cn(toneClassName.danger)}
            onClick={() => openActionDialog('delete', promotion._id)}
          />
        </VenueActionGate>
      )}
    </div>
  );
}
