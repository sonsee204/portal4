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

import { use } from 'react';
import { useScheduleActions } from './_hooks/useScheduleActions';
import { useScheduleData } from './_hooks/useScheduleData';
import { ScheduleDialogsSection } from './_sections/ScheduleDialogsSection';
import { ScheduleFormSection } from './_sections/ScheduleFormSection';
import { ScheduleGridSection } from './_sections/ScheduleGridSection';
import { ScheduleHeaderSection } from './_sections/ScheduleHeaderSection';
import { ScheduleListSection } from './_sections/ScheduleListSection';
import { ScheduleViewTabsSection } from './_sections/ScheduleViewTabsSection';
import { TournamentPageSupportShell } from '@/components/molecules/TournamentPageSupportShell';

export default function SchedulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const data = useScheduleData(tournamentId);
  const actions = useScheduleActions(data);

  return (
    <TournamentPageSupportShell tournament={data.tournament}>
      <ScheduleHeaderSection
        tournamentId={tournamentId}
        matchCount={data.matches.length}
      />

      <ScheduleViewTabsSection
        viewMode={data.viewMode}
        onViewModeChange={data.setViewMode}
      />

      {data.viewMode === 'grid' ? (
        <ScheduleGridSection data={data} actions={actions} />
      ) : null}

      {data.schedulingMatchId ? (
        <ScheduleFormSection data={data} actions={actions} />
      ) : null}

      {data.viewMode === 'list' ? (
        <ScheduleListSection data={data} actions={actions} />
      ) : null}

      <ScheduleDialogsSection data={data} actions={actions} />
    </TournamentPageSupportShell>
  );
}
