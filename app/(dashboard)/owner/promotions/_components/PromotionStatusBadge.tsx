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

import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { PromotionStatus } from '@/graphql/generated';
import {
  PROMOTION_STATUS_BADGE_VARIANT,
  PROMOTION_STATUS_META,
} from '@/lib/promotion/promotion-status';

interface PromotionStatusBadgeProps {
  status: PromotionStatus;
  className?: string;
}

export function PromotionStatusBadge({
  status,
  className,
}: PromotionStatusBadgeProps) {
  const meta = PROMOTION_STATUS_META[status];

  return (
    <Badge
      variant={PROMOTION_STATUS_BADGE_VARIANT[status]}
      className={className}
    >
      <IonIcon name={meta.icon} size="xs" className="mr-1" />
      {meta.label}
    </Badge>
  );
}
