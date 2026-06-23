/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { OrderType } from '@/graphql/generated';

/** Default Ionicon names for POS order types (also scanned by scripts/sync-icons.mjs). */
export const ORDER_TYPE_ION_ICON_NAMES = [
  'bag-handle-outline',
  'bag-outline',
  'calendar-outline',
  'card-outline',
  'cart-outline',
  'location-outline',
  'restaurant-outline',
  'school-outline',
  'swap-horizontal-outline',
] as const;

/** Literal hints so sync-icons copies dynamic venue order-type SVGs. */
export const ORDER_TYPE_ICON_SYNC_HINTS: Array<{ icon: string }> =
  ORDER_TYPE_ION_ICON_NAMES.map((icon) => ({ icon }));

const ORDER_TYPE_DEFAULT_ICON: Partial<Record<OrderType, string>> = {
  [OrderType.Retail]: 'cart-outline',
  [OrderType.DineIn]: 'restaurant-outline',
  [OrderType.Takeaway]: 'bag-handle-outline',
  [OrderType.DeliveryToCourt]: 'location-outline',
  [OrderType.Rental]: 'swap-horizontal-outline',
  [OrderType.Training]: 'school-outline',
  [OrderType.Membership]: 'card-outline',
  [OrderType.Booking]: 'calendar-outline',
};

/**
 * Venue order-type configs (mobile / backend defaults) store short Ionicons
 * names (`cart`, `bag-handle`). Portal IonIcon loads `/svg/{name}.svg`.
 */
export function resolveOrderTypeIonIcon(
  icon?: string | null,
  orderType?: OrderType | string | null,
): string {
  const fallback =
    (orderType ? ORDER_TYPE_DEFAULT_ICON[orderType as OrderType] : undefined) ??
    'cart-outline';

  const raw = icon?.trim();
  if (!raw) return fallback;

  if (raw.endsWith('-outline') || raw.endsWith('-sharp')) {
    return raw;
  }

  return `${raw}-outline`;
}
