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

import { PaymentMethod } from '@/graphql/generated';

export const FINANCE_PAGE_SIZE = 20;

export type OwnerFinancePageTab = 'portfolio' | 'finance' | 'operations';

export const FINANCE_PAGE_TABS = [
  { label: 'Tổng quan', value: 'portfolio' },
  { label: 'Tài chính', value: 'finance' },
  { label: 'Vận hành sân', value: 'operations' },
] as const;

export const COMPARE_MODE_OPTIONS = [
  { label: 'Kỳ trước (cùng độ dài)', value: 'PREVIOUS_PERIOD' },
  { label: 'Cùng kỳ năm trước', value: 'SAME_PERIOD_LAST_YEAR' },
];

export const SCHEDULE_TYPE_FILTER_OPTIONS = [
  { label: 'Tất cả loại lịch', value: '' },
  { label: 'Cố định', value: 'FIXED' },
  { label: 'Lẻ', value: 'SINGLE' },
];

export const ORDER_TYPE_FILTER_OPTIONS = [
  { label: 'Tất cả loại đơn', value: '' },
  { label: 'Đặt sân', value: 'BOOKING' },
  { label: 'Không phải đặt sân', value: 'NON_BOOKING' },
];

export type OrderTypeCategoryFilter =
  | ''
  | 'BOOKING'
  | 'NON_BOOKING';

export const PAYMENT_METHOD_FILTER_OPTIONS = [
  { label: 'Tất cả phương thức', value: '' },
  { label: 'Tiền mặt', value: PaymentMethod.Cash },
  { label: 'Chuyển khoản', value: PaymentMethod.BankTransfer },
  { label: 'MoMo', value: PaymentMethod.Momo },
  { label: 'ZaloPay', value: PaymentMethod.Zalopay },
  { label: 'VNPay', value: PaymentMethod.Vnpay },
  { label: 'Thẻ', value: PaymentMethod.Card },
];

export const EXPENSE_CATEGORY_OPTIONS = [
  { label: 'Thuê mặt bằng', value: 'RENT' },
  { label: 'Lương nhân viên', value: 'SALARY' },
  { label: 'Điện nước', value: 'UTILITIES' },
  { label: 'Bảo trì', value: 'MAINTENANCE' },
  { label: 'Tiếp thị', value: 'MARKETING' },
  { label: 'Vật tư', value: 'SUPPLIES' },
  { label: 'Thuế & phí', value: 'TAX' },
  { label: 'Khác', value: 'OTHER' },
];

export const EXPENSE_CATEGORY_LABELS = Object.fromEntries(
  EXPENSE_CATEGORY_OPTIONS.map((option) => [option.value, option.label]),
);

export const EXPENSE_COVERAGE_PRESETS = [
  { label: '1 tháng', months: 1 },
  { label: '3 tháng', months: 3 },
  { label: '6 tháng', months: 6 },
  { label: '12 tháng', months: 12 },
] as const;
