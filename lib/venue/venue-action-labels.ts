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

import { VenueAction } from '@/graphql/generated';

export const ALL_VENUE_ACTIONS: VenueAction[] = Object.values(VenueAction);

export const DEFAULT_VENUE_PERMISSIONS: VenueAction[] = [VenueAction.View];

export const CONFIGURABLE_VENUE_ACTIONS: VenueAction[] = ALL_VENUE_ACTIONS.filter(
  (action) => !DEFAULT_VENUE_PERMISSIONS.includes(action),
);

export const VENUE_ACTION_LABELS: Record<VenueAction, string> = {
  [VenueAction.View]: 'Xem thông tin sân',
  [VenueAction.Edit]: 'Chỉnh sửa thông tin sân',
  [VenueAction.ViewAnalytics]: 'Xem thống kê',
  [VenueAction.ViewBookings]: 'Xem lịch đặt sân',
  [VenueAction.CreateBooking]: 'Tạo đặt sân cho khách',
  [VenueAction.ApproveBooking]: 'Duyệt/Huỷ đặt sân',
  [VenueAction.ViewOrders]: 'Xem đơn hàng',
  [VenueAction.CreateOrder]: 'Tạo đơn hàng',
  [VenueAction.CancelOrder]: 'Hủy đơn hàng',
  [VenueAction.ManageProducts]: 'Quản lý sản phẩm',
  [VenueAction.ManagePromotions]: 'Quản lý khuyến mãi',
  [VenueAction.ManageExpenses]: 'Quản lý chi phí',
  [VenueAction.ViewSensitiveData]: 'Xem thông tin nhạy cảm',
  [VenueAction.OverridePrice]: 'Điều chỉnh giá thủ công',
};

export function getVenueActionLabel(action: VenueAction): string {
  return VENUE_ACTION_LABELS[action] ?? action;
}

export function mergeVenuePermissions(
  selected: VenueAction[],
): VenueAction[] {
  const merged = new Set([...DEFAULT_VENUE_PERMISSIONS, ...selected]);
  return Array.from(merged);
}

export function formatVenuePermissions(permissions: VenueAction[]): string {
  if (permissions.length === 0) return '—';
  return permissions.map(getVenueActionLabel).join(', ');
}
