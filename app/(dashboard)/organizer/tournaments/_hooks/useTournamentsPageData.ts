/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '@/stores/auth';
import { useMyTournaments, usePlatformTournaments } from '@/hooks/tournament';
import { createTournamentStatusSubscriptions } from '@/lib/utils/subscription';
import {
  ORGANIZER_PAGE_SIZE,
  PLATFORM_PAGE_SIZE,
  type TournamentStatusTab,
} from './tournaments-page.constants';
import { buildTournamentListFilter } from './tournaments-page.derived';

export function useTournamentsPageData() {
  const isPlatformOwner = useAuthStore((s) => s.user?.isOwner ?? false);
  const [activeTab, setActiveTab] = useState<TournamentStatusTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [organizerId, setOrganizerId] = useState('');

  const filter = useMemo(
    () =>
      buildTournamentListFilter({
        activeTab,
        searchQuery: isPlatformOwner ? searchQuery : undefined,
        organizerId: isPlatformOwner ? organizerId : undefined,
      }),
    [activeTab, searchQuery, organizerId, isPlatformOwner],
  );

  const organizerQuery = useMyTournaments({
    filter,
    pagination: { page: 1, limit: ORGANIZER_PAGE_SIZE },
    skip: isPlatformOwner,
  });

  const platformQuery = usePlatformTournaments({
    filter,
    pagination: { page: 1, limit: PLATFORM_PAGE_SIZE },
    skip: !isPlatformOwner,
  });

  const {
    tournaments,
    total,
    loading,
    error,
    refetch,
    subscribeToMore,
    hasNextPage,
    loadMore,
    isLoadingMore,
  } = isPlatformOwner ? platformQuery : organizerQuery;

  const tournamentIds = useMemo(
    () => tournaments.map((t) => t._id).filter(Boolean),
    [tournaments],
  );

  useEffect(() => {
    if (isPlatformOwner || tournamentIds.length === 0) return;
    const unsubscribe = createTournamentStatusSubscriptions(
      subscribeToMore,
      refetch,
      tournamentIds,
    );
    return () => unsubscribe();
  }, [isPlatformOwner, tournamentIds, subscribeToMore, refetch]);

  const handleStatusChange = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    isPlatformOwner,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    organizerId,
    setOrganizerId,
    tournaments,
    total,
    loading,
    error,
    refetch,
    handleStatusChange,
    hasNextPage,
    loadMore,
    isLoadingMore,
  };
}

export type TournamentsPageData = ReturnType<typeof useTournamentsPageData>;
