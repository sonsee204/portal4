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

export { VenueAction };

export type VenuePermissionSet = VenueAction[];

export function canVenueAction(
  permissions: VenuePermissionSet | null | undefined,
  action: VenueAction,
): boolean {
  if (!permissions?.length) return false;
  return permissions.includes(action);
}

export function canAnyVenueAction(
  permissions: VenuePermissionSet | null | undefined,
  actions: VenueAction[],
): boolean {
  if (!permissions?.length) return false;
  return actions.some((action) => permissions.includes(action));
}

export function canAllVenueActions(
  permissions: VenuePermissionSet | null | undefined,
  actions: VenueAction[],
): boolean {
  if (!permissions?.length) return false;
  return actions.every((action) => permissions.includes(action));
}

/** Maps owner routes to required venue actions (any match grants access). */
export const OWNER_ROUTE_VENUE_ACTIONS: Record<string, VenueAction[]> = {
  '/owner/venues': [VenueAction.View],
  '/owner/calendar': [VenueAction.ViewBookings],
  '/owner/bookings': [VenueAction.ViewBookings],
  '/owner/orders': [VenueAction.ViewOrders],
  '/owner/products': [VenueAction.ManageProducts],
  '/owner/finance': [VenueAction.ViewAnalytics],
  '/owner/analytics': [VenueAction.ViewAnalytics],
};

export function canAccessOwnerRoute(
  pathname: string,
  permissions: VenuePermissionSet | null | undefined,
  isOwner: boolean,
): boolean {
  if (pathname.startsWith('/owner/staff')) {
    return isOwner;
  }
  if (pathname.startsWith('/owner/venues/')) {
    return canVenueAction(permissions, VenueAction.View);
  }

  const normalized =
    pathname.endsWith('/') && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  for (const [route, actions] of Object.entries(OWNER_ROUTE_VENUE_ACTIONS)) {
    if (normalized === route || normalized.startsWith(`${route}/`)) {
      return canAnyVenueAction(permissions, actions);
    }
  }

  return true;
}
