/**
 * Ao Trình (NALee Sports)
 */

import { describe, expect, it } from 'vitest';
import { formatCompactCurrency } from './format-currency';

describe('formatCompactCurrency', () => {
  it('formats billions', () => {
    expect(formatCompactCurrency(2_500_000_000)).toBe('2.5B');
  });

  it('formats millions', () => {
    expect(formatCompactCurrency(143_687_000)).toBe('144M');
    expect(formatCompactCurrency(12_500_000)).toBe('12.5M');
    expect(formatCompactCurrency(1_000_000)).toBe('1M');
  });

  it('formats thousands', () => {
    expect(formatCompactCurrency(50_000)).toBe('50K');
  });

  it('formats small values with đ suffix', () => {
    expect(formatCompactCurrency(500)).toBe('500đ');
    expect(formatCompactCurrency(0)).toBe('0');
  });

  it('handles negatives', () => {
    expect(formatCompactCurrency(-39_978_260)).toBe('-40M');
  });
});
