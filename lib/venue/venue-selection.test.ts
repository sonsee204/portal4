/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import { isStatsAllVenuesPath } from './venue-selection';

describe('isStatsAllVenuesPath', () => {
  it('matches all owner stats routes', () => {
    expect(isStatsAllVenuesPath('/owner/stats/overview')).toBe(true);
    expect(isStatsAllVenuesPath('/owner/stats/finance')).toBe(true);
    expect(isStatsAllVenuesPath('/owner/stats/operations')).toBe(true);
    expect(isStatsAllVenuesPath('/owner/stats/products')).toBe(true);
  });

  it('does not match non-stats owner routes', () => {
    expect(isStatsAllVenuesPath('/owner')).toBe(false);
    expect(isStatsAllVenuesPath('/owner/calendar')).toBe(false);
    expect(isStatsAllVenuesPath('/owner/orders')).toBe(false);
    expect(isStatsAllVenuesPath('/owner/venues')).toBe(false);
  });
});
