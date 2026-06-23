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

import {
  PromotionApplyLevel,
  PromotionCategory,
  PromotionScope,
  PromotionTrigger,
  PromotionType,
} from '@/graphql/generated';

export const PROMOTION_TYPES: Array<{
  id: PromotionType;
  label: string;
  description: string;
  descriptionPerHour: string;
  icon: string;
}> = [
  {
    id: PromotionType.Percentage,
    label: 'Phần trăm',
    description: 'Giảm theo % đơn',
    descriptionPerHour: 'Giảm theo %/giờ',
    icon: 'trending-down-outline',
  },
  {
    id: PromotionType.FixedAmount,
    label: 'Số tiền',
    description: 'Giảm số tiền cố định',
    descriptionPerHour: 'Giảm số tiền/giờ',
    icon: 'cash-outline',
  },
];

export const APPLY_LEVEL_OPTIONS: Array<{
  id: PromotionApplyLevel;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: PromotionApplyLevel.Total,
    label: 'Trên tổng đơn',
    description: 'Giảm trên tổng giá trị đơn',
    icon: 'receipt-outline',
  },
  {
    id: PromotionApplyLevel.PerHour,
    label: 'Theo giờ đặt',
    description: 'Giảm theo từng giờ đặt sân',
    icon: 'timer-outline',
  },
];

export const PROMOTION_CATEGORY_META: Array<{
  id: PromotionCategory;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: PromotionCategory.Voucher,
    label: 'Voucher',
    icon: 'ticket-outline',
    description: 'Mã giảm giá',
  },
  {
    id: PromotionCategory.FirstBooking,
    label: 'Lần đầu đặt',
    icon: 'star-outline',
    description: 'Khách mới',
  },
  {
    id: PromotionCategory.Loyalty,
    label: 'Khách thân thiết',
    icon: 'heart-outline',
    description: 'Khách quen',
  },
  {
    id: PromotionCategory.Recurring,
    label: 'Đặt cố định',
    icon: 'repeat-outline',
    description: 'Đặt theo tháng',
  },
];

export const PROMOTION_SCOPE_META: Array<{
  id: PromotionScope;
  label: string;
  icon: string;
  description: string;
}> = [
  {
    id: PromotionScope.AllCourts,
    label: 'Tất cả sân',
    icon: 'grid-outline',
    description: 'Áp dụng cho mọi sân trong cơ sở',
  },
  {
    id: PromotionScope.SpecificCourts,
    label: 'Sân cụ thể',
    icon: 'location-outline',
    description: 'Chọn sân áp dụng',
  },
  {
    id: PromotionScope.SpecificSport,
    label: 'Môn thể thao',
    icon: 'football-outline',
    description: 'Theo môn thể thao',
  },
  {
    id: PromotionScope.Products,
    label: 'Sản phẩm',
    icon: 'bag-handle-outline',
    description: 'Áp dụng cho sản phẩm/dịch vụ',
  },
  {
    id: PromotionScope.All,
    label: 'Tất cả',
    icon: 'apps-outline',
    description: 'Cả sân và sản phẩm',
  },
];

export const PROMOTION_TRIGGERS: Array<{
  id: PromotionTrigger;
  label: string;
  description: string;
}> = [
  {
    id: PromotionTrigger.Auto,
    label: 'Tự động',
    description: 'Tự áp dụng khi đủ điều kiện',
  },
  {
    id: PromotionTrigger.Code,
    label: 'Nhập mã',
    description: 'Khách nhập mã để áp dụng',
  },
];

export const PROMOTION_DISCOUNT_TYPE_CONFIG: Record<
  PromotionType,
  { label: string; format: (v: number) => string }
> = {
  [PromotionType.Percentage]: { label: 'Phần trăm', format: (v) => `${v}%` },
  [PromotionType.FixedAmount]: {
    label: 'Số tiền',
    format: (v) => new Intl.NumberFormat('vi-VN').format(v) + 'đ',
  },
};

export const CATEGORY_COLOR_MAP: Record<PromotionCategory, string> = {
  [PromotionCategory.Voucher]: '#8B5CF6',
  [PromotionCategory.FirstBooking]: '#22C55E',
  [PromotionCategory.Loyalty]: '#EF4444',
  [PromotionCategory.Recurring]: '#3B82F6',
};

/** Scopes hidden when category is RECURRING */
export function getAvailableScopes(
  category: PromotionCategory,
): PromotionScope[] {
  if (category === PromotionCategory.Recurring) {
    return [
      PromotionScope.AllCourts,
      PromotionScope.SpecificCourts,
      PromotionScope.SpecificSport,
    ];
  }
  return PROMOTION_SCOPE_META.map((s) => s.id);
}
