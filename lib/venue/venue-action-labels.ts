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

/** Short descriptions for staff permission UI. */
export const VENUE_ACTION_DESCRIPTIONS: Partial<Record<VenueAction, string>> = {
  [VenueAction.View]: 'Quyền mặc định — truy cập dashboard và thông tin cơ sở',
  [VenueAction.Edit]:
    'Chỉnh sửa thông tin sân, giờ hoạt động và quản lý sân con',
  [VenueAction.ViewAnalytics]:
    'Báo cáo tài chính, biểu đồ và thống kê vận hành trên portal/mobile',
  [VenueAction.ViewBookings]: 'Xem danh sách lịch đặt sân và chi tiết đặt sân',
  [VenueAction.CreateBooking]:
    'Tạo đặt sân hộ khách — tự bao gồm xem lịch đặt sân',
  [VenueAction.ApproveBooking]: 'Duyệt, từ chối hoặc hủy đơn đặt sân',
  [VenueAction.ViewOrders]: 'Xem danh sách đơn hàng / POS',
  [VenueAction.CreateOrder]: 'Tạo và chỉnh sửa đơn hàng — tự bao gồm xem đơn',
  [VenueAction.CancelOrder]: 'Hủy đơn hàng',
  [VenueAction.ManageProducts]: 'Thêm, sửa, xóa sản phẩm và F&B',
  [VenueAction.ManagePromotions]: 'Tạo và quản lý khuyến mãi',
  [VenueAction.ViewSensitiveData]:
    'Doanh thu, P&L và dữ liệu nhạy cảm khác',
  [VenueAction.OverridePrice]:
    'Điều chỉnh giá thủ công, bỏ qua giá hệ thống',
  [VenueAction.ManageExpenses]:
    'Ghi nhận và quản lý chi phí vận hành trên báo cáo tài chính',
};

export function getVenueActionDescription(action: VenueAction): string {
  return VENUE_ACTION_DESCRIPTIONS[action] ?? '';
}

export function mergeVenuePermissions(
  selected: VenueAction[],
): VenueAction[] {
  const merged = new Set([...DEFAULT_VENUE_PERMISSIONS, ...selected]);
  return Array.from(merged);
}

export function formatVenuePermissions(
  permissions: VenueAction[] | null | undefined,
): string {
  if (!permissions || permissions.length === 0) return '—';
  return permissions.map(getVenueActionLabel).join(', ');
}

export function formatVenuePermissionSummary(
  permissions: VenueAction[] | null | undefined,
): string {
  if (!permissions || permissions.length === 0) return '—';
  const configurable = permissions.filter(
    (action) => !DEFAULT_VENUE_PERMISSIONS.includes(action),
  );
  const count = configurable.length > 0 ? configurable.length : permissions.length;
  if (count <= 2) {
    return formatVenuePermissions(permissions);
  }
  return `${count} quyền`;
}
