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
import { useDrawActions } from './_hooks/useDrawActions';
import { useDrawData } from './_hooks/useDrawData';
import {
  DrawCategoryTabsSection,
  DrawLoadingSection,
} from './_sections/DrawCategoryTabsSection';
import { DrawHeaderSection } from './_sections/DrawHeaderSection';
import {
  DrawMainSection,
  DrawResetDialogSection,
} from './_sections/DrawMainSection';
import {
  DrawPendingWarningSection,
  DrawStatsSection,
  DrawToolbarSection,
} from './_sections/DrawToolbarSection';

export default function DrawPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const data = useDrawData(tournamentId);
  const actions = useDrawActions(data);

  if (data.cLoading) {
    return <DrawLoadingSection />;
  }

  return (
    <>
      <DrawHeaderSection />
      <DrawCategoryTabsSection data={data} />
      <DrawStatsSection data={data} />
      <DrawPendingWarningSection data={data} />
      <DrawToolbarSection data={data} actions={actions} />

      <div className="mt-6 space-y-6">
        <DrawMainSection data={data} />
      </div>

      <DrawResetDialogSection data={data} actions={actions} />
    </>
  );
}
