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
  UPDATE_VENUE_STAFF_TITLE,
} from '@/graphql/owner/mutations';
import type { VenueAction, VenueStaffStatus, CursorSortInput } from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import {
  createMutationOptions,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';
import {
  buildSortedConnectionVariables,
  SORTED_CONNECTION_FETCH_POLICY,
} from '@/hooks/shared/useSortedConnectionQuery';

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

export type UpdateStaffInput = {
  permissions?: VenueAction[];
  customTitle?: string;
};

type VenueStaffConnectionQueryResult = {
  venueStaffConnection: {
    totalCount: number;
    edges: Array<{ cursor: string; node: VenueStaffNode }>;
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
  };
};

function sortedActions(actions: VenueAction[]): VenueAction[] {
  return [...actions].sort();
}

function permissionsChanged(
  current: VenueAction[],
  next: VenueAction[],
): boolean {
  const a = sortedActions(current);
  const b = sortedActions(next);
  return JSON.stringify(a) !== JSON.stringify(b);
}

export function useOwnerStaff(
  venueId: string | null,
  sort?: CursorSortInput,
  pagination?: LegacyPagePagination,
) {
  const baseVariables = { venueId: venueId ?? '' };

  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueStaffConnectionQueryResult>(VENUE_STAFF_CONNECTION, {
      variables: buildSortedConnectionVariables(
        baseVariables,
        sort,
        pagination,
      ),
      skip: !venueId,
      fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
    });

  const connection = data?.venueStaffConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) =>
      buildSortedConnectionVariables(baseVariables, sort, pagination, after),
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
    {
      venueId: string;
      userId: string;
      permissions: VenueAction[];
      customTitle?: string;
    }
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

  const [updateTitleMutation, { loading: updatingTitle }] = useMutation<
    { updateVenueStaffTitle: { _id: string } },
    { venueId: string; userId: string; customTitle: string }
  >(
    UPDATE_VENUE_STAFF_TITLE,
    createMutationOptions(
      'Update venue staff title',
      'Đã cập nhật chức danh nhân viên',
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
    async (
      userId: string,
      permissions: VenueAction[],
      customTitle?: string,
    ) => {
      if (!venueId) return false;
      const trimmedTitle = customTitle?.trim();
      const result = await addStaffMutation({
        ...strictMutationErrorPolicy,
        variables: {
          venueId,
          userId,
          permissions,
          ...(trimmedTitle ? { customTitle: trimmedTitle } : {}),
        },
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

  const updateStaffTitle = useCallback(
    async (userId: string, customTitle: string) => {
      if (!venueId) return false;
      const result = await updateTitleMutation({
        ...strictMutationErrorPolicy,
        variables: { venueId, userId, customTitle: customTitle.trim() },
      });
      if (result.data?.updateVenueStaffTitle) {
        await refetch();
      }
      return Boolean(result.data?.updateVenueStaffTitle);
    },
    [refetch, updateTitleMutation, venueId],
  );

  const updateStaff = useCallback(
    async (
      userId: string,
      input: UpdateStaffInput,
      current?: Pick<VenueStaffNode, 'permissions' | 'customTitle' | 'isOwner'>,
    ) => {
      if (!venueId) return false;

      let ok = true;

      if (
        input.permissions &&
        current &&
        !current.isOwner &&
        permissionsChanged(current.permissions ?? [], input.permissions)
      ) {
        ok = await updatePermissions(userId, input.permissions);
      }

      if (
        ok &&
        input.customTitle !== undefined &&
        input.customTitle.trim() !== (current?.customTitle ?? '').trim()
      ) {
        ok = await updateStaffTitle(userId, input.customTitle);
      }

      return ok;
    },
    [updatePermissions, updateStaffTitle, venueId],
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
    isLoadingMore,
    loading,
    error,
    refetch,
    addStaff,
    updatePermissions,
    updateStaffTitle,
    updateStaff,
    removeStaff,
    adding,
    updatingPermissions,
    updatingTitle,
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
