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

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/atoms/Avatar';
import type { AvatarStatus } from '@/config/theme';

export interface UserCellProps {
  name: string;
  subtitle?: string;
  src?: string;
  status?: AvatarStatus;
  className?: string;
}

export function UserCell({
  name,
  subtitle,
  src,
  status,
  className,
}: UserCellProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Avatar src={src} alt={name} status={status} size="md" />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-heading">{name}</p>
        {subtitle && (
          <p className="truncate text-xs text-faint">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
