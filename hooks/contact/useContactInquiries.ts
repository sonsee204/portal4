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

import { useCallback, useEffect, useMemo } from 'react';
import { useApolloClient, useQuery } from '@apollo/client/react';
import {
  GET_CONTACT_INQUIRIES,
  GET_CONTACT_INQUIRY_STATS,
} from '@/graphql/queries/contact';
import type {
  ContactInquiry,
  ContactInquiryStats,
  ContactInquiryFilterInput,
} from '@/types';
import type { GetContactInquiriesQuery } from '@/graphql/generated';
import {
  connectionNodes,
  resolveConnectionFirst,
  totalPagesFromCount,
} from '@/hooks/shared/useCursorConnection';
import { useConnectionPageAfter } from '@/hooks/shared/useConnectionPageAfter';

export function useContactInquiries(filter: ContactInquiryFilterInput) {
  const page = filter.page ?? 1;
  const first = resolveConnectionFirst({ limit: filter.limit });
  const connectionFilter = useMemo(() => {
    // page/limit drive cursor pagination; omit from GraphQL filter
    const rest = { ...filter };
    delete rest.page;
    delete rest.limit;
    return rest;
  }, [filter]);
  const resetKey = JSON.stringify(connectionFilter);

  const client = useApolloClient();
  const prefetchPage = useCallback(
    async (after: string | null, pageSize: number) => {
      const { data } = await client.query<GetContactInquiriesQuery>({
        query: GET_CONTACT_INQUIRIES,
        variables: { filter: connectionFilter, pagination: { first: pageSize, after } },
        fetchPolicy: 'network-only',
      });
      const conn = data?.contactInquiriesConnection;
      return {
        endCursor: conn?.pageInfo?.endCursor,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      };
    },
    [client, connectionFilter],
  );

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch } = useQuery<GetContactInquiriesQuery>(
    GET_CONTACT_INQUIRIES,
    {
      variables: {
        filter: connectionFilter,
        pagination: { first, after },
      },
      skip: page > 1 && resolving,
      fetchPolicy: 'cache-and-network',
    },
  );

  const connection = data?.contactInquiriesConnection;
  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  const total = connection?.totalCount ?? 0;
  const inquiries = connectionNodes(connection?.edges) as unknown as ContactInquiry[];

  return {
    inquiries,
    total,
    page,
    totalPages: totalPagesFromCount(total, first),
    loading: loading || resolving,
    error,
    refetch,
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
