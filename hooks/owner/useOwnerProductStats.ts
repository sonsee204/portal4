/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useQuery } from '@apollo/client/react';
import {
  PRODUCT_PERFORMANCE_REPORT,
  VENUE_PRODUCT_REPORT,
} from '@/graphql/owner/product-stats';
import type {
  ProductPerformanceReportQuery,
  ProductReportFilterInput,
  VenueProductReportQuery,
} from '@/graphql/generated';

export type VenueProductReportData = NonNullable<
  VenueProductReportQuery['venueProductReport']
>;
export type ProductReportRowNode = NonNullable<
  VenueProductReportData['productsTable']['edges'][number]['node']
>;
export type ProductPerformanceReportData = NonNullable<
  ProductPerformanceReportQuery['productPerformanceReport']
>;

export function useVenueProductReport(
  filter: ProductReportFilterInput | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<VenueProductReportQuery>(
    VENUE_PRODUCT_REPORT,
    {
      variables: { filter: filter! },
      skip: !filter || options?.skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    report: data?.venueProductReport ?? null,
    loading,
    error,
    refetch,
  };
}

export function useProductPerformanceReport(
  productId: string | null,
  filter: ProductReportFilterInput | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<ProductPerformanceReportQuery>(
    PRODUCT_PERFORMANCE_REPORT,
    {
      variables: {
        productId: productId!,
        filter: filter!,
      },
      skip: !productId || !filter || options?.skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    report: data?.productPerformanceReport ?? null,
    loading,
    error,
    refetch,
  };
}
