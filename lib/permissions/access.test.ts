/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import {
  can,
  canAccessPortal,
  canAccessRoute,
  canAccessWorkspace,
  getEffectivePermissions,
  getHomePath,
  hasOrganizerCapability,
  isAdminRole,
  isSuperAdminRole,
} from './access';
import { matchRouteManifest } from './route-manifest';

describe('portal access', () => {
  it('SUPER_ADMIN can access moderation and system settings', () => {
    expect(can('SUPER_ADMIN', 'moderation.manage')).toBe(true);
    expect(can('SUPER_ADMIN', 'system.settings')).toBe(true);
  });

  it('ADMIN cannot access moderation, system settings, or users', () => {
    expect(can('ADMIN', 'moderation.manage')).toBe(false);
    expect(can('ADMIN', 'system.settings')).toBe(false);
    expect(can('ADMIN', 'users.manage')).toBe(false);
  });

  it('ADMIN can access audit and growth, not operational platform modules', () => {
    expect(can('ADMIN', 'audit.view')).toBe(true);
    expect(can('ADMIN', 'growth.manage')).toBe(true);
    expect(can('ADMIN', 'finance.platform')).toBe(false);
    expect(can('ADMIN', 'tournaments.platform')).toBe(false);
    expect(can('ADMIN', 'tournaments.organize')).toBe(false);
  });

  it('SUPER_ADMIN with venue access can open owner workspace', () => {
    expect(canAccessWorkspace('SUPER_ADMIN', 'owner', [], true)).toBe(true);
    expect(canAccessRoute('SUPER_ADMIN', '/owner', [], false, true)).toBe(true);
    expect(canAccessRoute('SUPER_ADMIN', '/owner', [], false, false)).toBe(
      false,
    );
  });

  it('SUPER_ADMIN without venue access cannot open owner workspace', () => {
    expect(canAccessWorkspace('SUPER_ADMIN', 'owner')).toBe(false);
  });

  it('FACILITY_OWNER can access owner workspace only', () => {
    expect(canAccessWorkspace('FACILITY_OWNER', 'owner')).toBe(true);
    expect(canAccessWorkspace('FACILITY_OWNER', 'admin')).toBe(false);
    expect(can('FACILITY_OWNER', 'bookings.venue')).toBe(true);
    expect(can('FACILITY_OWNER', 'users.manage')).toBe(false);
  });

  it('PLAYER with BTO grant gets organizer permissions', () => {
    const caps = ['TOURNAMENT_ORGANIZER'] as const;
    expect(getEffectivePermissions('PLAYER', [...caps])).toContain(
      'tournaments.organize',
    );
    expect(canAccessWorkspace('PLAYER', 'organizer', [...caps])).toBe(true);
    expect(canAccessRoute('PLAYER', '/organizer/tournaments', [...caps])).toBe(
      true,
    );
    expect(canAccessRoute('PLAYER', '/admin/users', [...caps])).toBe(false);
  });

  it('role home paths with capabilities', () => {
    expect(getHomePath('ADMIN')).toBe('/admin');
    expect(getHomePath('FACILITY_OWNER')).toBe('/owner');
    expect(getHomePath('PLAYER', ['TOURNAMENT_ORGANIZER'])).toBe('/organizer');
    expect(getHomePath('PLAYER', [], true)).toBe('/owner');
  });

  it('FACILITY_OWNER denied /admin/users', () => {
    expect(canAccessRoute('FACILITY_OWNER', '/admin/users')).toBe(false);
  });

  it('ADMIN denied /admin/users and /admin/moderation', () => {
    expect(canAccessRoute('ADMIN', '/admin/users')).toBe(false);
    expect(canAccessRoute('ADMIN', '/admin/moderation')).toBe(false);
  });

  it('SUPER_ADMIN passes all admin routes', () => {
    expect(canAccessRoute('SUPER_ADMIN', '/admin/moderation')).toBe(true);
    expect(canAccessRoute('SUPER_ADMIN', '/admin/settings')).toBe(true);
    expect(canAccessRoute('SUPER_ADMIN', '/admin/users')).toBe(true);
  });

  it('platformOwnerOnly route requires platform owner flag', () => {
    expect(
      canAccessRoute('ADMIN', '/admin/access-control', [], false),
    ).toBe(false);
    expect(
      canAccessRoute('SUPER_ADMIN', '/admin/access-control', [], false),
    ).toBe(false);
    expect(
      canAccessRoute('SUPER_ADMIN', '/admin/access-control', [], true),
    ).toBe(true);
    const entry = matchRouteManifest('/admin/access-control');
    expect(entry?.platformOwnerOnly).toBe(true);
  });

  it('owner staff route uses venue layer not platform owner flag', () => {
    expect(canAccessRoute('FACILITY_OWNER', '/owner/staff', [], false)).toBe(
      true,
    );
    expect(canAccessRoute('FACILITY_OWNER', '/owner/staff', [], true)).toBe(
      true,
    );
    const entry = matchRouteManifest('/owner/staff');
    expect(entry?.venueOwnerOnly).toBe(true);
  });

  it('venue staff gets minimal portal permissions not full owner set', () => {
    const perms = getEffectivePermissions('PLAYER', [], true);
    expect(perms).toContain('owner.dashboard');
    expect(perms).not.toContain('bookings.venue');
    expect(perms).not.toContain('staff.venue');
  });

  it('PLAYER with venue access can enter owner workspace routes at portal layer', () => {
    expect(canAccessPortal('PLAYER', [], true)).toBe(true);
    expect(canAccessRoute('PLAYER', '/owner/bookings', [], false, true)).toBe(
      true,
    );
    expect(can('PLAYER', 'bookings.venue', [], true)).toBe(false);
  });

  it('isAdminRole and isSuperAdminRole', () => {
    expect(isAdminRole('ADMIN')).toBe(true);
    expect(isSuperAdminRole('ADMIN')).toBe(false);
    expect(isSuperAdminRole('SUPER_ADMIN')).toBe(true);
  });

  it('hasOrganizerCapability', () => {
    expect(hasOrganizerCapability(['TOURNAMENT_ORGANIZER'])).toBe(true);
    expect(hasOrganizerCapability([])).toBe(false);
  });

  it('matchRouteManifest resolves dynamic tournament routes', () => {
    const orgEntry = matchRouteManifest('/organizer/tournaments/abc123/schedule');
    expect(orgEntry?.permission).toBe('tournaments.organize');
  });
});
