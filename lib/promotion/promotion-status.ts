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

import { PromotionStatus } from '@/graphql/generated';
import type { BadgeVariant } from '@/config/theme';

export const PROMOTION_STATUS_META: Record<
  PromotionStatus,
  { label: string; icon: string }
> = {
  [PromotionStatus.Draft]: { label: 'Nháp', icon: 'document-text-outline' },
  [PromotionStatus.PendingApproval]: {
    label: 'Chờ duyệt',
    icon: 'hourglass-outline',
  },
  [PromotionStatus.Active]: {
    label: 'Đang chạy',
    icon: 'checkmark-circle-outline',
  },
  [PromotionStatus.Paused]: {
    label: 'Tạm dừng',
    icon: 'pause-circle-outline',
  },
  [PromotionStatus.Expired]: { label: 'Hết hạn', icon: 'time-outline' },
  [PromotionStatus.Cancelled]: {
    label: 'Đã hủy',
    icon: 'close-circle-outline',
  },
};

export const PROMOTION_STATUS_BADGE_VARIANT: Record<
  PromotionStatus,
  BadgeVariant
> = {
  [PromotionStatus.Draft]: 'neutral',
  [PromotionStatus.PendingApproval]: 'warning',
  [PromotionStatus.Active]: 'success',
  [PromotionStatus.Paused]: 'info',
  [PromotionStatus.Expired]: 'neutral',
  [PromotionStatus.Cancelled]: 'danger',
};

export type PromotionStatusFilter = 'all' | PromotionStatus;

export const PROMOTION_STATUS_FILTERS: Array<{
  id: PromotionStatusFilter;
  label: string;
  icon: string;
}> = [
  { id: 'all', label: 'Tất cả', icon: 'apps-outline' },
  {
    id: PromotionStatus.Active,
    label: PROMOTION_STATUS_META[PromotionStatus.Active].label,
    icon: PROMOTION_STATUS_META[PromotionStatus.Active].icon,
  },
  {
    id: PromotionStatus.PendingApproval,
    label: PROMOTION_STATUS_META[PromotionStatus.PendingApproval].label,
    icon: PROMOTION_STATUS_META[PromotionStatus.PendingApproval].icon,
  },
  {
    id: PromotionStatus.Draft,
    label: PROMOTION_STATUS_META[PromotionStatus.Draft].label,
    icon: PROMOTION_STATUS_META[PromotionStatus.Draft].icon,
  },
  {
    id: PromotionStatus.Paused,
    label: PROMOTION_STATUS_META[PromotionStatus.Paused].label,
    icon: PROMOTION_STATUS_META[PromotionStatus.Paused].icon,
  },
  {
    id: PromotionStatus.Expired,
    label: PROMOTION_STATUS_META[PromotionStatus.Expired].label,
    icon: PROMOTION_STATUS_META[PromotionStatus.Expired].icon,
  },
  {
    id: PromotionStatus.Cancelled,
    label: PROMOTION_STATUS_META[PromotionStatus.Cancelled].label,
    icon: PROMOTION_STATUS_META[PromotionStatus.Cancelled].icon,
  },
];

export function isPromotionExpired(endDate: string): boolean {
  return new Date(endDate) < new Date();
}
