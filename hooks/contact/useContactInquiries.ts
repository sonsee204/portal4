'use client';

import { useQuery } from '@apollo/client/react';
import {
  GET_CONTACT_INQUIRIES,
  GET_CONTACT_INQUIRY_STATS,
} from '@/graphql/queries/contact';
import type {
  ContactInquiry,
  ContactInquiryList,
  ContactInquiryStats,
  ContactInquiryFilterInput,
} from '@/types';

export function useContactInquiries(filter: ContactInquiryFilterInput) {
  const { data, loading, error, refetch } = useQuery<{
    getContactInquiries: ContactInquiryList;
  }>(GET_CONTACT_INQUIRIES, {
    variables: { filter },
    fetchPolicy: 'cache-and-network',
  });

  const result = data?.getContactInquiries;

  return {
    inquiries: result?.items ?? [] as ContactInquiry[],
    total: result?.total ?? 0,
    page: result?.page ?? 1,
    totalPages: result?.totalPages ?? 1,
    loading,
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
