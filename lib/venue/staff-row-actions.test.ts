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

import { describe, expect, it } from 'vitest';
import { VenueStaffStatus } from '@/graphql/generated';
import {
  getStaffRemoveDialogCopy,
  getStaffRowActionMode,
} from './staff-row-actions';

describe('staff-row-actions', () => {
  it('hides actions for venue owner', () => {
    expect(
      getStaffRowActionMode({
        isOwner: true,
        status: VenueStaffStatus.Active,
      }),
    ).toBe('none');
  });

  it('allows edit and remove for active non-owner staff', () => {
    expect(
      getStaffRowActionMode({
        isOwner: false,
        status: VenueStaffStatus.Active,
      }),
    ).toBe('edit');
  });

  it('allows cancel invite for pending staff', () => {
    expect(
      getStaffRowActionMode({
        isOwner: false,
        status: VenueStaffStatus.Pending,
      }),
    ).toBe('cancelInvite');
  });

  it('uses cancel-invite copy for pending removal', () => {
    const copy = getStaffRemoveDialogCopy({
      status: VenueStaffStatus.Pending,
      user: { displayName: 'An' },
    });
    expect(copy.title).toBe('Hủy lời mời');
    expect(copy.confirmLabel).toBe('Hủy lời mời');
    expect(copy.description).toContain('An');
  });

  it('uses remove copy for active staff', () => {
    const copy = getStaffRemoveDialogCopy({
      status: VenueStaffStatus.Active,
      user: { displayName: 'Bình' },
    });
    expect(copy.title).toBe('Xóa nhân viên');
    expect(copy.confirmLabel).toBe('Xóa nhân viên');
  });
});
