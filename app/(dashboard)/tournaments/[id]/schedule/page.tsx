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

import { use, useState, useCallback, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TOURNAMENT } from '@/lib/strings';
import {
  useTournament,
  useTournamentMatches,
  useTournamentCategories,
  useScheduleMatch,
  useUnscheduleMatch,
  useAssignReferee,
  useCascadeReschedule,
  usePreviewRepackCourtSchedule,
  useRepackCourtSchedule,
  useTournamentScheduleMatches,
} from '@/hooks/tournament';
import { mapMatchesToSchedule } from '@/lib/tournament/mappers/schedule';
import { computeRefereeScheduleIssues } from '@/lib/tournament/referee-schedule-conflicts';
import {
  MatchStatus,
  RefereeInviteStatus,
  type ScheduleShiftPreview,
  type TournamentMatch,
} from '@/graphql/generated';
import { MatchCorrectionModal } from './_components/MatchCorrectionModal';
import { RepackCourtScheduleDialog } from './_components/RepackCourtScheduleDialog';
import { CascadeRescheduleDialog } from './_components/CascadeRescheduleDialog';
import { ScheduleTimelineView } from './_components/ScheduleTimelineView';
import { isPortalMatchOverdue } from '@/lib/tournament/schedule-overdue';

const CORRECTABLE_STATUSES = new Set<MatchStatus>([
  MatchStatus.Live,
  MatchStatus.Finished,
  MatchStatus.Walkover,
  MatchStatus.Retirement,
]);

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

const REPACK_ANCHOR_STATUSES = new Set<MatchStatus>([
  MatchStatus.Live,
  MatchStatus.Finished,
  MatchStatus.Walkover,
  MatchStatus.Retirement,
]);

function calendarKeyFromIso(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

function formatScheduleDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function selectedGridDateTime(courtId: string, time: string): string {
  const today = new Date();
  const y = today.getFullYear();
  const mo = String(today.getMonth() + 1).padStart(2, '0');
  const da = String(today.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}T${time}`;
}

export default function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<
    MatchStatus | typeof ALL_MATCH_STATUS
  >(ALL_MATCH_STATUS);
  const [schedulingMatchId, setSchedulingMatchId] = useState<string | null>(
    null
  );
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleCourt, setScheduleCourt] = useState('');
  const [correctionMatch, setCorrectionMatch] =
    useState<TournamentMatch | null>(null);
  const [repackAnchor, setRepackAnchor] = useState<TournamentMatch | null>(
    null
  );
  const [repackOpen, setRepackOpen] = useState(false);
  const [repackPreview, setRepackPreview] = useState<
    ScheduleShiftPreview[] | undefined
  >(undefined);
  const [cascadeAnchor, setCascadeAnchor] = useState<TournamentMatch | null>(
    null
  );
  const [cascadeOpen, setCascadeOpen] = useState(false);
  const { tournament } = useTournament(tournamentId);
  const { categories } = useTournamentCategories(tournamentId);
  const { matches: scheduleRawMatches } = useTournamentScheduleMatches({
    tournamentId,
  });
  const scheduleMatchesMapped = useMemo(
    () => mapMatchesToSchedule(scheduleRawMatches, categories),
    [scheduleRawMatches, categories]
  );
  const courtBufferMinutes =
    tournament?.scheduleConfig?.courtBufferMinutes ?? 5;

  const availableCourts = useMemo(
    () =>
      (tournament?.courts ?? []).filter(
        (c) => !c.status || c.status === 'available'
      ),
    [tournament?.courts]
  );

  const courtOptions = useMemo(
    () =>
      availableCourts.map((c) => ({
        label: c.name,
        value: c.name,
      })),
    [availableCourts]
  );

  const { matches: gridRawMatches } = useTournamentScheduleMatches({
    tournamentId,
    skip: viewMode !== 'grid',
  });

  const { matches, loading, refetch, subscribeToMatchUpdates } =
    useTournamentMatches({
      tournamentId,
      filter:
        statusFilter === ALL_MATCH_STATUS
          ? undefined
          : { status: statusFilter },
      pagination: { page: 1, limit: 100 },
      skip: viewMode !== 'list',
    });

  useEffect(() => {
    if (viewMode !== 'list' || !tournamentId) return;
    const unsubscribe = subscribeToMatchUpdates();
    return () => unsubscribe();
  }, [subscribeToMatchUpdates, tournamentId, viewMode]);

  const onSuccess = useCallback(() => void refetch(), [refetch]);
  const { scheduleMatch, loading: scheduling } = useScheduleMatch({
    onSuccess,
  });
  const { unscheduleMatch, loading: unscheduling } = useUnscheduleMatch({
    onSuccess,
  });
  const { assignReferee, loading: assigning } = useAssignReferee({ onSuccess });
  const { cascadeReschedule, loading: cascading } = useCascadeReschedule({
    onSuccess,
  });
  const {
    previewRepackCourtSchedule,
    loading: repackPreviewLoading,
    data: repackPreviewData,
    error: repackPreviewQueryError,
  } = usePreviewRepackCourtSchedule();
  const { repackCourtSchedule, loading: repacking } = useRepackCourtSchedule({
    onSuccess,
  });

  const isActionLoading =
    scheduling || unscheduling || assigning || cascading || repacking;

  const repackOverdueMatchIds = useMemo(() => {
    if (!repackPreviewData?.preview) return undefined;
    const ids = new Set<string>();
    for (const row of repackPreviewData.preview) {
      const m = matches.find((x) => x._id === row.matchId);
      if (m && isPortalMatchOverdue(m)) ids.add(row.matchId);
    }
    return ids.size > 0 ? ids : undefined;
  }, [repackPreviewData, matches]);

  useEffect(() => {
    if (
      !repackOpen ||
      !repackAnchor?.court?.name ||
      !repackAnchor.scheduledAt
    ) {
      return;
    }
    void previewRepackCourtSchedule({
      tournamentId,
      courtName: repackAnchor.court.name,
      calendarDate: calendarKeyFromIso(repackAnchor.scheduledAt),
      anchorMatchId: repackAnchor._id,
    });
  }, [repackOpen, repackAnchor, tournamentId, previewRepackCourtSchedule]);

  const openScheduleForm = (matchId: string) => {
    setSchedulingMatchId(matchId);
    setScheduleDate('');
    setScheduleCourt(courtOptions[0]?.value ?? '');
  };

  const closeScheduleForm = () => {
    setSchedulingMatchId(null);
    setScheduleDate('');
    setScheduleCourt('');
  };

  const handleScheduleSubmit = () => {
    if (!schedulingMatchId || !scheduleDate) return;
    void scheduleMatch({
      matchId: schedulingMatchId,
      scheduledAt: scheduleDate,
      courtName: scheduleCourt || undefined,
      estimatedDurationMinutes: 30,
    });
    closeScheduleForm();
  };

  const handleAssignReferee = (matchId: string) => {
    const issues = computeRefereeScheduleIssues(scheduleMatchesMapped, {
      courtBufferMinutes,
    });
    const issue = issues.get(matchId);
    if (issue?.severity === 'overlap') {
      const proceed = window.confirm(
        `Trận này trùng lịch trọng tài với #${issue.peerMatchNumbers.join(', #')}. Vẫn gán?`
      );
      if (!proceed) return;
    } else if (issue?.severity === 'tight_gap') {
      const proceed = window.confirm(
        `Trận này sát giờ với #${issue.peerMatchNumbers.join(', #')} — TT khó kịp di chuyển. Vẫn gán?`
      );
      if (!proceed) return;
    }

    const refereeName = window.prompt('Tên trọng tài:');
    if (refereeName) {
      void assignReferee(matchId, '', refereeName);
    }
  };

  const openRepack = useCallback((match: TournamentMatch) => {
    setRepackPreview(undefined);
    setRepackAnchor(match);
    setRepackOpen(true);
  }, []);

  const handleRepackConfirm = useCallback(async () => {
    if (!repackAnchor?.court?.name || !repackAnchor.scheduledAt) return;
    const result = await repackCourtSchedule({
      tournamentId,
      courtName: repackAnchor.court.name,
      calendarDate: calendarKeyFromIso(repackAnchor.scheduledAt),
      anchorMatchId: repackAnchor._id,
    });
    const preview = result.data?.repackCourtSchedule.preview;
    if (preview?.length) {
      setRepackPreview(preview);
    } else {
      setRepackOpen(false);
    }
  }, [repackAnchor, repackCourtSchedule, tournamentId]);

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
        <div className="flex items-center gap-2">
          <Link href={`/tournaments/${tournamentId}/edit`}>
            <Button variant="outline" size="sm" iconLeft="grid-outline">
              {TOURNAMENT.LABEL_ADD_COURTS_LINK}
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            iconLeft="arrow-back-outline"
            onClick={() => router.push('/tournaments')}
          >
            Quay lại
          </Button>
        </div>
      </PageHeader>

      <div className="mt-4 flex gap-2">
        {(
          [
            { id: 'grid' as const, label: 'Lưới sân' },
            { id: 'list' as const, label: 'Danh sách' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setViewMode(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              viewMode === tab.id
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {viewMode === 'grid' ? (
        <div className="mt-4">
          <ScheduleTimelineView
            tournamentId={tournamentId}
            onRepackRequest={(anchorMatchId) => {
              const m = gridRawMatches.find((x) => x._id === anchorMatchId);
              if (m) openRepack(m);
            }}
            onMatchClick={(matchId) => {
              const m = gridRawMatches.find((x) => x._id === matchId);
              if (m?.status === MatchStatus.NotStarted) {
                openScheduleForm(matchId);
              } else if (m && CORRECTABLE_STATUSES.has(m.status)) {
                setCorrectionMatch(m);
              }
            }}
            onEmptyClick={(_courtId, time) => {
              const unscheduled = gridRawMatches.find(
                (x) => x.status === MatchStatus.NotStarted && !x.scheduledAt
              );
              if (unscheduled) {
                openScheduleForm(unscheduled._id);
                setScheduleDate(selectedGridDateTime(_courtId, time) ?? '');
                setScheduleCourt(_courtId);
              }
            }}
          />
        </div>
      ) : null}

      {schedulingMatchId && (
        <GlassPanel card className="mt-4">
          <h3 className="text-heading mb-4 text-sm font-semibold">
            Lên lịch trận đấu
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Thời gian (YYYY-MM-DDTHH:mm)"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              placeholder="2026-06-15T08:00"
            />
            {courtOptions.length > 0 ? (
              <Select
                label="Sân thi đấu"
                value={scheduleCourt}
                onChange={(e) => setScheduleCourt(e.target.value)}
                options={courtOptions}
              />
            ) : (
              <Input
                label="Tên sân"
                value={scheduleCourt}
                onChange={(e) => setScheduleCourt(e.target.value)}
                placeholder="Sân 1"
              />
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={closeScheduleForm}>
              Huỷ
            </Button>
            <Button
              size="sm"
              disabled={!scheduleDate || isActionLoading}
              onClick={handleScheduleSubmit}
            >
              Xác nhận
            </Button>
          </div>
        </GlassPanel>
      )}

      {viewMode === 'list' ? (
        <>
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
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span>
                              {m.scheduledAt
                                ? formatScheduleDate(m.scheduledAt)
                                : '—'}
                            </span>
                            {isPortalMatchOverdue(m) ? (
                              <span className="rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                                Quá hạn
                              </span>
                            ) : null}
                          </div>
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
                            {m.status === MatchStatus.NotStarted &&
                              !m.isBye && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={isActionLoading}
                                    onClick={() => openScheduleForm(m._id)}
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
                            {CORRECTABLE_STATUSES.has(m.status) && (
                              <Button
                                size="sm"
                                variant="ghost"
                                disabled={isActionLoading}
                                onClick={() => setCorrectionMatch(m)}
                              >
                                Hiệu chỉnh
                              </Button>
                            )}
                            {m.scheduledAt &&
                              m.court?.name &&
                              REPACK_ANCHOR_STATUSES.has(m.status) && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={isActionLoading}
                                    onClick={() => openRepack(m)}
                                  >
                                    Dồn sân
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    disabled={isActionLoading}
                                    onClick={() => {
                                      setCascadeAnchor(m);
                                      setCascadeOpen(true);
                                    }}
                                  >
                                    Dịch đều
                                  </Button>
                                </>
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
      ) : null}

      <MatchCorrectionModal
        match={correctionMatch}
        onClose={() => setCorrectionMatch(null)}
        onSuccess={() => void refetch()}
      />

      <RepackCourtScheduleDialog
        open={repackOpen}
        anchorMatch={repackAnchor}
        courtName={repackAnchor?.court?.name ?? ''}
        calendarDate={
          repackAnchor?.scheduledAt
            ? calendarKeyFromIso(repackAnchor.scheduledAt)
            : ''
        }
        previewRows={repackPreviewData?.preview}
        overdueCount={repackPreviewData?.overdueCount ?? 0}
        overdueMatchIds={repackOverdueMatchIds}
        previewLoading={repackPreviewLoading}
        previewError={repackPreviewQueryError?.message ?? null}
        onClose={() => setRepackOpen(false)}
        onConfirm={handleRepackConfirm}
        loading={repacking}
        lastPreview={repackPreview}
      />

      <CascadeRescheduleDialog
        open={cascadeOpen}
        anchorMatch={cascadeAnchor}
        allMatches={matches}
        onConfirm={(matchId, shiftMinutes) => {
          void cascadeReschedule({ matchId, shiftMinutes });
          setCascadeOpen(false);
        }}
        onDismiss={() => setCascadeOpen(false)}
        loading={cascading}
      />
    </>
  );
}
