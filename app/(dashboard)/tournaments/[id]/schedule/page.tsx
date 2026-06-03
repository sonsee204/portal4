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

import { use, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TOURNAMENT } from '@/lib/strings';
import {
  useTournamentMatches,
  useScheduleMatch,
  useUnscheduleMatch,
  useAssignReferee,
} from '@/hooks/tournament';
import { MatchStatus, RefereeInviteStatus } from '@/graphql/generated';

const REFEREE_STATUS_CONFIG: Record<
  RefereeInviteStatus,
  { label: string; className: string }
> = {
  [RefereeInviteStatus.Pending]: {
    label: 'Chờ xác nhận',
    className: 'bg-amber-500/10 text-amber-500',
  },
  [RefereeInviteStatus.Confirmed]: {
    label: 'Đã xác nhận',
    className: 'bg-emerald-500/10 text-emerald-500',
  },
  [RefereeInviteStatus.Declined]: {
    label: 'Đã từ chối',
    className: 'bg-red-500/10 text-red-500',
  },
};

const ALL_MATCH_STATUS = 'ALL' as const;

export default function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<
    MatchStatus | typeof ALL_MATCH_STATUS
  >(ALL_MATCH_STATUS);

  const { matches, loading, refetch, subscribeToMatchUpdates } =
    useTournamentMatches({
      tournamentId,
      filter:
        statusFilter === ALL_MATCH_STATUS
          ? undefined
          : { status: statusFilter },
      pagination: { page: 1, limit: 100 },
    });

  useEffect(() => {
    if (!tournamentId) return;
    const unsubscribe = subscribeToMatchUpdates();
    return () => unsubscribe();
  }, [subscribeToMatchUpdates, tournamentId]);

  const onSuccess = useCallback(() => void refetch(), [refetch]);
  const { scheduleMatch, loading: scheduling } = useScheduleMatch({
    onSuccess,
  });
  const { unscheduleMatch, loading: unscheduling } = useUnscheduleMatch({
    onSuccess,
  });
  const { assignReferee, loading: assigning } = useAssignReferee({ onSuccess });

  const isActionLoading = scheduling || unscheduling || assigning;

  const handleSchedule = (matchId: string) => {
    const dateStr = window.prompt('Thời gian (YYYY-MM-DDTHH:mm):');
    const courtName = window.prompt('Tên sân:');
    if (dateStr) {
      void scheduleMatch({
        matchId,
        scheduledAt: dateStr,
        courtName: courtName ?? undefined,
        estimatedDurationMinutes: 30,
      });
    }
  };

  const handleAssignReferee = (matchId: string) => {
    const refereeName = window.prompt('Tên trọng tài:');
    if (refereeName) {
      void assignReferee(matchId, '', refereeName);
    }
  };

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const STATUS_COLORS: Record<MatchStatus, string> = {
    [MatchStatus.NotStarted]: 'text-secondary',
    [MatchStatus.Live]: 'text-green-400',
    [MatchStatus.Finished]: 'text-emerald-400',
    [MatchStatus.Bye]: 'text-yellow-400',
    [MatchStatus.Walkover]: 'text-orange-400',
    [MatchStatus.Cancelled]: 'text-red-400',
    [MatchStatus.Retirement]: 'text-orange-400',
  };

  return (
    <>
      <PageHeader
        title={TOURNAMENT.LABEL_SCHEDULE}
        description={`${matches.length} trận đấu`}
      >
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/tournaments')}
        >
          Quay lại
        </Button>
      </PageHeader>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {[
          { label: 'Tất cả', value: ALL_MATCH_STATUS },
          { label: 'Chưa bắt đầu', value: MatchStatus.NotStarted },
          { label: 'Đang diễn ra', value: MatchStatus.Live },
          { label: 'Đã kết thúc', value: MatchStatus.Finished },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === tab.value
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {loading && matches.length === 0 ? (
          <GlassPanel card>
            <div className="flex items-center justify-center py-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </GlassPanel>
        ) : matches.length === 0 ? (
          <GlassPanel card>
            <div className="py-12 text-center">
              <p className="text-secondary">{TOURNAMENT.EMPTY_MATCHES}</p>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-surface-border border-b">
                  <th className="text-secondary p-3 text-left font-medium">
                    #
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Vòng
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Trận đấu
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Lịch
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Sân
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Trọng tài
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="text-secondary p-3 text-right font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr
                    key={m._id}
                    className="border-surface-border border-b last:border-0 hover:bg-white/5"
                  >
                    <td className="text-secondary p-3 font-mono text-xs">
                      {m.matchNumber}
                    </td>
                    <td className="p-3 text-xs">{m.roundLabel}</td>
                    <td className="p-3">
                      <span className="text-heading font-medium">
                        {m.player1?.name ?? 'TBD'}
                      </span>
                      <span className="text-secondary mx-1">vs</span>
                      <span className="text-heading font-medium">
                        {m.player2?.name ?? 'TBD'}
                      </span>
                    </td>
                    <td className="text-secondary p-3 text-xs">
                      {m.scheduledAt ? formatDate(m.scheduledAt) : '—'}
                    </td>
                    <td className="text-secondary p-3 text-xs">
                      {m.court?.name ?? '—'}
                    </td>
                    <td className="p-3 text-xs">
                      {m.refereeName ? (
                        <div className="flex flex-col gap-1">
                          <span className="text-secondary">
                            {m.refereeName}
                          </span>
                          {m.refereeInviteStatus && (
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                REFEREE_STATUS_CONFIG[m.refereeInviteStatus]
                                  ?.className ?? ''
                              }`}
                            >
                              {REFEREE_STATUS_CONFIG[m.refereeInviteStatus]
                                ?.label ?? m.refereeInviteStatus}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-secondary">—</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-xs font-medium ${STATUS_COLORS[m.status] ?? 'text-secondary'}`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {m.status === MatchStatus.NotStarted && !m.isBye && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActionLoading}
                              onClick={() => handleSchedule(m._id)}
                            >
                              Lên lịch
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActionLoading}
                              onClick={() => handleAssignReferee(m._id)}
                            >
                              Trọng tài
                            </Button>
                          </>
                        )}
                        {m.scheduledAt &&
                          m.status === MatchStatus.NotStarted && (
                            <Button
                              size="sm"
                              variant="ghost"
                              disabled={isActionLoading}
                              onClick={() => void unscheduleMatch(m._id)}
                              className="text-red-400"
                            >
                              Huỷ lịch
                            </Button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassPanel>
        )}
      </div>
    </>
  );
}
