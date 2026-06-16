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

export const FINANCE_PAGE_SIZE = 20;

export const ORDER_TYPE_FILTER_OPTIONS = [
  { label: 'Tất cả loại đơn', value: '' },
  { label: 'Đặt sân', value: 'booking' },
  { label: 'Tại chỗ', value: 'dine_in' },
  { label: 'Mang đi', value: 'takeaway' },
  { label: 'Giao ra sân', value: 'delivery_to_court' },
  { label: 'Bán lẻ', value: 'retail' },
];

export const PAYMENT_METHOD_FILTER_OPTIONS = [
  { label: 'Tất cả phương thức', value: '' },
  { label: 'Tiền mặt', value: 'cash' },
  { label: 'Chuyển khoản', value: 'bank_transfer' },
  { label: 'MoMo', value: 'momo' },
  { label: 'ZaloPay', value: 'zalopay' },
  { label: 'VNPay', value: 'vnpay' },
  { label: 'Thẻ', value: 'card' },
];

export const EXPENSE_CATEGORY_OPTIONS = [
  { label: 'Thuê mặt bằng', value: 'RENT' },
  { label: 'Lương nhân viên', value: 'SALARY' },
  { label: 'Điện nước', value: 'UTILITIES' },
  { label: 'Bảo trì', value: 'MAINTENANCE' },
  { label: 'Marketing', value: 'MARKETING' },
  { label: 'Vật tư', value: 'SUPPLIES' },
  { label: 'Thuế & phí', value: 'TAX' },
  { label: 'Khác', value: 'OTHER' },
];

export const EXPENSE_CATEGORY_LABELS = Object.fromEntries(
  EXPENSE_CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
);
