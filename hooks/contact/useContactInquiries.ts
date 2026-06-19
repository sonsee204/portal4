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
import {
  GET_CONTACT_INQUIRIES,
  GET_CONTACT_INQUIRY_STATS,
} from '@/graphql/contact/queries';
import type {
  ContactInquiry,
  ContactInquiryStats,
  ContactInquiryFilterInput,
} from '@/types';
import type { GetContactInquiriesQuery } from '@/graphql/generated';
import {
  mergeConnectionEdges,
} from '@/hooks/shared/useCursorConnection';
import { useInfiniteConnectionQuery } from '@/hooks/shared/useInfiniteConnectionQuery';

type ContactInquiryNode =
  GetContactInquiriesQuery['contactInquiriesConnection']['edges'][number]['node'];

export function useContactInquiries(filter: ContactInquiryFilterInput) {
  const connectionFilter = useMemo(() => {
    const rest = { ...filter };
    delete rest.page;
    delete rest.limit;
    return rest;
  }, [filter]);

  const result = useInfiniteConnectionQuery<
    GetContactInquiriesQuery,
    ContactInquiryNode,
    { filter: Omit<ContactInquiryFilterInput, 'page' | 'limit'> }
  >({
    query: GET_CONTACT_INQUIRIES,
    pagination: { limit: filter.limit },
    resetKey: JSON.stringify(connectionFilter),
    variables: { filter: connectionFilter },
    getConnection: (data) => data?.contactInquiriesConnection,
    mergeConnection: (prev, next) => ({
      ...next,
      contactInquiriesConnection: {
        ...next.contactInquiriesConnection!,
        edges: mergeConnectionEdges(
          prev.contactInquiriesConnection?.edges ?? [],
          next.contactInquiriesConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    inquiries: result.items as unknown as ContactInquiry[],
    total: result.total,
    hasNextPage: result.hasNextPage,
    loadMore: result.loadMore,
    isLoadingMore: result.isLoadingMore,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useContactInquiryStats() {
  const { data, loading, refetch } = useQuery<{
    getContactInquiryStats: ContactInquiryStats;
  }>(GET_CONTACT_INQUIRY_STATS, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    stats: data?.getContactInquiryStats,
    loading,
    refetch,
  };
}
