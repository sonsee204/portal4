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
import { PageHeader } from '@/components/organisms/PageHeader';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { OwnerPromotionsPageActions } from '../_hooks/useOwnerPromotionsPageActions';

interface OwnerPromotionsHeaderSectionProps {
  actions: Pick<OwnerPromotionsPageActions, 'handleCreatePromotion'>;
}

export function OwnerPromotionsHeaderSection({
  actions,
}: OwnerPromotionsHeaderSectionProps) {
  return (
    <PageHeader
      title="Quản lý khuyến mãi"
      description="Tạo, duyệt và theo dõi khuyến mãi cho cơ sở."
      actions={
        <VenueActionGate action={VenueAction.ManagePromotions}>
          <Button
            iconLeft="add-outline"
            onClick={actions.handleCreatePromotion}
          >
            Tạo khuyến mãi
          </Button>
        </VenueActionGate>
      }
    />
  );
}
