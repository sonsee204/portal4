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

'use client';

import { useEffect } from 'react';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useVenueDetail,
  useVenueCourts,
} from '@/hooks/owner';

export function useVenueDetailPageData(venueId: string) {
  const { venues, setSelectedVenueId } = useVenueContext();

  useEffect(() => {
    if (venueId && venues.some((v) => v._id === venueId)) {
      setSelectedVenueId(venueId);
    }
  }, [venueId, venues, setSelectedVenueId]);

  const {
    venue,
    loading: venueLoading,
    error: venueError,
    refetch: refetchVenue,
  } = useVenueDetail(venueId);

  const {
    courts,
    totalCount,
    hasNextPage,
    loadMore,
    loading: courtsLoading,
    error: courtsError,
    refetch: refetchCourts,
  } = useVenueCourts(venueId, { limit: 50 });

  const loading = venueLoading || courtsLoading;
  const error = venueError ?? courtsError;

  const refetchAll = () => {
    void refetchVenue();
    void refetchCourts();
  };

  return {
    venueId,
    venue,
    courts,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetchAll,
  };
}

export type VenueDetailPageData = ReturnType<typeof useVenueDetailPageData>;
