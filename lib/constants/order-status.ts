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

export const ORDER_STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'danger' | 'info' | 'neutral'
> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  PREPARING: 'warning',
  READY: 'info',
  DELIVERED: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  IN_PROGRESS: 'Đang thực hiện',
  PREPARING: 'Đang chuẩn bị',
  READY: 'Sẵn sàng',
  DELIVERED: 'Đã giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export const ORDER_PAYMENT_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chưa thanh toán',
  PARTIAL: 'Thanh toán một phần',
  PAID: 'Đã thanh toán',
  REFUND_PENDING: 'Chờ hoàn tiền',
  REFUND_PARTIAL: 'Hoàn tiền một phần',
  REFUNDED: 'Đã hoàn tiền',
};

export const ORDER_PAYMENT_STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'danger' | 'info' | 'neutral'
> = {
  PENDING: 'warning',
  PARTIAL: 'warning',
  PAID: 'success',
  REFUND_PENDING: 'warning',
  REFUND_PARTIAL: 'info',
  REFUNDED: 'neutral',
};
