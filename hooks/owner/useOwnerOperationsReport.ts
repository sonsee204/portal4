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

import { useQuery } from '@apollo/client/react';
import { VENUE_OPERATIONS_REPORT } from '@/graphql/owner/finance/queries';
import type {
  OperationsFilterInput,
  VenueOperationsReportQuery,
} from '@/graphql/generated';

export type VenueOperationsReportData = NonNullable<
  VenueOperationsReportQuery['venueOperationsReport']
>;

export function useOwnerOperationsReport(
  filter: OperationsFilterInput | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<VenueOperationsReportQuery>(
    VENUE_OPERATIONS_REPORT,
    {
      variables: { filter: filter! },
      skip: !filter || options?.skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    operations: data?.venueOperationsReport ?? null,
    loading,
    error,
    refetch,
  };
}
