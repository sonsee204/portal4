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

import Link from 'next/link';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import { TOURNAMENT } from '@/lib/strings';
import {
  formatDate,
  getEditQuickLinkLabel,
} from '../_hooks/tournament-detail-page.derived';
import type { TournamentDetailPageData } from '../_hooks/useTournamentDetailPageData';

interface TournamentDetailContentSectionProps {
  data: TournamentDetailPageData;
}

export function TournamentDetailContentSection({
  data,
}: TournamentDetailContentSectionProps) {
  const routes = useTournamentRoutes();
  const { tournamentId, tournament } = data;

  if (!tournament) return null;

  return (
    <GlassPanel card>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white/5 p-4 text-center">
          <div className="text-heading text-2xl font-bold">
            {tournament.totalCategories}
          </div>
          <div className="text-muted mt-1 text-sm">
            {TOURNAMENT.LABEL_CATEGORIES}
          </div>
        </div>
        <div className="rounded-lg bg-white/5 p-4 text-center">
          <div className="text-heading text-2xl font-bold">
            {tournament.totalRegistrations}
          </div>
          <div className="text-muted mt-1 text-sm">
            {TOURNAMENT.LABEL_REGISTRATIONS}
          </div>
        </div>
        <div className="rounded-lg bg-white/5 p-4 text-center">
          <div className="text-heading text-2xl font-bold">
            {tournament.totalMatches}
          </div>
          <div className="text-muted mt-1 text-sm">Trận đấu</div>
        </div>
        <div className="rounded-lg bg-white/5 p-4 text-center">
          <div className="text-heading text-sm font-medium">
            {tournament.dates?.startDate
              ? formatDate(tournament.dates.startDate)
              : '—'}
          </div>
          <div className="text-muted mt-1 text-sm">Ngày bắt đầu</div>
        </div>
      </div>

      <div className="border-surface-border mt-6 border-t pt-6">
        <h2 className="text-heading mb-4 text-sm font-semibold">
          Thao tác nhanh
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Link
            href={routes.edit(tournamentId)}
            className="text-secondary hover:text-primary flex items-center gap-3 rounded-lg border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <IonIcon name="create-outline" size="md" />
            <span className="font-medium">
              {getEditQuickLinkLabel(tournament.status)}
            </span>
          </Link>
          <Link
            href={routes.registrations(tournamentId)}
            className="text-secondary hover:text-primary flex items-center gap-3 rounded-lg border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <IonIcon name="person-add-outline" size="md" />
            <span className="font-medium">
              {TOURNAMENT.LABEL_REGISTRATIONS}
            </span>
          </Link>
          <Link
            href={routes.draw(tournamentId)}
            className="text-secondary hover:text-primary flex items-center gap-3 rounded-lg border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <IonIcon name="git-branch-outline" size="md" />
            <span className="font-medium">{TOURNAMENT.LABEL_DRAW}</span>
          </Link>
          <Link
            href={routes.schedule(tournamentId)}
            className="text-secondary hover:text-primary flex items-center gap-3 rounded-lg border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <IonIcon name="calendar-outline" size="md" />
            <span className="font-medium">{TOURNAMENT.LABEL_SCHEDULE}</span>
          </Link>
          <Link
            href={routes.print(tournamentId)}
            className="text-secondary hover:text-primary flex items-center gap-3 rounded-lg border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
          >
            <IonIcon name="print-outline" size="md" />
            <span className="font-medium">
              {TOURNAMENT.LABEL_PRINT_DOCUMENTS}
            </span>
          </Link>
          <Link
               href={routes.leaderboard(tournamentId)}
               className="text-secondary hover:text-primary flex items-center gap-3 rounded-lg border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
>
              <IonIcon name="trophy-outline" size="md" />
              <span className="font-medium">Bảng xếp hạng</span>
          </Link>
        </div>
      </div>
    </GlassPanel>
  );
}
