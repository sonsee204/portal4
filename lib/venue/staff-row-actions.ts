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

import { VenueStaffStatus } from '@/graphql/generated';
import type { VenueStaffNode } from '@/hooks/owner';

export type StaffRowActionMode = 'none' | 'edit' | 'remove' | 'cancelInvite';

export function getStaffRowActionMode(
  member: Pick<VenueStaffNode, 'isOwner' | 'status'>,
): StaffRowActionMode {
  if (member.isOwner) return 'none';
  if (member.status === VenueStaffStatus.Pending) return 'cancelInvite';
  if (member.status === VenueStaffStatus.Active) return 'edit';
  return 'none';
}

export function getStaffRemoveDialogCopy(
  member: Pick<VenueStaffNode, 'status'> & {
    user?: Pick<NonNullable<VenueStaffNode['user']>, 'displayName'> | null;
  },
): { title: string; description: string; confirmLabel: string } {
  const name = member.user?.displayName ?? 'nhân viên này';

  if (member.status === VenueStaffStatus.Pending) {
    return {
      title: 'Hủy lời mời',
      description: `Bạn có chắc muốn hủy lời mời gửi tới ${name}?`,
      confirmLabel: 'Hủy lời mời',
    };
  }

  return {
    title: 'Xóa nhân viên',
    description: `Bạn có chắc muốn xóa ${name} khỏi sân?`,
    confirmLabel: 'Xóa nhân viên',
  };
}
