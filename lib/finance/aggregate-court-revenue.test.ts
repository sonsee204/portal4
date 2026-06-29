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
import { aggregateRevenueByCourt } from './aggregate-court-revenue';

describe('aggregateRevenueByCourt', () => {
  it('merges slot-level rows into one bar per court', () => {
    expect(
      aggregateRevenueByCourt([
        { label: 'Sân 4 (18:00 - 18:30)', revenue: 3_000_000 },
        { label: 'Sân 4 (17:30 - 18:00)', revenue: 2_800_000 },
        { label: 'Sân 3 (21:00 - 21:30)', revenue: 2_600_000 },
        { label: 'Sân 1 (06:00 - 06:30)', revenue: 1_400_000 },
        { label: 'Sân 2 (11:00 - 11:30)', revenue: 900_000 },
      ]),
    ).toEqual([
      { label: 'Sân 4', value: 5_800_000 },
      { label: 'Sân 3', value: 2_600_000 },
      { label: 'Sân 1', value: 1_400_000 },
      { label: 'Sân 2', value: 900_000 },
    ]);
  });

  it('is idempotent when labels are already court names', () => {
    expect(
      aggregateRevenueByCourt([
        { label: 'Sân 1', revenue: 1_000_000 },
        { label: 'Sân 2', revenue: 500_000 },
      ]),
    ).toEqual([
      { label: 'Sân 1', value: 1_000_000 },
      { label: 'Sân 2', value: 500_000 },
    ]);
  });
});
