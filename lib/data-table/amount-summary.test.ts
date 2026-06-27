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
  buildAmountSummariesFromRows,
  sumDataTableAmounts,
} from './amount-summary';

describe('amount-summary', () => {
  it('sums finite numeric values and ignores nullish entries', () => {
    const rows = [
      { amount: 100_000 },
      { amount: null },
      { amount: undefined },
      { amount: 250_000 },
    ];

    expect(sumDataTableAmounts(rows, (row) => row.amount)).toBe(350_000);
  });

  it('builds summary specs from rows', () => {
    const rows = [{ total: 100 }, { total: 200 }];

    expect(
      buildAmountSummariesFromRows(rows, [
        { columnKey: 'total', getValue: (row) => row.total, tone: 'positive' },
      ]),
    ).toEqual([
      {
        columnKey: 'total',
        total: 300,
        tone: 'positive',
        scope: 'loaded',
      },
    ]);
  });
});
