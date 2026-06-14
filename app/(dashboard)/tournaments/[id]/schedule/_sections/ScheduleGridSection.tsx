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

import { MatchStatus } from '@/graphql/generated';
import { ScheduleTimelineView } from '../_components/ScheduleTimelineView';
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
    tournamentId,
    gridRawMatches,
    setScheduleDate,
    setScheduleCourt,
    setCorrectionMatch,
  } = data;
  const { openScheduleForm, openRepack } = actions;

  return (
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
            (x) => x.status === MatchStatus.NotStarted && !x.scheduledAt,
          );
          if (unscheduled) {
            openScheduleForm(unscheduled._id);
            setScheduleDate(selectedGridDateTime(_courtId, time) ?? '');
            setScheduleCourt(_courtId);
          }
        }}
      />
    </div>
  );
}
