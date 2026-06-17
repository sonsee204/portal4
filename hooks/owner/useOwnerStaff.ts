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
import { VENUE_STAFF_CONNECTION } from '@/graphql/owner/queries';
import { VENUE_PENDING_INVITATIONS } from '@/graphql/owner/queries';
import {
  ADD_VENUE_STAFF,
  REMOVE_VENUE_STAFF,
  UPDATE_VENUE_STAFF_PERMISSIONS,
} from '@/graphql/owner/mutations';
import type { VenueAction, VenueStaffStatus } from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import {
  createMutationOptions,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';

export type VenueStaffNode = {
  _id: string;
  isOwner: boolean;
  permissions: VenueAction[];
  status: VenueStaffStatus;
  customTitle?: string | null;
  joinedAt?: string | null;
  user?: {
    _id: string;
    displayName: string;
    phone?: string | null;
    email?: string | null;
  } | null;
};

type VenueStaffConnectionQueryResult = {
  venueStaffConnection: {
    totalCount: number;
    edges: Array<{ cursor: string; node: VenueStaffNode }>;
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
  };
};

export function useOwnerStaff(
  venueId: string | null,
  pagination?: LegacyPagePagination,
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueStaffConnectionQueryResult>(VENUE_STAFF_CONNECTION, {
      variables: {
        venueId: venueId ?? '',
        pagination: { first },
      },
      skip: !venueId,
    });

  const connection = data?.venueStaffConnection;
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
      venueStaffConnection: {
        ...next.venueStaffConnection!,
        edges: mergeConnectionEdges(
          prev.venueStaffConnection?.edges ?? [],
          next.venueStaffConnection?.edges ?? [],
        ),
      },
    }),
  });

  const [addStaffMutation, { loading: adding }] = useMutation<
    { addVenueStaff: { _id: string } },
    { venueId: string; userId: string; permissions: VenueAction[] }
  >(
    ADD_VENUE_STAFF,
    createMutationOptions('Add venue staff', 'Đã thêm nhân viên thành công'),
  );

  const [updatePermissionsMutation, { loading: updatingPermissions }] =
    useMutation<
      { updateVenueStaffPermissions: { _id: string } },
      { venueId: string; userId: string; permissions: VenueAction[] }
    >(
      UPDATE_VENUE_STAFF_PERMISSIONS,
      createMutationOptions(
        'Update venue staff permissions',
        'Đã cập nhật quyền nhân viên',
      ),
    );

  const [removeStaffMutation, { loading: removing }] = useMutation<
    { removeVenueStaff: boolean },
    { venueId: string; userId: string }
  >(
    REMOVE_VENUE_STAFF,
    createMutationOptions('Remove venue staff', 'Đã xóa nhân viên'),
  );

  const addStaff = useCallback(
    async (userId: string, permissions: VenueAction[]) => {
      if (!venueId) return false;
      const result = await addStaffMutation({
        ...strictMutationErrorPolicy,
        variables: { venueId, userId, permissions },
      });
      if (result.data?.addVenueStaff) {
        await refetch();
      }
      return Boolean(result.data?.addVenueStaff);
    },
    [addStaffMutation, refetch, venueId],
  );

  const updatePermissions = useCallback(
    async (userId: string, permissions: VenueAction[]) => {
      if (!venueId) return false;
      const result = await updatePermissionsMutation({
        ...strictMutationErrorPolicy,
        variables: { venueId, userId, permissions },
      });
      if (result.data?.updateVenueStaffPermissions) {
        await refetch();
      }
      return Boolean(result.data?.updateVenueStaffPermissions);
    },
    [refetch, updatePermissionsMutation, venueId],
  );

  const removeStaff = useCallback(
    async (userId: string) => {
      if (!venueId) return false;
      const result = await removeStaffMutation({
        ...strictMutationErrorPolicy,
        variables: { venueId, userId },
      });
      if (result.data?.removeVenueStaff) {
        await refetch();
      }
      return Boolean(result.data?.removeVenueStaff);
    },
    [refetch, removeStaffMutation, venueId],
  );

  return {
    staff: (connectionNodes(connection?.edges) ?? []) as VenueStaffNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
    addStaff,
    updatePermissions,
    removeStaff,
    adding,
    updatingPermissions,
    removing,
  };
}

export function useVenuePendingInvitations(venueId: string | null) {
  const { data, loading, error, refetch } = useQuery<{
    venuePendingInvitations: VenueStaffNode[];
  }>(VENUE_PENDING_INVITATIONS, {
    variables: { venueId: venueId ?? '' },
    skip: !venueId,
  });

  return {
    invitations: data?.venuePendingInvitations ?? [],
    loading,
    error,
    refetch,
  };
}
