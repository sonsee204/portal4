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

import type { FilterChip } from '@/components/molecules/FilterChips';
import {
  PROMOTION_STATUS_FILTERS,
  type PromotionStatusFilter,
} from '@/lib/promotion/promotion-status';

export const PAGE_SIZE = 20;

export const PROMOTION_STATUS_CHIPS: FilterChip[] = PROMOTION_STATUS_FILTERS.map(
  (filter) => ({
    label: filter.label,
    value: filter.id,
  }),
);

export type { PromotionStatusFilter };
