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
import { VenueStaffStatus } from '@/graphql/generated';

export const STAFF_STATUS_CHIPS: FilterChip[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Đang hoạt động', value: VenueStaffStatus.Active },
  { label: 'Chờ xác nhận', value: VenueStaffStatus.Pending },
  { label: 'Ngưng hoạt động', value: VenueStaffStatus.Inactive },
];

export type StaffStatusFilterValue =
  | 'ALL'
  | VenueStaffStatus.Active
  | VenueStaffStatus.Pending
  | VenueStaffStatus.Inactive;
