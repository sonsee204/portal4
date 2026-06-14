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

import type { UserRole, User } from '@/types';

export function getRoleBadgeVariant(
  role: UserRole
): 'info' | 'success' | 'warning' | 'neutral' | 'danger' {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'danger';
    case 'ADMIN':
      return 'info';
    case 'FACILITY_OWNER':
      return 'success';
    case 'PLAYER':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export function getStatusBadge(user: User) {
  if (user.isSuspended)
    return { variant: 'danger' as const, label: 'Bị khóa', dot: true };
  if (user.isActive)
    return { variant: 'success' as const, label: 'Hoạt động', dot: true };
  return { variant: 'neutral' as const, label: 'Không hoạt động', dot: true };
}
