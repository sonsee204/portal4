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
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import { webTournamentUrl } from '@/lib/tournaments/web-urls';
import type { Tournament } from '@/graphql/generated';
import {
  formatTournamentDate,
  STATUS_BADGE_VARIANT,
  STATUS_LABELS,
} from '../_hooks/tournaments-page.derived';
import type { TournamentsPageData } from '../_hooks/useTournamentsPageData';

interface TournamentsPlatformTableSectionProps {
  data: TournamentsPageData;
}

export function TournamentsPlatformTableSection({
  data,
}: TournamentsPlatformTableSectionProps) {
  const router = useRouter();
  const routes = useTournamentRoutes();
  const {
    tournaments,
    total,
    loading,
    error,
    refetch,
    hasNextPage,
    loadMore,
    isLoadingMore,
  } = data;

  return (
    <GlassPanel card className="mt-4">
      <QueryState
        loading={loading && tournaments.length === 0}
        error={error}
        empty={!loading && tournaments.length === 0}
        emptyMessage="Không có giải đấu nào"
        emptyIcon="trophy-outline"
        onRetry={() => void refetch()}
      >
        <DataTable
          columns={[
            { key: 'title', label: 'Giải đấu' },
            { key: 'status', label: 'Trạng thái' },
            { key: 'sport', label: 'Môn' },
            { key: 'startDate', label: 'Ngày bắt đầu' },
            { key: 'organizer', label: 'Ban tổ chức' },
            { key: 'stats', label: 'Thống kê', align: 'right' },
          ]}
          data={tournaments}
          totalCount={total}
          renderRow={(tournament: Tournament) => (
            <tr
              key={tournament._id}
              className="border-surface-border hover:bg-surface-hover cursor-pointer border-b transition-colors"
              onClick={() => router.push(routes.detail(tournament._id))}
            >
              <td className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-heading font-medium">
                      {tournament.title}
                    </p>
                    {tournament.location?.name ? (
                      <p className="text-secondary mt-0.5 text-xs">
                        {tournament.location.name}
                      </p>
                    ) : null}
                  </div>
                  <a
                    href={webTournamentUrl(tournament._id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary mt-0.5 shrink-0 hover:opacity-80"
                    title="Mở trên Web"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <IonIcon name="open-outline" size="sm" />
                  </a>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={STATUS_BADGE_VARIANT[tournament.status]}>
                  {STATUS_LABELS[tournament.status] ?? tournament.status}
                </Badge>
              </td>
              <td className="text-secondary px-4 py-3 text-sm">
                {tournament.sportType}
              </td>
              <td className="text-secondary px-4 py-3 text-sm">
                {formatTournamentDate(tournament.dates.startDate)}
              </td>
              <td className="px-4 py-3">
                <p className="text-heading text-sm">
                  {tournament.organizerName || '—'}
                </p>
                <Link
                  href={`/admin/users/${tournament.organizer}`}
                  className="text-primary text-xs hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  Xem BTC
                </Link>
              </td>
              <td className="text-secondary px-4 py-3 text-right text-sm whitespace-nowrap">
                {tournament.totalRegistrations} ĐK · {tournament.totalMatches}{' '}
                trận
              </td>
            </tr>
          )}
          infiniteScroll={{
            hasNextPage,
            onLoadMore: () => void loadMore(),
            loadingMore: isLoadingMore,
            loadedCount: tournaments.length,
            totalCount: total,
            loading: loading && tournaments.length === 0,
          }}
        />
      </QueryState>
    </GlassPanel>
  );
}
