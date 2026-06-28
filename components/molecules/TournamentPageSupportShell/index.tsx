/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import type { ReactNode } from 'react';
import { PlatformSupportBanner } from '@/components/molecules/PlatformSupportBanner';
import { useTournamentSupportMode } from '@/hooks/tournament/useTournamentSupportMode';

interface TournamentPageSupportShellProps {
  tournament?: {
    _id?: string;
    organizer?: string | null;
    organizerName?: string | null;
  } | null;
  children: ReactNode;
}

export function TournamentPageSupportShell({
  tournament,
  children,
}: TournamentPageSupportShellProps) {
  const { isSupportMode, organizerId } = useTournamentSupportMode(tournament);

  return (
    <>
      {isSupportMode && organizerId ? (
        <PlatformSupportBanner
          tournamentId={tournament?._id}
          organizerId={organizerId}
          organizerName={tournament?.organizerName}
        />
      ) : null}
      {children}
    </>
  );
}
