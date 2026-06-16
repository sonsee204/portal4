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

interface ViewOrderDetailButtonProps {
  orderId: string;
  onOpen: (orderId: string) => void;
  disabled?: boolean;
}

export function ViewOrderDetailButton({
  orderId,
  onOpen,
  disabled = false,
}: ViewOrderDetailButtonProps) {
  return (
    <IconButton
      icon="eye-outline"
      size="sm"
      tooltip="Xem chi tiết"
      aria-label="Xem chi tiết"
      disabled={disabled}
      onClick={() => onOpen(orderId)}
    />
  );
}
