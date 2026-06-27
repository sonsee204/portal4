/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import Link from 'next/link';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TOURNAMENT } from '@/lib/strings';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import { TournamentListCard } from '../_components/TournamentListCard';
import { TournamentStatusActions } from '../_components/TournamentStatusActions';
import type { TournamentsPageData } from '../_hooks/useTournamentsPageData';

interface TournamentsOrganizerCardsSectionProps {
  data: TournamentsPageData;
}

export function TournamentsOrganizerCardsSection({
  data,
}: TournamentsOrganizerCardsSectionProps) {
  const routes = useTournamentRoutes();
  const { tournaments, loading, handleStatusChange } = data;

  if (loading && tournaments.length === 0) {
    return (
      <GlassPanel card className="mt-4">
        <div className="flex items-center justify-center py-12">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </GlassPanel>
    );
  }

  if (tournaments.length === 0) {
    return (
      <GlassPanel card className="mt-4">
        <div className="py-12 text-center">
          <p className="text-secondary">{TOURNAMENT.EMPTY_TOURNAMENTS}</p>
          <Link
            href={routes.create}
            className="text-primary mt-2 inline-block text-sm hover:underline"
          >
            Tạo giải đấu đầu tiên
          </Link>
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {tournaments.map((tournament) => (
        <GlassPanel key={tournament._id} card className="p-0">
          <TournamentListCard tournament={tournament} />
          <div className="border-surface-border border-t px-4 py-3">
            <TournamentStatusActions
              tournamentId={tournament._id}
              status={tournament.status}
              onStatusChange={handleStatusChange}
            />
          </div>
        </GlassPanel>
      ))}
    </div>
  );
}
