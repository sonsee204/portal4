/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import { resolvePostLoginPath } from '@/lib/auth/post-login-redirect';

describe('resolvePostLoginPath', () => {
  const superAdmin = {
    role: 'SUPER_ADMIN' as const,
    portalCapabilities: [],
    isOwner: false,
  };

  const owner = {
    role: 'SUPER_ADMIN' as const,
    portalCapabilities: [],
    isOwner: true,
  };

  it('defaults to role home when redirect is empty', () => {
    expect(resolvePostLoginPath(null, superAdmin)).toBe('/admin');
    expect(resolvePostLoginPath('/', superAdmin)).toBe('/admin');
  });

  it('never redirects to forbidden or login', () => {
    expect(resolvePostLoginPath('/forbidden', superAdmin)).toBe('/admin');
    expect(resolvePostLoginPath('/login', superAdmin)).toBe('/admin');
  });

  it('allows accessible deep links', () => {
    expect(resolvePostLoginPath('/admin/users', superAdmin)).toBe(
      '/admin/users',
    );
  });

  it('blocks owner-only routes for non-owner super admin', () => {
    expect(resolvePostLoginPath('/admin/access-control', superAdmin)).toBe(
      '/admin',
    );
    expect(resolvePostLoginPath('/admin/access-control', owner)).toBe(
      '/admin/access-control',
    );
  });

  it('redirects PLAYER venue staff to owner workspace', () => {
    const playerStaff = {
      role: 'PLAYER' as const,
      portalCapabilities: [],
      isOwner: false,
      hasVenueAccess: true,
    };

    expect(resolvePostLoginPath(null, playerStaff)).toBe('/owner');
    expect(resolvePostLoginPath('/owner/bookings', playerStaff)).toBe(
      '/owner/bookings',
    );
    expect(resolvePostLoginPath('/admin/users', playerStaff)).toBe('/owner');
  });

  it('redirects PLAYER without venue access away from owner routes', () => {
    const playerOnly = {
      role: 'PLAYER' as const,
      portalCapabilities: [],
      isOwner: false,
      hasVenueAccess: false,
    };

    expect(resolvePostLoginPath('/owner/bookings', playerOnly)).toBe('/login');
  });
});
