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

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import {
  MY_VENUES_CONNECTION,
  STAFFED_VENUES_CONNECTION,
} from '@/graphql/owner/queries';
import type {
  MyVenuesConnectionQuery,
  StaffedVenuesConnectionQuery,
  VenueAction,
} from '@/graphql/generated';
import {
  canAnyVenueAction,
  canVenueAction,
  type VenuePermissionSet,
} from '@/lib/venue/permissions';
import { connectionNodes } from '@/hooks/shared/useCursorConnection';

const STORAGE_KEY = 'portal-owner-selected-venue';

export type OwnerVenueSummary = NonNullable<
  NonNullable<
    MyVenuesConnectionQuery['myVenuesConnection']
  >['edges'][number]['node']
>;

interface VenueContextValue {
  venues: OwnerVenueSummary[];
  selectedVenue: OwnerVenueSummary | null;
  selectedVenueId: string | null;
  permissions: VenuePermissionSet;
  isOwner: boolean;
  loading: boolean;
  error: Error | undefined;
  setSelectedVenueId: (venueId: string) => void;
  canVenue: (action: VenueAction) => boolean;
  canAnyVenue: (actions: VenueAction[]) => boolean;
  refetchVenues: () => void;
}

const VenueContext = createContext<VenueContextValue | null>(null);

function dedupeVenues(
  owned: OwnerVenueSummary[],
  staffed: OwnerVenueSummary[]
): OwnerVenueSummary[] {
  const map = new Map<string, OwnerVenueSummary>();
  for (const venue of [...owned, ...staffed]) {
    if (!map.has(venue._id)) {
      map.set(venue._id, venue);
    }
  }
  return Array.from(map.values());
}

function readStoredVenueId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(STORAGE_KEY);
}

function writeStoredVenueId(venueId: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, venueId);
}

export function VenueContextProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [manualVenueId, setManualVenueId] = useState<string | null>(null);

  const {
    data: ownedData,
    loading: ownedLoading,
    error: ownedError,
    refetch: refetchOwned,
  } = useQuery<MyVenuesConnectionQuery>(MY_VENUES_CONNECTION, {
    variables: { pagination: { first: 50 } },
  });

  const {
    data: staffedData,
    loading: staffedLoading,
    error: staffedError,
    refetch: refetchStaffed,
  } = useQuery<StaffedVenuesConnectionQuery>(STAFFED_VENUES_CONNECTION, {
    variables: { pagination: { first: 50 } },
  });

  const venues = useMemo(() => {
    const owned = (connectionNodes(ownedData?.myVenuesConnection?.edges) ??
      []) as OwnerVenueSummary[];
    const staffed = (connectionNodes(
      staffedData?.staffedVenuesConnection?.edges
    ) ?? []) as OwnerVenueSummary[];
    return dedupeVenues(owned, staffed);
  }, [ownedData, staffedData]);

  const queryVenueId = searchParams.get('venueId');

  const defaultVenueId = useMemo(() => {
    if (venues.length === 0) return null;

    if (queryVenueId && venues.some((v) => v._id === queryVenueId)) {
      return queryVenueId;
    }

    const stored = readStoredVenueId();
    if (stored && venues.some((v) => v._id === stored)) {
      return stored;
    }

    return venues[0]?._id ?? null;
  }, [queryVenueId, venues]);

  const selectedVenueId = manualVenueId ?? defaultVenueId;

  const setSelectedVenueId = useCallback(
    (venueId: string) => {
      setManualVenueId(venueId);
      writeStoredVenueId(venueId);
      const params = new URLSearchParams(searchParams.toString());
      params.set('venueId', venueId);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const selectedVenue = useMemo(
    () => venues.find((v) => v._id === selectedVenueId) ?? null,
    [venues, selectedVenueId]
  );

  const permissions = useMemo(
    () => (selectedVenue?.myPermissions ?? []) as VenuePermissionSet,
    [selectedVenue]
  );

  const isOwner = selectedVenue?.isOwner ?? false;

  const canVenue = useCallback(
    (action: VenueAction) => canVenueAction(permissions, action),
    [permissions]
  );

  const canAnyVenue = useCallback(
    (actions: VenueAction[]) => canAnyVenueAction(permissions, actions),
    [permissions]
  );

  const refetchVenues = useCallback(() => {
    void refetchOwned();
    void refetchStaffed();
  }, [refetchOwned, refetchStaffed]);

  const value = useMemo<VenueContextValue>(
    () => ({
      venues,
      selectedVenue,
      selectedVenueId,
      permissions,
      isOwner,
      loading: ownedLoading || staffedLoading,
      error: ownedError ?? staffedError,
      setSelectedVenueId,
      canVenue,
      canAnyVenue,
      refetchVenues,
    }),
    [
      venues,
      selectedVenue,
      selectedVenueId,
      permissions,
      isOwner,
      ownedLoading,
      staffedLoading,
      ownedError,
      staffedError,
      setSelectedVenueId,
      canVenue,
      canAnyVenue,
      refetchVenues,
    ]
  );

  return (
    <VenueContext.Provider value={value}>{children}</VenueContext.Provider>
  );
}

export function useVenueContext(): VenueContextValue {
  const ctx = useContext(VenueContext);
  if (!ctx) {
    throw new Error('useVenueContext must be used within VenueContextProvider');
  }
  return ctx;
}

export function useOptionalVenueContext(): VenueContextValue | null {
  return useContext(VenueContext);
}
