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

import type { ReactNode } from 'react';
import type { VenueAction } from '@/graphql/generated';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { canAllVenueActions, canAnyVenueAction } from '@/lib/venue/permissions';

interface VenueActionGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  action?: VenueAction;
  actions?: VenueAction[];
  requireAll?: boolean;
  ownerOnly?: boolean;
}

export function VenueActionGate({
  children,
  fallback = null,
  action,
  actions,
  requireAll = false,
  ownerOnly = false,
}: VenueActionGateProps) {
  const { canVenue, isOwner, permissions } = useVenueContext();

  let hasAccess = true;

  if (ownerOnly) {
    hasAccess = isOwner;
  }

  if (hasAccess && action) {
    hasAccess = canVenue(action);
  }

  if (hasAccess && actions?.length) {
    hasAccess = requireAll
      ? canAllVenueActions(permissions, actions)
      : canAnyVenueAction(permissions, actions);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
