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

export type BookingCustomerLabelSource = {
  customerDisplayName?: string | null;
  customer?: { displayName?: string | null } | null;
  customerInfo?: { name?: string | null; phone?: string | null } | null;
};

export function getBookingCustomerDisplayName(
  booking: BookingCustomerLabelSource,
  fallback = '—',
): string {
  return (
    booking.customerDisplayName?.trim() ||
    booking.customer?.displayName?.trim() ||
    booking.customerInfo?.name?.trim() ||
    fallback
  );
}

export function getBookingCustomerSearchText(
  booking: BookingCustomerLabelSource,
): string {
  return (
    booking.customerDisplayName?.trim() ||
    booking.customer?.displayName?.trim() ||
    booking.customerInfo?.name?.trim() ||
    ''
  ).toLowerCase();
}
