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
import { VENUE_FINANCE_PORTFOLIO } from '@/graphql/owner/finance/queries';
import type {
  FinanceFilterInput,
  VenueFinancePortfolioQuery,
} from '@/graphql/generated';

export type VenueFinancePortfolioRow = NonNullable<
  VenueFinancePortfolioQuery['venueFinancePortfolio']
>['venues'][number];

export type VenueFinancePortfolioReport = NonNullable<
  VenueFinancePortfolioQuery['venueFinancePortfolio']
>;

export function useOwnerFinancePortfolio(
  filter: FinanceFilterInput | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<VenueFinancePortfolioQuery>(
    VENUE_FINANCE_PORTFOLIO,
    {
      variables: { filter: filter! },
      skip: !filter || options?.skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    portfolio: data?.venueFinancePortfolio ?? null,
    loading,
    error,
    refetch,
  };
}
