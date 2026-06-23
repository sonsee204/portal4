/**
 * Ao Trình (NALee Sports)
 */

import { describe, expect, it } from 'vitest';
import {
  deriveOverviewMode,
  deriveOverviewSections,
} from './useOwnerFinanceOverviewLayout';

describe('useOwnerFinanceOverviewLayout', () => {
  it('deriveOverviewMode resolves scope', () => {
    expect(
      deriveOverviewMode({ allVenues: true, selectedVenueId: 'a' }),
    ).toBe('allVenues');
    expect(
      deriveOverviewMode({ allVenues: false, selectedVenueId: 'a' }),
    ).toBe('singleVenue');
    expect(
      deriveOverviewMode({ allVenues: false, selectedVenueId: null }),
    ).toBe('needsVenue');
  });

  it('deriveOverviewSections toggles blocks by mode', () => {
    const single = deriveOverviewSections('singleVenue');
    expect(single.insights).toBe(true);
    expect(single.table).toBe(false);
    expect(single.cta).toBe(true);

    const all = deriveOverviewSections('allVenues');
    expect(all.highlights).toBe(true);
    expect(all.trend).toBe(false);

    const needs = deriveOverviewSections('needsVenue');
    expect(needs.kpi).toBe(false);
  });
});
