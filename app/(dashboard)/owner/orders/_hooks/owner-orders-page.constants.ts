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
import { OrderStatus } from '@/graphql/generated';

export const PAGE_SIZE = 20;

export const ORDER_VIEW_TABS: TabItem[] = [
  { label: 'Tất cả đơn', value: 'all' },
  { label: 'Chờ hoàn tiền', value: 'pending_refund' },
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
