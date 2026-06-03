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

import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_QR_CAMPAIGNS,
  GET_QR_CAMPAIGN,
  GET_QR_CAMPAIGN_STATS,
  GET_QR_ANALYTICS_SUMMARY,
  GENERATE_QR_CODE,
} from '@/graphql/queries/qr-campaign';
import {
  CREATE_QR_CAMPAIGN,
  UPDATE_QR_CAMPAIGN,
  TOGGLE_QR_CAMPAIGN,
} from '@/graphql/mutations/qr-campaign';
import type {
  QrCampaign,
  QrCampaignStats,
  QrAnalyticsSummary,
  QrCampaignFilterInput,
  CreateQrCampaignInput,
  UpdateQrCampaignInput,
} from '@/types';
import type { PaginationInput } from '@/graphql/generated';

export function useQrCampaigns(
  filter?: QrCampaignFilterInput,
  pagination?: PaginationInput,
) {
  const variables: Record<string, unknown> = {};
  if (filter) variables.filter = filter;
  if (pagination) variables.pagination = pagination;

  const { data, loading, error, refetch } = useQuery<{
    getQrCampaigns: QrCampaign[];
  }>(GET_QR_CAMPAIGNS, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return {
    campaigns: data?.getQrCampaigns ?? [],
    loading,
    error,
    refetch,
  };
}

export function useQrCampaign(id: string) {
  const { data, loading, error, refetch } = useQuery<{
    getQrCampaign: QrCampaign;
  }>(GET_QR_CAMPAIGN, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    skip: !id,
  });

  return {
    campaign: data?.getQrCampaign,
    loading,
    error,
    refetch,
  };
}

export function useQrCampaignStats(id: string, filter?: QrCampaignFilterInput) {
  const variables: Record<string, unknown> = { id };
  if (filter) variables.filter = filter;

  const { data, loading, error, refetch } = useQuery<{
    getQrCampaignStats: QrCampaignStats;
  }>(GET_QR_CAMPAIGN_STATS, {
    variables,
    fetchPolicy: 'cache-and-network',
    skip: !id,
  });

  return {
    stats: data?.getQrCampaignStats,
    loading,
    error,
    refetch,
  };
}

export function useQrAnalyticsSummary(filter?: QrCampaignFilterInput) {
  const variables = filter ? { filter } : {};

  const { data, loading, error, refetch } = useQuery<{
    getQrAnalyticsSummary: QrAnalyticsSummary;
  }>(GET_QR_ANALYTICS_SUMMARY, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return {
    summary: data?.getQrAnalyticsSummary,
    loading,
    error,
    refetch,
  };
}

export function useGenerateQrCode(campaignId: string) {
  const { data, loading, error, refetch } = useQuery<{
    generateQrCode: string;
  }>(GENERATE_QR_CODE, {
    variables: { campaignId },
    fetchPolicy: 'network-only',
    skip: !campaignId,
  });

  return {
    svgString: data?.generateQrCode,
    loading,
    error,
    refetch,
  };
}

export function useCreateQrCampaign() {
  const [mutate, { loading, error }] = useMutation<
    { createQrCampaign: QrCampaign },
    { input: CreateQrCampaignInput }
  >(CREATE_QR_CAMPAIGN, {
    refetchQueries: [{ query: GET_QR_CAMPAIGNS }],
  });

  const createCampaign = async (input: CreateQrCampaignInput) => {
    const result = await mutate({ variables: { input } });
    return result.data?.createQrCampaign;
  };

  return { createCampaign, loading, error };
}

export function useUpdateQrCampaign() {
  const [mutate, { loading, error }] = useMutation<
    { updateQrCampaign: QrCampaign },
    { id: string; input: UpdateQrCampaignInput }
  >(UPDATE_QR_CAMPAIGN);

  const updateCampaign = async (id: string, input: UpdateQrCampaignInput) => {
    const result = await mutate({ variables: { id, input } });
    return result.data?.updateQrCampaign;
  };

  return { updateCampaign, loading, error };
}

export function useToggleQrCampaign() {
  const [mutate, { loading }] = useMutation<
    { toggleQrCampaign: QrCampaign },
    { id: string; isActive: boolean }
  >(TOGGLE_QR_CAMPAIGN);

  const toggleCampaign = async (id: string, isActive: boolean) => {
    const result = await mutate({ variables: { id, isActive } });
    return result.data?.toggleQrCampaign;
  };

  return { toggleCampaign, loading };
}
