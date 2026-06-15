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
  formatCurrency,
  formatDateShort,
  parseBibNumberInput,
  toggleSelectAllIds,
  toggleSelectionSet,
} from './registrations-page.derived';

describe('registrations-page.derived', () => {
  it('formatDateShort returns dash for empty values', () => {
    expect(formatDateShort(null)).toBe('—');
  });

  it('formatCurrency formats VND', () => {
    expect(formatCurrency(1000)).toContain('₫');
  });

  it('parseBibNumberInput validates positive integers', () => {
    expect(parseBibNumberInput('12')).toBe(12);
    expect(parseBibNumberInput('')).toBeUndefined();
    expect(parseBibNumberInput('0')).toBeUndefined();
  });

  it('toggleSelectionSet adds and removes ids', () => {
    expect(toggleSelectionSet(new Set(['a']), 'b')).toEqual(new Set(['a', 'b']));
    expect(toggleSelectionSet(new Set(['a']), 'a')).toEqual(new Set());
  });

  it('toggleSelectAllIds selects all or clears', () => {
    expect(toggleSelectAllIds(new Set(), ['a', 'b'])).toEqual(new Set(['a', 'b']));
    expect(toggleSelectAllIds(new Set(['a', 'b']), ['a', 'b'])).toEqual(new Set());
  });
});
