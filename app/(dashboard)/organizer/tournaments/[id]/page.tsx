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
import { useTournamentDetailPageData } from './_hooks/useTournamentDetailPageData';
import { TournamentPageSupportShell } from '@/components/molecules/TournamentPageSupportShell';
import { TournamentDetailContentSection } from './_sections/TournamentDetailContentSection';
import { TournamentDetailErrorSection } from './_sections/TournamentDetailErrorSection';
import { TournamentDetailHeaderSection } from './_sections/TournamentDetailHeaderSection';
import { TournamentDetailLoadingSection } from './_sections/TournamentDetailStateSections';

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const data = useTournamentDetailPageData(id);

  if (data.loading) {
    return <TournamentDetailLoadingSection />;
  }

  if (data.error || !data.tournament) {
    return <TournamentDetailErrorSection />;
  }

  return (
    <TournamentPageSupportShell tournament={data.tournament}>
      <div className="space-y-6">
        <TournamentDetailHeaderSection data={data} />
        <TournamentDetailContentSection data={data} />
      </div>
    </TournamentPageSupportShell>
  );
}
