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

import { useManualDrawState } from '../_hooks/useManualDrawState';
import { DrawMainSection } from './DrawMainSection';
import { DrawToolbarSection } from './DrawToolbarSection';
import type { DrawPageActions } from '../_hooks/useDrawActions';
import type { DrawPageData } from '../_hooks/useDrawData';

interface DrawCategoryWorkspaceProps {
  data: DrawPageData;
  actions: DrawPageActions;
}

/** Remounts manual-draw state when category or bracket size changes (via parent key). */
export function DrawCategoryWorkspace({
  data,
  actions,
}: DrawCategoryWorkspaceProps) {
  const manual = useManualDrawState(data);

  return (
    <>
      <DrawToolbarSection data={data} actions={actions} manual={manual} />
      <div className="mt-6 space-y-6">
        <DrawMainSection data={data} manual={manual} />
      </div>
    </>
  );
}
