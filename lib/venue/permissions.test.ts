/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import { VenueAction } from '@/graphql/generated';
import {
  canAccessOwnerRoute,
  canVenueAction,
  OWNER_ROUTE_VENUE_ACTIONS,
  resolveVenueAction,
} from './permissions';
import {
  isPresetFullySelected,
  STAFF_ASSIGNABLE_ACTIONS,
  togglePresetPermissions,
} from './permission-groups';
import { CONFIGURABLE_VENUE_ACTIONS } from './venue-action-labels';

describe('venue permissions', () => {
  it('resolveVenueAction implied grants mirror backend', () => {
    expect(
      resolveVenueAction([VenueAction.ApproveBooking], VenueAction.ViewBookings),
    ).toBe(true);
    expect(
      resolveVenueAction([VenueAction.CreateBooking], VenueAction.ViewBookings),
    ).toBe(true);
    expect(
      resolveVenueAction([VenueAction.CreateOrder], VenueAction.ViewOrders),
    ).toBe(true);
    expect(
      resolveVenueAction([VenueAction.CreateBooking], VenueAction.ViewAnalytics),
    ).toBe(false);
  });

  it('canAccessOwnerRoute requires venue owner for staff page', () => {
    expect(canAccessOwnerRoute('/owner/staff', [VenueAction.View], false)).toBe(
      false,
    );
    expect(canAccessOwnerRoute('/owner/staff', [], true)).toBe(true);
  });

  it('canAccessOwnerRoute allows implied booking access', () => {
    expect(
      canAccessOwnerRoute(
        '/owner/bookings',
        [VenueAction.CreateBooking],
        false,
      ),
    ).toBe(true);
    expect(
      canAccessOwnerRoute('/owner/bookings', [VenueAction.View], false),
    ).toBe(false);
  });

  it('venue owner bypasses action checks on owner routes', () => {
    expect(canAccessOwnerRoute('/owner/stats/finance', [], true)).toBe(true);
    expect(canAccessOwnerRoute('/owner/products', [], true)).toBe(true);
  });

  it('fail-closed for unknown owner routes', () => {
    expect(canAccessOwnerRoute('/owner/unknown-route', [VenueAction.View], false)).toBe(
      false,
    );
  });

  it('canVenueAction delegates to resolveVenueAction', () => {
    expect(canVenueAction([VenueAction.CreateOrder], VenueAction.ViewOrders)).toBe(
      true,
    );
  });

  describe('OWNER_ROUTE_VENUE_ACTIONS matrix', () => {
    it.each(Object.entries(OWNER_ROUTE_VENUE_ACTIONS))(
      'route %s requires at least one of its mapped actions',
      (route, requiredActions) => {
        for (const action of requiredActions) {
          expect(
            canAccessOwnerRoute(route, [action], false),
            `${route} should allow staff with ${action}`,
          ).toBe(true);
        }

        const unrelated = [VenueAction.View].filter(
          (action) => !requiredActions.includes(action),
        );
        if (unrelated.length > 0 && route !== '/owner' && route !== '/owner/venues') {
          expect(
            canAccessOwnerRoute(route, unrelated, false),
            `${route} should deny unrelated View-only staff`,
          ).toBe(false);
        }
      },
    );

    it('nested owner routes inherit parent route permissions', () => {
      expect(
        canAccessOwnerRoute(
          '/owner/bookings/abc',
          [VenueAction.CreateBooking],
          false,
        ),
      ).toBe(true);
      expect(
        canAccessOwnerRoute('/owner/orders/123', [VenueAction.ViewOrders], false),
      ).toBe(true);
    });
  });
});

describe('permission preset toggles', () => {
  it('adds preset permissions without replacing existing selection', () => {
    const next = togglePresetPermissions(
      [VenueAction.ViewBookings],
      'receptionist'
    );

    expect(next).toEqual(
      expect.arrayContaining([
        VenueAction.ViewBookings,
        VenueAction.ViewOrders,
      ])
    );
  });

  it('marks every preset selected when all staff permissions are enabled', () => {
    const selected = [...CONFIGURABLE_VENUE_ACTIONS];

    expect(isPresetFullySelected(selected, 'receptionist')).toBe(true);
    expect(isPresetFullySelected(selected, 'bookingManager')).toBe(true);
    expect(isPresetFullySelected(selected, 'orderManager')).toBe(true);
    expect(isPresetFullySelected(selected, 'promotionManager')).toBe(true);
    expect(isPresetFullySelected([...STAFF_ASSIGNABLE_ACTIONS], 'fullStaff')).toBe(
      true,
    );
  });

  it('removes only the preset permissions when toggled off', () => {
    const selected = [...CONFIGURABLE_VENUE_ACTIONS];
    const next = togglePresetPermissions(selected, 'receptionist');

    expect(next).not.toContain(VenueAction.ViewBookings);
    expect(next).not.toContain(VenueAction.ViewOrders);
    expect(next).toContain(VenueAction.CreateBooking);
  });
});
