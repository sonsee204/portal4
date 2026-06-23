/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { getApolloClient } from '@/lib/apollo/client';
import {
  PORTAL_CAPABILITY_GRANTS_CONNECTION,
} from '@/graphql/portal-access/queries';
import {
  GRANT_PORTAL_CAPABILITY,
  REVOKE_PORTAL_CAPABILITY,
} from '@/graphql/portal-access/mutations';
import type {
  GrantPortalCapabilityMutation,
  PortalCapability,
  PortalCapabilityGrantsConnectionQuery,
  RevokePortalCapabilityMutation,
  CursorSortInput,
} from '@/graphql/generated';
import { connectionNodes } from '@/hooks/shared/useCursorConnection';
import { buildSortedConnectionVariables } from '@/hooks/shared/useSortedConnectionQuery';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';

export type { PortalCapability };

export interface PortalCapabilityGrant {
  _id: string;
  userId: string;
  userDisplayName: string;
  userRole: string;
  capability: PortalCapability;
  reason: string;
  enabled: boolean;
  grantedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
}

export async function fetchPortalCapabilityGrants(options?: {
  userId?: string;
  capability?: PortalCapability;
  enabled?: boolean;
  limit?: number;
  sort?: CursorSortInput;
}): Promise<PortalCapabilityGrant[]> {
  const limit = Math.min(options?.limit ?? CURSOR_PAGE_MAX, CURSOR_PAGE_MAX);
  const client = getApolloClient();
  const result = await client.query<PortalCapabilityGrantsConnectionQuery>({
    query: PORTAL_CAPABILITY_GRANTS_CONNECTION,
    variables: buildSortedConnectionVariables(
      {
        filter: {
          userId: options?.userId,
          capability: options?.capability,
          enabled: options?.enabled,
        },
      },
      options?.sort,
      { limit },
    ),
    fetchPolicy: 'network-only',
  });

  return connectionNodes(
    result.data?.portalCapabilityGrantsConnection?.edges,
  ) as PortalCapabilityGrant[];
}

export async function grantPortalCapability(input: {
  userId: string;
  capability: PortalCapability;
  reason: string;
}): Promise<PortalCapabilityGrant> {
  const client = getApolloClient();
  const result = await client.mutate<GrantPortalCapabilityMutation>({
    mutation: GRANT_PORTAL_CAPABILITY,
    variables: { input },
  });
  return result.data!.grantPortalCapability as PortalCapabilityGrant;
}

export async function revokePortalCapability(
  id: string,
): Promise<PortalCapabilityGrant> {
  const client = getApolloClient();
  const result = await client.mutate<RevokePortalCapabilityMutation>({
    mutation: REVOKE_PORTAL_CAPABILITY,
    variables: { id },
  });
  return result.data!.revokePortalCapability as PortalCapabilityGrant;
}
