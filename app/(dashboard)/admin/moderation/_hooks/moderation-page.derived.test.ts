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
import {
  buildStatusFilter,
  resolveEffectiveReportId,
  shortDisplayId,
  totalPagesFromCount,
  truncateText,
} from './moderation-page.derived';

describe('moderation-page.derived', () => {
  it('totalPagesFromCount rounds up', () => {
    expect(totalPagesFromCount(21, 20)).toBe(2);
  });

  it('resolveEffectiveReportId falls back to first report', () => {
    expect(
      resolveEffectiveReportId([{ _id: 'a' }, { _id: 'b' }], null),
    ).toBe('a');
  });

  it('buildStatusFilter omits ALL', () => {
    expect(buildStatusFilter('ALL')).toBeUndefined();
    expect(buildStatusFilter('PENDING')).toEqual({ status: 'PENDING' });
  });

  it('shortDisplayId uses suffix', () => {
    expect(shortDisplayId('abcdef123456')).toBe('123456');
  });

  it('truncateText adds ellipsis', () => {
    expect(truncateText('hello world', 5)).toBe('hello…');
  });
});
