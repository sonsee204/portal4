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
import { TOURNAMENT } from '@/lib/strings';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import type { Tournament } from '@/graphql/generated';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-400',
  PUBLISHED: 'bg-blue-500/20 text-blue-400',
  REGISTRATION_OPEN: 'bg-green-500/20 text-green-400',
  REGISTRATION_CLOSED: 'bg-yellow-500/20 text-yellow-400',
  IN_PROGRESS: 'bg-orange-500/20 text-orange-400',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: TOURNAMENT.STATUS_DRAFT,
  PUBLISHED: TOURNAMENT.STATUS_PUBLISHED,
  REGISTRATION_OPEN: TOURNAMENT.STATUS_REGISTRATION_OPEN,
  REGISTRATION_CLOSED: TOURNAMENT.STATUS_REGISTRATION_CLOSED,
  IN_PROGRESS: TOURNAMENT.STATUS_IN_PROGRESS,
  COMPLETED: TOURNAMENT.STATUS_COMPLETED,
  CANCELLED: TOURNAMENT.STATUS_CANCELLED,
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

interface TournamentListCardProps {
  tournament: Pick<
    Tournament,
    | '_id'
    | 'title'
    | 'sportType'
    | 'status'
    | 'totalCategories'
    | 'totalRegistrations'
    | 'totalMatches'
    | 'dates'
    | 'location'
  >;
}

export function TournamentListCard({ tournament }: TournamentListCardProps) {
  const routes = useTournamentRoutes();
  const statusColor = STATUS_COLORS[tournament.status] ?? STATUS_COLORS.DRAFT;
  const statusLabel = STATUS_LABELS[tournament.status] ?? tournament.status;

  return (
    <Link
      href={routes.detail(tournament._id)}
      className="block p-4 transition-colors hover:bg-white/5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-heading truncate text-base font-semibold">
              {tournament.title}
            </h3>
            <span
              className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="text-secondary mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span>{tournament.sportType}</span>
            {tournament.location?.name && (
              <span>{tournament.location.name}</span>
            )}
            <span>{formatDate(tournament.dates.startDate)}</span>
          </div>
        </div>

        <div className="text-secondary flex shrink-0 items-center gap-4 text-sm">
          <div className="text-center">
            <div className="text-heading text-lg font-bold">
              {tournament.totalCategories}
            </div>
            <div className="text-xs">Nội dung</div>
          </div>
          <div className="text-center">
            <div className="text-heading text-lg font-bold">
              {tournament.totalRegistrations}
            </div>
            <div className="text-xs">Đăng ký</div>
          </div>
          <div className="text-center">
            <div className="text-heading text-lg font-bold">
              {tournament.totalMatches}
            </div>
            <div className="text-xs">Trận</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
