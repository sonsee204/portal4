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

export const ORDER_TYPE_LABEL: Record<string, string> = {
  BOOKING: 'Đặt sân',
  booking: 'Đặt sân',
  DINE_IN: 'Tại quán',
  dine_in: 'Tại quán',
  TAKEAWAY: 'Mang đi',
  takeaway: 'Mang đi',
  DELIVERY_TO_COURT: 'Giao ra sân',
  delivery_to_court: 'Giao ra sân',
  RENTAL: 'Cho thuê',
  rental: 'Cho thuê',
  RETAIL: 'Bán lẻ',
  retail: 'Bán lẻ',
  MEMBERSHIP: 'Thành viên',
  membership: 'Thành viên',
  TRAINING: 'Huấn luyện',
  training: 'Huấn luyện',
};

export function formatOrderTypeLabel(value?: string | null): string {
  if (!value) return '—';
  return ORDER_TYPE_LABEL[value] ?? ORDER_TYPE_LABEL[value.toUpperCase()] ?? value;
}
