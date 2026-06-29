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
import { ALL_VENUE_ACTIONS } from '@/lib/venue/venue-action-labels';

export interface PermissionGroup {
  id: string;
  title: string;
  icon: string;
  permissions: VenueAction[];
}

/** Permissions assignable to staff */
export const STAFF_ASSIGNABLE_ACTIONS: VenueAction[] = [...ALL_VENUE_ACTIONS];

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: 'venue',
    title: 'Quản lý Venue',
    icon: 'business-outline',
    permissions: [VenueAction.View, VenueAction.Edit],
  },
  {
    id: 'booking',
    title: 'Đặt sân',
    icon: 'calendar-outline',
    permissions: [
      VenueAction.ViewBookings,
      VenueAction.CreateBooking,
      VenueAction.ApproveBooking,
    ],
  },
  {
    id: 'orders',
    title: 'Đơn hàng',
    icon: 'cart-outline',
    permissions: [
      VenueAction.ViewOrders,
      VenueAction.CreateOrder,
      VenueAction.CancelOrder,
    ],
  },
  {
    id: 'products',
    title: 'Sản phẩm',
    icon: 'cube-outline',
    permissions: [VenueAction.ManageProducts],
  },
  {
    id: 'promotions',
    title: 'Khuyến mãi',
    icon: 'pricetag-outline',
    permissions: [VenueAction.ManagePromotions],
  },
  {
    id: 'analytics',
    title: 'Thống kê & Dữ liệu',
    icon: 'analytics-outline',
    permissions: [VenueAction.ViewAnalytics, VenueAction.ViewSensitiveData],
  },
  {
    id: 'finance',
    title: 'Tài chính',
    icon: 'cash-outline',
    permissions: [VenueAction.ManageExpenses, VenueAction.OverridePrice],
  },
];

export const PERMISSION_PRESETS = {
  receptionist: {
    label: 'Lễ tân',
    description: 'Xem đặt sân và đơn hàng',
    permissions: [
      VenueAction.View,
      VenueAction.ViewBookings,
      VenueAction.ViewOrders,
    ],
  },
  bookingManager: {
    label: 'Quản lý đặt sân',
    description: 'Quản lý và duyệt đặt sân',
    permissions: [
      VenueAction.View,
      VenueAction.ViewBookings,
      VenueAction.CreateBooking,
      VenueAction.ApproveBooking,
    ],
  },
  orderManager: {
    label: 'Quản lý đơn hàng',
    description: 'Quản lý đơn hàng và sản phẩm',
    permissions: [
      VenueAction.View,
      VenueAction.ViewOrders,
      VenueAction.CreateOrder,
      VenueAction.CancelOrder,
      VenueAction.ManageProducts,
    ],
  },
  promotionManager: {
    label: 'Quản lý khuyến mãi',
    description: 'Tạo và quản lý khuyến mãi',
    permissions: [
      VenueAction.View,
      VenueAction.ManagePromotions,
    ],
  },
  fullStaff: {
    label: 'Nhân viên toàn quyền',
    description: 'Tất cả quyền nhân viên',
    permissions: STAFF_ASSIGNABLE_ACTIONS,
  },
} as const;

export type PermissionPresetKey = keyof typeof PERMISSION_PRESETS;

export function getPresetToggleablePermissions(
  key: PermissionPresetKey,
): VenueAction[] {
  return PERMISSION_PRESETS[key].permissions.filter(
    (action) => !isDefaultPermission(action),
  );
}

export function isPresetFullySelected(
  selected: VenueAction[],
  key: PermissionPresetKey,
): boolean {
  const toggleable = getPresetToggleablePermissions(key);
  if (toggleable.length === 0) {
    return true;
  }
  return toggleable.every((action) => selected.includes(action));
}

export function togglePresetPermissions(
  selected: VenueAction[],
  key: PermissionPresetKey,
): VenueAction[] {
  const toggleable = getPresetToggleablePermissions(key);
  if (toggleable.length === 0) {
    return selected;
  }

  if (isPresetFullySelected(selected, key)) {
    return selected.filter((action) => !toggleable.includes(action));
  }

  return [...new Set([...selected, ...toggleable])];
}

export const DEFAULT_VENUE_PERMISSIONS: VenueAction[] = [VenueAction.View];

export function isDefaultPermission(permission: VenueAction): boolean {
  return DEFAULT_VENUE_PERMISSIONS.includes(permission);
}

export function getImpliedPermissionHint(action: VenueAction): string | null {
  if (action === VenueAction.CreateBooking) {
    return 'Tự bao gồm: Xem lịch đặt sân';
  }
  if (action === VenueAction.ApproveBooking) {
    return 'Tự bao gồm: Xem lịch đặt sân';
  }
  if (action === VenueAction.CreateOrder) {
    return 'Tự bao gồm: Xem đơn hàng';
  }
  return null;
}
