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

import { useManualDrawActions } from '../_hooks/useManualDrawActions';
import type { ManualDrawState } from '../_hooks/useManualDrawState';
import { ManualDrawDndContext } from '../_components/manual-draw/ManualDrawDndContext';
import { ManualDrawFishboneEditor } from '../_components/manual-draw/ManualDrawFishboneEditor';
import { ManualDrawPoolPanel } from '../_components/manual-draw/ManualDrawPoolPanel';
import { ManualDrawPreviewPanel } from '../_components/manual-draw/ManualDrawPreviewPanel';
import { ManualDrawSlotMapPanel } from '../_components/manual-draw/ManualDrawSlotMapPanel';
import { ManualDrawToolbar } from '../_components/manual-draw/ManualDrawToolbar';
import type { DrawPageData } from '../_hooks/useDrawData';

interface DrawManualSectionProps {
  data: DrawPageData;
  manual: ManualDrawState;
}

export function DrawManualSection({ data, manual }: DrawManualSectionProps) {
  const actions = useManualDrawActions(data, manual);

  return (
    <div className="space-y-4">
      <ManualDrawToolbar
        onAutoFill={actions.handleAutoFillByes}
        onClearAll={actions.handleClearAll}
        onSave={() => void actions.handleSave()}
        canSubmit={manual.canSubmit}
        saving={manual.saving}
      />
      <ManualDrawDndContext
        players={manual.players}
        onPlacePlayer={actions.placePlayer}
        onRemoveFromSlot={actions.removeFromSlot}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
          <div className="flex w-full shrink-0 flex-col gap-4 lg:w-80">
            <ManualDrawPoolPanel
              unassigned={manual.unassigned}
              loading={manual.regsLoading}
            />
            <ManualDrawSlotMapPanel
              slots={manual.slots}
              bracketSize={manual.effectiveBracketSize}
            />
          </div>
          <ManualDrawFishboneEditor
            slots={manual.slots}
            visiblePairCount={manual.visiblePairCount}
            onToggleBye={actions.toggleBye}
            onClearSlot={actions.removeFromSlot}
          />
        </div>
      </ManualDrawDndContext>
      <ManualDrawPreviewPanel
        preview={manual.preview}
        previewError={manual.previewError}
        loading={manual.previewLoading}
        slots={manual.slots}
        categoryTitle={data.activeCategory?.title ?? ''}
        ageLabel={data.activeCategory?.ageLabel ?? ''}
        categoryId={data.activeCategoryId ?? ''}
      />
    </div>
  );
}
