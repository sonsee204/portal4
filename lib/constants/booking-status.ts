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

export const BOOKING_STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'danger' | 'info' | 'neutral'
> = {
  CONFIRMED: 'info',
  COMPLETED: 'success',
  PENDING: 'warning',
  HOLD: 'warning',
  CANCELLED: 'danger',
  NO_SHOW: 'danger',
};

export const BOOKING_STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  PENDING: 'Chờ xử lý',
  HOLD: 'Giữ chỗ',
  HOLD_PENDING: 'Chờ duyệt giữ chỗ',
  HOLD_ACTIVE: 'Đang giữ chỗ',
  CANCELLED: 'Đã hủy',
  NO_SHOW: 'Vắng mặt',
  EXPIRED: 'Hết hạn',
  REJECTED: 'Từ chối',
};
