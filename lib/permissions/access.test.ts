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
  canAccessRoute,
  canAccessWorkspace,
  getHomePath,
  getEffectivePermissions,
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

  it('ADMIN can access audit, finance, and platform tournaments', () => {
    expect(can('ADMIN', 'audit.view')).toBe(true);
    expect(can('ADMIN', 'finance.platform')).toBe(true);
    expect(can('ADMIN', 'tournaments.platform')).toBe(true);
    expect(can('ADMIN', 'tournaments.organize')).toBe(false);
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
    const adminEntry = matchRouteManifest('/admin/tournaments/abc123/schedule');
    expect(adminEntry?.permission).toBe('tournaments.platform');
    const orgEntry = matchRouteManifest('/organizer/tournaments/abc123/schedule');
    expect(orgEntry?.permission).toBe('tournaments.organize');
  });
});
