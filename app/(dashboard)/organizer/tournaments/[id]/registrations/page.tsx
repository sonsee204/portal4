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
import { useRegistrationsPageActions } from './_hooks/useRegistrationsPageActions';
import { useRegistrationsPageData } from './_hooks/useRegistrationsPageData';
import { RegistrationsDialogsSection } from './_sections/RegistrationsDialogsSection';
import { RegistrationsFiltersSection } from './_sections/RegistrationsFiltersSection';
import { RegistrationsHeaderSection } from './_sections/RegistrationsHeaderSection';
import { RegistrationsTableSection } from './_sections/RegistrationsTableSection';
import { TournamentPageSupportShell } from '@/components/molecules/TournamentPageSupportShell';

export default function RegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const data = useRegistrationsPageData(tournamentId);
  const actions = useRegistrationsPageActions(data);

  return (
    <TournamentPageSupportShell tournament={data.tournament}>
      <RegistrationsHeaderSection data={data} />
      <RegistrationsDialogsSection data={data} actions={actions} />
      <RegistrationsFiltersSection data={data} actions={actions} />
      <RegistrationsTableSection data={data} actions={actions} />
    </TournamentPageSupportShell>
  );
}
