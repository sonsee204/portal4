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
import { filterNavByRole } from '@/components/organisms/Sidebar';
import { buildSidebarNav } from '@/lib/permissions/navigation';

describe('filterNavByRole', () => {
  const ownerNav = buildSidebarNav('owner');

  it('shows owner nav items for PLAYER with venue access', () => {
    const filtered = filterNavByRole(ownerNav, 'PLAYER', false, true, {
      venues: [
        {
          isOwner: false,
          myPermissions: [
            VenueAction.View,
            VenueAction.ViewBookings,
            VenueAction.ViewOrders,
          ],
        },
      ],
      permissions: [
        VenueAction.View,
        VenueAction.ViewBookings,
        VenueAction.ViewOrders,
      ],
      isVenueOwner: false,
    });

    const hrefs = filtered.flatMap((section) =>
      section.items.map((item) => item.href),
    );

    expect(hrefs).toContain('/owner');
    expect(hrefs).toContain('/owner/bookings');
    expect(hrefs).toContain('/owner/orders');
    expect(hrefs).not.toContain('/owner/stats/finance');
    expect(hrefs).not.toContain('/owner/staff');
  });

  it('hides staff management for non-owner venue staff', () => {
    const filtered = filterNavByRole(ownerNav, 'PLAYER', false, true, {
      venues: [{ isOwner: false, myPermissions: [VenueAction.View] }],
      permissions: [VenueAction.View],
      isVenueOwner: false,
    });

    const hrefs = filtered.flatMap((section) =>
      section.items.map((item) => item.href),
    );

    expect(hrefs).not.toContain('/owner/staff');
  });

  it('shows staff management when user is venue owner on selected venue', () => {
    const filtered = filterNavByRole(ownerNav, 'FACILITY_OWNER', false, true, {
      venues: [{ isOwner: true, myPermissions: [VenueAction.View] }],
      permissions: [VenueAction.View],
      isVenueOwner: true,
    });

    const hrefs = filtered.flatMap((section) =>
      section.items.map((item) => item.href),
    );

    expect(hrefs).toContain('/owner/staff');
  });

  it('shows promotions nav when staff has ManagePromotions', () => {
    const filtered = filterNavByRole(ownerNav, 'PLAYER', false, true, {
      venues: [
        {
          isOwner: false,
          myPermissions: [VenueAction.View, VenueAction.ManagePromotions],
        },
      ],
      permissions: [VenueAction.View, VenueAction.ManagePromotions],
      isVenueOwner: false,
    });

    const hrefs = filtered.flatMap((section) =>
      section.items.map((item) => item.href),
    );

    expect(hrefs).toContain('/owner/promotions');
  });

  it('hides promotions nav when staff lacks ManagePromotions', () => {
    const filtered = filterNavByRole(ownerNav, 'PLAYER', false, true, {
      venues: [{ isOwner: false, myPermissions: [VenueAction.View] }],
      permissions: [VenueAction.View],
      isVenueOwner: false,
    });

    const hrefs = filtered.flatMap((section) =>
      section.items.map((item) => item.href),
    );

    expect(hrefs).not.toContain('/owner/promotions');
  });
});
