/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useAuthStore } from '@/stores/auth';

interface TournamentSupportTarget {
  organizer?: string | null;
}

export function useTournamentSupportMode(
  tournament?: TournamentSupportTarget | null,
) {
  const currentUserId = useAuthStore((s) => s.user?._id ?? null);
  const isPlatformOwner = useAuthStore((s) => s.user?.isOwner ?? false);

  const isSupportMode =
    Boolean(isPlatformOwner) &&
    Boolean(tournament?.organizer) &&
    tournament!.organizer !== currentUserId;

  return {
    isPlatformOwner,
    isSupportMode,
    organizerId: tournament?.organizer ?? null,
  };
}
