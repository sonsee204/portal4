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

import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { PromotionDetailNode } from '@/hooks/owner';
import { getPromotionRowActionAvailability } from '@/lib/promotion/promotion-row-actions';
import type { OwnerPromotionsPageActions } from '../_hooks/useOwnerPromotionsPageActions';

interface PromotionDetailFooterActionsProps {
  promotion: PromotionDetailNode;
  actions: Pick<
    OwnerPromotionsPageActions,
    'isMutating' | 'isVenueOwner' | 'openActionDialog' | 'handleEditPromotion'
  >;
}

export function PromotionDetailFooterActions({
  promotion,
  actions,
}: PromotionDetailFooterActionsProps) {
  const { isMutating, isVenueOwner, openActionDialog, handleEditPromotion } =
    actions;

  const availability = getPromotionRowActionAvailability({
    status: promotion.status,
    endDate: promotion.endDate,
    isVenueOwner,
  });

  const hasActions =
    availability.canEdit ||
    availability.canActivate ||
    availability.canPause ||
    availability.canApprove ||
    availability.canReject ||
    availability.canCancel ||
    availability.canDelete;

  if (!hasActions) return null;

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {availability.canDelete && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <Button
            variant="danger"
            size="sm"
            iconLeft="trash-outline"
            disabled={isMutating}
            onClick={() => openActionDialog('delete', promotion._id)}
          >
            Xóa
          </Button>
        </VenueActionGate>
      )}

      {availability.canCancel && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <Button
            variant="danger"
            size="sm"
            iconLeft="ban-outline"
            disabled={isMutating}
            onClick={() => openActionDialog('cancel', promotion._id)}
          >
            Hủy
          </Button>
        </VenueActionGate>
      )}

      {availability.canReject && (
        <VenueActionGate action={VenueAction.ManagePromotions} ownerOnly>
          <Button
            variant="danger"
            size="sm"
            iconLeft="close-outline"
            disabled={isMutating}
            onClick={() => openActionDialog('reject', promotion._id)}
          >
            Từ chối
          </Button>
        </VenueActionGate>
      )}

      {availability.canPause && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <Button
            variant="secondary"
            size="sm"
            iconLeft="pause-outline"
            disabled={isMutating}
            onClick={() => openActionDialog('pause', promotion._id)}
          >
            Tạm dừng
          </Button>
        </VenueActionGate>
      )}

      {availability.canEdit && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <Button
            variant="secondary"
            size="sm"
            iconLeft="create-outline"
            disabled={isMutating}
            onClick={() => handleEditPromotion(promotion._id)}
          >
            Chỉnh sửa
          </Button>
        </VenueActionGate>
      )}

      {availability.canActivate && (
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <Button
            size="sm"
            iconLeft="play-outline"
            disabled={isMutating}
            onClick={() => openActionDialog('activate', promotion._id)}
          >
            Kích hoạt
          </Button>
        </VenueActionGate>
      )}

      {availability.canApprove && (
        <VenueActionGate action={VenueAction.ManagePromotions} ownerOnly>
          <Button
            size="sm"
            iconLeft="checkmark-outline"
            disabled={isMutating}
            onClick={() => openActionDialog('approve', promotion._id)}
          >
            Duyệt
          </Button>
        </VenueActionGate>
      )}
    </div>
  );
}
