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

import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TOURNAMENT } from '@/lib/strings';
import { MatchStatus } from '@/graphql/generated';
import { isPortalMatchOverdue } from '@/lib/tournament/schedule-overdue';
import {
  CORRECTABLE_STATUSES,
  LIST_STATUS_COLORS,
  LIST_STATUS_TABS,
  REFEREE_STATUS_CONFIG,
  REPACK_ANCHOR_STATUSES,
} from '../_hooks/schedule-page.constants';
import { formatScheduleDate } from '../_hooks/schedule-page.derived';
import type { SchedulePageActions } from '../_hooks/useScheduleActions';
import type { SchedulePageData } from '../_hooks/useScheduleData';

interface ScheduleListSectionProps {
  data: SchedulePageData;
  actions: SchedulePageActions;
}

export function ScheduleListSection({
  data,
  actions,
}: ScheduleListSectionProps) {
  const {
    statusFilter,
    setStatusFilter,
    matches,
    loading,
    setCorrectionMatch,
    setCascadeAnchor,
    setCascadeOpen,
  } = data;
  const {
    isActionLoading,
    openScheduleForm,
    handleAssignReferee,
    openRepack,
    unscheduleMatch,
  } = actions;

  return (
    <>
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {LIST_STATUS_TABS.map((tab) => (
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
                  <th className="text-secondary p-3 text-left font-medium">#</th>
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
                          <span className="text-secondary">{m.refereeName}</span>
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
                        className={`text-xs font-medium ${LIST_STATUS_COLORS[m.status] ?? 'text-secondary'}`}
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
                        {m.scheduledAt && m.status === MatchStatus.NotStarted && (
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
  );
}
