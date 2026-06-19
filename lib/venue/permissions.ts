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

function hasDirectPermission(
  permissions: VenuePermissionSet | null | undefined,
  action: VenueAction,
): boolean {
  return permissions?.includes(action) ?? false;
}

/** Mirror backend resolveVenueActionFromStaff implied grants. */
export function resolveVenueAction(
  permissions: VenuePermissionSet | null | undefined,
  action: VenueAction,
): boolean {
  if (!permissions?.length) return false;
  if (hasDirectPermission(permissions, action)) return true;

  if (action === VenueAction.ViewBookings) {
    return (
      hasDirectPermission(permissions, VenueAction.ApproveBooking) ||
      hasDirectPermission(permissions, VenueAction.CreateBooking)
    );
  }

  if (action === VenueAction.ViewOrders) {
    return hasDirectPermission(permissions, VenueAction.CreateOrder);
  }

  return false;
}

export function canVenueAction(
  permissions: VenuePermissionSet | null | undefined,
  action: VenueAction,
): boolean {
  return resolveVenueAction(permissions, action);
}

export function canAnyVenueAction(
  permissions: VenuePermissionSet | null | undefined,
  actions: VenueAction[],
): boolean {
  if (!permissions?.length) return false;
  return actions.some((action) => resolveVenueAction(permissions, action));
}

export function canAllVenueActions(
  permissions: VenuePermissionSet | null | undefined,
  actions: VenueAction[],
): boolean {
  if (!permissions?.length) return false;
  return actions.every((action) => resolveVenueAction(permissions, action));
}

/** Maps owner routes to required venue actions (any match grants access). */
export const OWNER_ROUTE_VENUE_ACTIONS: Record<string, VenueAction[]> = {
  '/owner': [VenueAction.View],
  '/owner/venues': [VenueAction.View],
  '/owner/calendar': [VenueAction.ViewBookings],
  '/owner/bookings': [VenueAction.ViewBookings],
  '/owner/orders': [VenueAction.ViewOrders],
  '/owner/products': [VenueAction.ManageProducts],
  '/owner/promotions': [VenueAction.ManagePromotions],
  '/owner/stats': [VenueAction.ViewAnalytics],
  '/owner/finance': [VenueAction.ViewAnalytics],
  '/owner/analytics': [VenueAction.ViewAnalytics],
};

function normalizePathname(pathname: string): string {
  return pathname.endsWith('/') && pathname.length > 1
    ? pathname.slice(0, -1)
    : pathname;
}

const SORTED_OWNER_ROUTES = Object.entries(OWNER_ROUTE_VENUE_ACTIONS).sort(
  (a, b) => b[0].length - a[0].length,
);

function matchesOwnerRoute(normalized: string, route: string): boolean {
  if (route === '/owner') {
    return normalized === '/owner';
  }
  return normalized === route || normalized.startsWith(`${route}/`);
}

export function canAccessOwnerRoute(
  pathname: string,
  permissions: VenuePermissionSet | null | undefined,
  isVenueOwner: boolean,
): boolean {
  const normalized = normalizePathname(pathname);

  if (normalized.startsWith('/owner/staff')) {
    return isVenueOwner;
  }

  if (normalized.startsWith('/owner/venues/')) {
    return isVenueOwner || canVenueAction(permissions, VenueAction.View);
  }

  for (const [route, actions] of SORTED_OWNER_ROUTES) {
    if (matchesOwnerRoute(normalized, route)) {
      if (isVenueOwner) return true;
      return canAnyVenueAction(permissions, actions);
    }
  }

  return false;
}
