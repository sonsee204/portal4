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
import { DATA_TABLE_ACTIONS_INNER_CLASS } from '@/components/organisms/DataTable';
import type { VenueStaffNode } from '@/hooks/owner';
import { cn } from '@/lib/utils';

interface StaffRowActionsProps {
  member: VenueStaffNode;
  disabled?: boolean;
  onEdit: (member: VenueStaffNode) => void;
  onRemove: (member: VenueStaffNode) => void;
}

const toneClassName = {
  primary: 'text-primary hover:text-primary hover:bg-primary/10',
  danger: 'text-red-500 hover:text-red-600 hover:bg-red-500/10',
} as const;

export function StaffRowActions({
  member,
  disabled,
  onEdit,
  onRemove,
}: StaffRowActionsProps) {
  return (
    <div className={DATA_TABLE_ACTIONS_INNER_CLASS}>
      <IconButton
        icon="create-outline"
        size="sm"
        tooltip="Sửa quyền"
        aria-label="Sửa quyền"
        disabled={disabled}
        className={toneClassName.primary}
        onClick={() => onEdit(member)}
      />
      <IconButton
        icon="trash-outline"
        size="sm"
        tooltip="Xóa"
        aria-label="Xóa"
        disabled={disabled}
        className={cn(toneClassName.danger)}
        onClick={() => onRemove(member)}
      />
    </div>
  );
}
