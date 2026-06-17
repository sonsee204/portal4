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

import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  GET_VENUE_DETAIL,
  VENUE_COURTS_CONNECTION,
} from '@/graphql/owner/queries';
import {
  UPDATE_VENUE,
  UPDATE_VENUE_ORDER_TYPE_CONFIGS,
  CREATE_COURT,
  UPDATE_COURT,
  DELETE_COURT,
} from '@/graphql/owner/mutations';
import type { CreateCourtInput, UpdateCourtInput, UpdateVenueInput } from '@/graphql/generated';
import {
  createMutationOptions,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import type { VenueCourtNode, VenueDetailNode } from './owner-venue.types';

export function useVenueDetail(venueId: string | null) {
  const { data, loading, error, refetch } = useQuery<{
    venue: VenueDetailNode | null;
  }>(GET_VENUE_DETAIL, {
    variables: { venueId: venueId ?? '' },
    skip: !venueId,
  });
  return { venue: data?.venue ?? null, loading, error, refetch };
}

export function useVenueCourts(
  venueId: string | null,
  pagination?: LegacyPagePagination,
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } = useQuery<{
    venueCourtsConnection: {
      totalCount: number;
      edges: Array<{ cursor: string; node: VenueCourtNode }>;
      pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    };
  }>(VENUE_COURTS_CONNECTION, {
    variables: { venueId: venueId ?? '', pagination: { first } },
    skip: !venueId,
  });

  const connection = data?.venueCourtsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueCourtsConnection: {
        ...next.venueCourtsConnection!,
        edges: mergeConnectionEdges(
          prev.venueCourtsConnection?.edges ?? [],
          next.venueCourtsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    courts: (connectionNodes(connection?.edges) ?? []) as VenueCourtNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useUpdateVenue() {
  const [mutate, { loading, error }] = useMutation<
    { updateVenue: { _id: string; name: string; status: string } },
    { input: UpdateVenueInput }
  >(
    UPDATE_VENUE,
    createMutationOptions('Update venue', 'Cập nhật sân thành công'),
  );

  const updateVenue = useCallback(
    async (input: UpdateVenueInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: [
          { query: GET_VENUE_DETAIL, variables: { venueId: input.venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.updateVenue;
    },
    [mutate],
  );

  return { updateVenue, loading, error };
}

export function useUpdateVenueOrderTypeConfigs() {
  const [mutate, { loading, error }] = useMutation<
    {
      updateVenueOrderTypeConfigs: {
        _id: string;
        orderTypeConfigs: Array<{ orderType: string; isEnabled: boolean }>;
      };
    },
    {
      input: {
        venueId: string;
        orderTypeConfigs: Array<{
          orderType: string;
          isEnabled: boolean;
          label?: string;
          icon?: string;
          color?: string;
          displayOrder?: number;
        }>;
      };
    }
  >(
    UPDATE_VENUE_ORDER_TYPE_CONFIGS,
    createMutationOptions(
      'Update venue order type configs',
      'Cập nhật loại đơn thành công',
    ),
  );

  const updateVenueOrderTypeConfigs = useCallback(
    async (
      venueId: string,
      orderTypeConfigs: Array<{
        orderType: string;
        isEnabled: boolean;
        label?: string;
        icon?: string;
        color?: string;
        displayOrder?: number;
      }>,
    ) => {
      const result = await mutate({
        variables: { input: { venueId, orderTypeConfigs } },
        refetchQueries: [{ query: GET_VENUE_DETAIL, variables: { venueId } }],
        ...strictMutationErrorPolicy,
      });
      return result.data?.updateVenueOrderTypeConfigs;
    },
    [mutate],
  );

  return { updateVenueOrderTypeConfigs, loading, error };
}

export function useCreateCourt() {
  const [mutate, { loading, error }] = useMutation<
    { createCourt: VenueCourtNode },
    { input: CreateCourtInput }
  >(
    CREATE_COURT,
    createMutationOptions('Create court', 'Thêm sân con thành công'),
  );

  const createCourt = useCallback(
    async (input: CreateCourtInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: [
          {
            query: VENUE_COURTS_CONNECTION,
            variables: { venueId: input.venueId, pagination: { first: 50 } },
          },
          { query: GET_VENUE_DETAIL, variables: { venueId: input.venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.createCourt;
    },
    [mutate],
  );

  return { createCourt, loading, error };
}

export function useUpdateCourt(venueId: string) {
  const [mutate, { loading, error }] = useMutation<
    { updateCourt: VenueCourtNode },
    { input: UpdateCourtInput }
  >(
    UPDATE_COURT,
    createMutationOptions('Update court', 'Cập nhật sân con thành công'),
  );

  const updateCourt = useCallback(
    async (input: UpdateCourtInput) => {
      const result = await mutate({
        variables: { input },
        refetchQueries: [
          {
            query: VENUE_COURTS_CONNECTION,
            variables: { venueId, pagination: { first: 50 } },
          },
          { query: GET_VENUE_DETAIL, variables: { venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.updateCourt;
    },
    [mutate, venueId],
  );

  return { updateCourt, loading, error };
}

export function useDeleteCourt(venueId: string) {
  const [mutate, { loading, error }] = useMutation<
    { deleteCourt: boolean },
    { courtId: string }
  >(
    DELETE_COURT,
    createMutationOptions('Delete court', 'Xóa sân con thành công'),
  );

  const deleteCourt = useCallback(
    async (courtId: string) => {
      const result = await mutate({
        variables: { courtId },
        refetchQueries: [
          {
            query: VENUE_COURTS_CONNECTION,
            variables: { venueId, pagination: { first: 50 } },
          },
          { query: GET_VENUE_DETAIL, variables: { venueId } },
        ],
        ...strictMutationErrorPolicy,
      });
      return result.data?.deleteCourt;
    },
    [mutate, venueId],
  );

  return { deleteCourt, loading, error };
}
