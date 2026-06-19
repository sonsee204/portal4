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

import type { FilterChip } from '@/components/molecules/FilterChips';
import type { TabItem } from '@/components/molecules/TabGroup';
import { OrderPaymentStatus, OrderStatus, OrderType } from '@/graphql/generated';
import { ORDER_PAYMENT_STATUS_LABEL } from '@/lib/constants/order-status';

export const PAGE_SIZE = 20;

export type OrderViewTab = 'all' | 'booking' | 'non_booking';

export const ORDER_VIEW_TABS: TabItem[] = [
  { label: 'Tất cả đơn', value: 'all' },
  { label: 'Đơn đặt sân', value: 'booking' },
  { label: 'Đơn không phải đặt sân', value: 'non_booking' },
];

/** Mọi loại đơn trừ đặt sân — khớp finance `NON_BOOKING`. */
export const NON_BOOKING_ORDER_TYPES: OrderType[] = [
  OrderType.Training,
  OrderType.DineIn,
  OrderType.Takeaway,
  OrderType.DeliveryToCourt,
  OrderType.Retail,
  OrderType.Rental,
  OrderType.Membership,
];

export const ORDER_STATUS_CHIPS: FilterChip[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Chờ xử lý', value: OrderStatus.Pending },
  { label: 'Đã xác nhận', value: OrderStatus.Confirmed },
  { label: 'Đang chuẩn bị', value: OrderStatus.Preparing },
  { label: 'Sẵn sàng', value: OrderStatus.Ready },
  { label: 'Hoàn thành', value: OrderStatus.Completed },
  { label: 'Đã hủy', value: OrderStatus.Cancelled },
];

export const ORDER_PAYMENT_STATUS_CHIPS: FilterChip[] = [
  { label: 'Tất cả', value: 'ALL' },
  {
    label: ORDER_PAYMENT_STATUS_LABEL.PENDING,
    value: OrderPaymentStatus.Pending,
  },
  {
    label: ORDER_PAYMENT_STATUS_LABEL.PARTIAL,
    value: OrderPaymentStatus.Partial,
  },
  { label: ORDER_PAYMENT_STATUS_LABEL.PAID, value: OrderPaymentStatus.Paid },
  {
    label: ORDER_PAYMENT_STATUS_LABEL.REFUND_PARTIAL,
    value: OrderPaymentStatus.RefundPartial,
  },
  {
    label: ORDER_PAYMENT_STATUS_LABEL.REFUNDED,
    value: OrderPaymentStatus.Refunded,
  },
  {
    label: ORDER_PAYMENT_STATUS_LABEL.REFUND_PENDING,
    value: OrderPaymentStatus.RefundPending,
  },
];

export const FNB_ORDER_TYPES = new Set([
  'DINE_IN',
  'TAKEAWAY',
  'DELIVERY_TO_COURT',
]);

export const ORDER_TYPE_LABEL: Record<string, string> = {
  BOOKING: 'Đặt sân',
  DINE_IN: 'Tại quán',
  TAKEAWAY: 'Mang đi',
  DELIVERY_TO_COURT: 'Giao ra sân',
  RENTAL: 'Cho thuê',
  RETAIL: 'Bán lẻ',
  MEMBERSHIP: 'Thành viên',
  TRAINING: 'Huấn luyện',
};
