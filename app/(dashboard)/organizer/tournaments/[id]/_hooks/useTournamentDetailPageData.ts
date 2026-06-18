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

import { useTournament } from '@/hooks/tournament';
import { STATUS_COLORS, STATUS_LABELS } from './tournament-detail-page.constants';

export function useTournamentDetailPageData(tournamentId: string) {
  const { tournament, loading, error } = useTournament(tournamentId);

  const statusColor = tournament
    ? (STATUS_COLORS[tournament.status] ?? STATUS_COLORS.DRAFT)
    : STATUS_COLORS.DRAFT;
  const statusLabel = tournament
    ? (STATUS_LABELS[tournament.status] ?? tournament.status)
    : '';

  return {
    tournamentId,
    tournament,
    loading,
    error,
    statusColor,
    statusLabel,
  };
}

export type TournamentDetailPageData = ReturnType<
  typeof useTournamentDetailPageData
>;
