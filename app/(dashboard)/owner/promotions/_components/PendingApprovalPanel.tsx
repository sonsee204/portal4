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
import { IonIcon } from '@/components/atoms/IonIcon';
import { Badge } from '@/components/atoms/Badge';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { VenueAction, type PromotionType } from '@/graphql/generated';
import type { VenuePromotionNode } from '@/hooks/owner';
import { PROMOTION_DISCOUNT_TYPE_CONFIG } from '@/lib/promotion/promotion-constants';
import { formatDate } from '@/lib/utils';
import type { OwnerPromotionsPageActions } from '../_hooks/useOwnerPromotionsPageActions';
import { ViewPromotionDetailButton } from './ViewPromotionDetailButton';

interface PendingApprovalPanelProps {
  promotions: VenuePromotionNode[];
  disabled?: boolean;
  actions: OwnerPromotionsPageActions;
}

export function PendingApprovalPanel({
  promotions,
  disabled,
  actions,
}: PendingApprovalPanelProps) {
  if (promotions.length === 0) return null;

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <IonIcon
            name="hourglass-outline"
            size="sm"
            className="text-amber-500"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-heading text-sm font-semibold">Chờ duyệt</h3>
          <p className="text-muted text-xs">
            {promotions.length} khuyến mãi đang chờ chủ sân duyệt
          </p>
        </div>
        <Badge variant="warning">{promotions.length}</Badge>
      </div>

      <div className="space-y-3">
        {promotions.map((promotion) => {
          const discountLabel = PROMOTION_DISCOUNT_TYPE_CONFIG[
            promotion.type as PromotionType
          ].format(promotion.value);

          return (
            <div
              key={promotion._id}
              className="border-surface-border flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
            >
              <div className="min-w-0">
                <p className="text-heading text-sm font-medium">
                  {promotion.name}
                </p>
                {promotion.code ? (
                  <p className="text-faint font-mono text-xs">
                    {promotion.code}
                  </p>
                ) : null}
                <p className="text-muted mt-1 text-xs">
                  Giảm {discountLabel} · {formatDate(promotion.startDate)} –{' '}
                  {formatDate(promotion.endDate)}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <ViewPromotionDetailButton
                  promotionId={promotion._id}
                  onOpen={actions.openPromotionDetail}
                  disabled={disabled}
                />
                <VenueActionGate
                  action={VenueAction.ManagePromotions}
                  ownerOnly
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    iconLeft="close-outline"
                    disabled={disabled}
                    onClick={() =>
                      actions.openActionDialog('reject', promotion._id)
                    }
                  >
                    Từ chối
                  </Button>
                  <Button
                    size="sm"
                    iconLeft="checkmark-outline"
                    disabled={disabled}
                    onClick={() =>
                      actions.openActionDialog('approve', promotion._id)
                    }
                  >
                    Duyệt
                  </Button>
                </VenueActionGate>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}
