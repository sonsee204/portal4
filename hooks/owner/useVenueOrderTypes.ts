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

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_VENUE_ENABLED_ORDER_TYPES } from '@/graphql/owner/queries';
import type {
  GetVenueEnabledOrderTypesQuery,
  VenueOrderTypeConfig,
} from '@/graphql/generated';
import { OrderType } from '@/graphql/generated';

const POS_EXCLUDED_ORDER_TYPES = new Set<OrderType>([OrderType.Booking]);

export type VenueEnabledOrderTypeConfig = VenueOrderTypeConfig;

export function useVenueEnabledOrderTypes(venueId: string | null) {
  const { data, loading, error, refetch } =
    useQuery<GetVenueEnabledOrderTypesQuery>(GET_VENUE_ENABLED_ORDER_TYPES, {
      variables: { venueId: venueId ?? '' },
      skip: !venueId,
    });

  const venue = data?.venue;

  const orderTypes = useMemo(() => {
    const configs = venue?.enabledOrderTypes ?? [];
    return configs.filter(
      (config) =>
        config.isEnabled && !POS_EXCLUDED_ORDER_TYPES.has(config.orderType),
    );
  }, [venue?.enabledOrderTypes]);

  // Venue order settings (mobile) can enable order types without flipping
  // hasOrderService; treat any POS-eligible enabled type as active order service.
  const hasOrderService =
    (venue?.hasOrderService ?? false) || orderTypes.length > 0;

  return {
    venueName: venue?.name ?? null,
    hasOrderService,
    orderTypes,
    loading,
    error,
    refetch,
  };
}
