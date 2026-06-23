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

import { useCallback } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Select } from '@/components/atoms/Select';
import { MatchStatus } from '@/graphql/generated';
import { ScheduleAutoRepackBanner } from '../_components/ScheduleAutoRepackBanner';
import { ScheduleDriftBanner } from '../_components/ScheduleDriftBanner';
import { ScheduleDndLayout } from '../_components/ScheduleDndLayout';
import { ScheduleGrid } from '../_components/ScheduleGrid';
import { ScheduleRepackAfterDropBanner } from '../_components/ScheduleRepackAfterDropBanner';
import {
  CORRECTABLE_STATUSES,
} from '../_hooks/schedule-page.constants';
import { selectedGridDateTime } from '../_hooks/schedule-page.derived';
import type { SchedulePageActions } from '../_hooks/useScheduleActions';
import type { SchedulePageData } from '../_hooks/useScheduleData';

interface ScheduleGridSectionProps {
  data: SchedulePageData;
  actions: SchedulePageActions;
}

export function ScheduleGridSection({
  data,
  actions,
}: ScheduleGridSectionProps) {
  const {
    scheduleLoading,
    scheduleMatchesMapped,
    displayMatches,
    scheduleRawMatches,
    courts,
    scheduleDates,
    activeDate,
    setGridSelectedDate,
    scheduledDayMatches,
    dayRange,
    isPastDate,
    minRestMinutes,
    courtBufferMinutes,
    autoRepackBanner,
    dismissAutoRepackBanner,
    driftBanner,
    dismissDriftBanner,
    repackAfterDropHint,
    setRepackAfterDropHint,
    setScheduleDate,
    setScheduleCourt,
    setCorrectionMatch,
  } = data;
  const {
    handleScheduleDrop,
    handleUnscheduleDrop,
    openScheduleForm,
    openRepack,
  } = actions;

  const handleMatchClick = useCallback(
    (matchId: string) => {
      const m = scheduleRawMatches.find((x) => x._id === matchId);
      if (m?.status === MatchStatus.NotStarted) {
        openScheduleForm(matchId);
      } else if (m && CORRECTABLE_STATUSES.has(m.status)) {
        setCorrectionMatch(m);
      }
    },
    [openScheduleForm, scheduleRawMatches, setCorrectionMatch],
  );

  const handleEmptyClick = useCallback(
    (courtId: string, time: string) => {
      const unscheduled = scheduleRawMatches.find(
        (x) => x.status === MatchStatus.NotStarted && !x.scheduledAt,
      );
      if (unscheduled) {
        openScheduleForm(unscheduled._id);
        setScheduleDate(selectedGridDateTime(courtId, time) ?? '');
        setScheduleCourt(courtId);
      }
    },
    [
      openScheduleForm,
      scheduleRawMatches,
      setScheduleCourt,
      setScheduleDate,
    ],
  );

  if (scheduleLoading && scheduleMatchesMapped.length === 0) {
    return (
      <GlassPanel card className="mt-4">
        <div className="flex items-center justify-center py-16">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <ScheduleAutoRepackBanner
        open={autoRepackBanner != null}
        kind={autoRepackBanner?.kind}
        courtLabels={autoRepackBanner?.courtLabels ?? []}
        shifts={autoRepackBanner?.shifts ?? []}
        anchorMatchNumber={autoRepackBanner?.anchorMatchNumber}
        onDismiss={dismissAutoRepackBanner}
      />
      <ScheduleDriftBanner
        open={driftBanner != null}
        payload={driftBanner}
        onDismiss={dismissDriftBanner}
      />

      {repackAfterDropHint ? (
        <ScheduleRepackAfterDropBanner
          hint={repackAfterDropHint}
          courtName={
            courts.find((c) => c.id === repackAfterDropHint.courtId)?.name
          }
          onPreviewRepack={() => {
            const m = scheduleRawMatches.find(
              (x) => x._id === repackAfterDropHint.anchorMatchId,
            );
            if (m) openRepack(m);
            setRepackAfterDropHint(null);
          }}
          onDismiss={() => setRepackAfterDropHint(null)}
        />
      ) : null}

      {scheduleDates.length > 0 ? (
        <div className="max-w-xs">
          <Select
            label="Ngày thi đấu"
            value={activeDate}
            onChange={(e) => setGridSelectedDate(e.target.value)}
            options={scheduleDates.map((d) => ({
              label: new Date(`${d}T12:00:00`).toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              }),
              value: d,
            }))}
          />
        </div>
      ) : null}

      <GlassPanel card className="overflow-hidden p-0">
        {courts.length === 0 ? (
          <p className="text-muted p-8 text-center text-sm">
            Chưa có sân. Thêm sân trong phần cài đặt giải.
          </p>
        ) : (
          <ScheduleDndLayout
            enabled
            courts={courts}
            allMatches={displayMatches}
            scheduledMatches={scheduledDayMatches}
            dayRange={dayRange}
            selectedDate={activeDate}
            isPastDate={isPastDate}
            minRestMinutes={minRestMinutes}
            courtBufferMinutes={courtBufferMinutes}
            onScheduleDrop={handleScheduleDrop}
            onUnscheduleDrop={handleUnscheduleDrop}
          >
            {scheduledDayMatches.length === 0 ? (
              <p className="text-muted border-surface-border border-b px-4 py-2 text-center text-xs">
                Chưa có trận xếp lịch — nhấn ô trống trên lưới để xếp lịch
              </p>
            ) : null}
            <ScheduleGrid
              courts={courts}
              matches={scheduledDayMatches}
              dayRange={dayRange}
              selectedDate={activeDate}
              isPastDate={isPastDate}
              onClickEmpty={handleEmptyClick}
              onClickMatch={handleMatchClick}
              courtBufferMinutes={courtBufferMinutes}
              dragDropEnabled
              emptyColumnHint="Nhấn hoặc kéo thả để xếp lịch"
            />
          </ScheduleDndLayout>
        )}
      </GlassPanel>
    </div>
  );
}
