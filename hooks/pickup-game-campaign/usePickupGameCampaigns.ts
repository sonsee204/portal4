'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_MY_CAMPAIGNS,
  GET_CAMPAIGN,
  GET_CAMPAIGN_STATS,
} from '@/graphql/queries/pickup-game-campaign';
import {
  CREATE_PICKUP_GAME_CAMPAIGN,
  UPDATE_PICKUP_GAME_CAMPAIGN,
  ADD_GAMES_TO_CAMPAIGN,
  REMOVE_GAMES_FROM_CAMPAIGN,
} from '@/graphql/mutations/pickup-game-campaign';
import type {
  PickupGameCampaign,
  CampaignStats,
  CreatePickupGameCampaignInput,
  UpdatePickupGameCampaignInput,
} from '@/graphql/types';

export function useMyCampaigns(isActive?: boolean) {
  const variables: Record<string, unknown> = {};
  if (isActive !== undefined) variables.isActive = isActive;

  const { data, loading, error, refetch } = useQuery<{
    myCampaigns: PickupGameCampaign[];
  }>(GET_MY_CAMPAIGNS, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return {
    campaigns: data?.myCampaigns ?? [],
    loading,
    error,
    refetch,
  };
}

export function usePickupGameCampaign(campaignId: string) {
  const { data, loading, error, refetch } = useQuery<{
    pickupGameCampaign: PickupGameCampaign;
  }>(GET_CAMPAIGN, {
    variables: { campaignId },
    fetchPolicy: 'cache-and-network',
    skip: !campaignId,
  });

  return {
    campaign: data?.pickupGameCampaign,
    loading,
    error,
    refetch,
  };
}

export function useCampaignStats(campaignId: string) {
  const { data, loading, error, refetch } = useQuery<{
    campaignStats: CampaignStats;
  }>(GET_CAMPAIGN_STATS, {
    variables: { campaignId },
    fetchPolicy: 'cache-and-network',
    skip: !campaignId,
  });

  return {
    stats: data?.campaignStats,
    loading,
    error,
    refetch,
  };
}

export function useCreatePickupGameCampaign() {
  const [mutate, { loading, error }] = useMutation<
    { createPickupGameCampaign: PickupGameCampaign },
    { input: CreatePickupGameCampaignInput }
  >(CREATE_PICKUP_GAME_CAMPAIGN, {
    refetchQueries: [{ query: GET_MY_CAMPAIGNS }],
  });

  const createCampaign = async (input: CreatePickupGameCampaignInput) => {
    const result = await mutate({ variables: { input } });
    return result.data?.createPickupGameCampaign;
  };

  return { createCampaign, loading, error };
}

export function useUpdatePickupGameCampaign() {
  const [mutate, { loading, error }] = useMutation<
    { updatePickupGameCampaign: PickupGameCampaign },
    { campaignId: string; input: UpdatePickupGameCampaignInput }
  >(UPDATE_PICKUP_GAME_CAMPAIGN, {
    refetchQueries: [{ query: GET_MY_CAMPAIGNS }],
  });

  const updateCampaign = async (
    campaignId: string,
    input: UpdatePickupGameCampaignInput,
  ) => {
    const result = await mutate({ variables: { campaignId, input } });
    return result.data?.updatePickupGameCampaign;
  };

  return { updateCampaign, loading, error };
}

export function useAddGamesToCampaign() {
  const [mutate, { loading, error }] = useMutation<
    { addGamesToCampaign: PickupGameCampaign },
    { input: { campaignId: string; gameIds: string[] } }
  >(ADD_GAMES_TO_CAMPAIGN);

  const addGames = async (campaignId: string, gameIds: string[]) => {
    const result = await mutate({ variables: { input: { campaignId, gameIds } } });
    return result.data?.addGamesToCampaign;
  };

  return { addGames, loading, error };
}

export function useRemoveGamesFromCampaign() {
  const [mutate, { loading, error }] = useMutation<
    { removeGamesFromCampaign: PickupGameCampaign },
    { input: { campaignId: string; gameIds: string[] } }
  >(REMOVE_GAMES_FROM_CAMPAIGN);

  const removeGames = async (campaignId: string, gameIds: string[]) => {
    const result = await mutate({
      variables: { input: { campaignId, gameIds } },
    });
    return result.data?.removeGamesFromCampaign;
  };

  return { removeGames, loading, error };
}
