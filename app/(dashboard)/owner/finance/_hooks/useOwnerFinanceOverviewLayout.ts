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

import type { OwnerFinancePageData } from './useOwnerFinancePageData';

export type OverviewMode = 'singleVenue' | 'allVenues' | 'needsVenue';

export type OverviewSections = {
  kpi: boolean;
  insights: boolean;
  pnlCompact: boolean;
  trend: boolean;
  breakdown: boolean;
  opsStrip: boolean;
  highlights: boolean;
  topVenuesChart: boolean;
  table: boolean;
  cta: boolean;
};

export function deriveOverviewMode(input: {
  allVenues: boolean;
  selectedVenueId: string | null;
}): OverviewMode {
  if (!input.allVenues && !input.selectedVenueId) return 'needsVenue';
  if (input.allVenues) return 'allVenues';
  return 'singleVenue';
}

export function deriveOverviewSections(mode: OverviewMode): OverviewSections {
  return {
    kpi: mode !== 'needsVenue',
    insights: mode === 'singleVenue',
    pnlCompact: mode === 'singleVenue',
    trend: mode === 'singleVenue',
    breakdown: mode === 'singleVenue',
    opsStrip: mode === 'singleVenue',
    highlights: mode === 'allVenues',
    topVenuesChart: mode === 'allVenues',
    table: mode === 'allVenues',
    cta: mode === 'singleVenue',
  };
}

export function useOwnerFinanceOverviewLayout(
  data: Pick<OwnerFinancePageData, 'allVenues' | 'selectedVenueId'>,
) {
  const mode = deriveOverviewMode({
    allVenues: data.allVenues,
    selectedVenueId: data.selectedVenueId,
  });
  const sections = deriveOverviewSections(mode);

  return { mode, sections };
}
