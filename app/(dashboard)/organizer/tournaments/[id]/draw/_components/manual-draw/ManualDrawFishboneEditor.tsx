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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { getR1Pairs } from '@/lib/tournament/draw/bracket-topology';
import { syncAllPairByes } from '@/lib/tournament/draw/manual-draw.derived';
import { slotsToR1Matches } from '@/lib/tournament/draw/r1-match-draft';
import type { DrawSlot } from '@/lib/tournament/draw/types';
import { ManualDrawLeafSlot } from './ManualDrawLeafSlot';

interface ManualDrawFishboneEditorProps {
  slots: DrawSlot[];
  visiblePairCount: number;
  onToggleBye: (slotIndex: number) => void;
  onClearSlot: (slotIndex: number) => void;
}

export function ManualDrawFishboneEditor({
  slots,
  visiblePairCount,
  onToggleBye,
  onClearSlot,
}: ManualDrawFishboneEditorProps) {
  const displaySlots = syncAllPairByes(slots, visiblePairCount);
  const r1Drafts = slotsToR1Matches(displaySlots, visiblePairCount);
  const pairMeta = getR1Pairs(slots.length);
  const compact = visiblePairCount >= 12;

  return (
    <GlassPanel card className="min-w-0 flex-1 overflow-hidden p-4">
      <h3 className="text-heading sticky top-0 z-10 mb-4 bg-[inherit] pb-2 text-sm font-semibold backdrop-blur-sm">
        Sơ đồ xương cá — Vòng 1
        <span className="text-muted ml-2 text-xs font-normal">
          ({visiblePairCount} cặp / {slots.length} slot)
        </span>
      </h3>
      <div className="max-h-[min(70vh,720px)] overflow-y-auto pr-1">
        <div className="w-full max-w-[420px] space-y-3">
          {r1Drafts.map((draft) => {
            const meta = pairMeta[draft.matchIndex - 1];

            return (
              <div
                key={draft.matchIndex}
                data-match-index={draft.matchIndex}
                className="space-y-1 rounded-lg p-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted text-[10px] font-medium">
                    Trận V1 #{draft.matchIndex}
                  </span>
                  {meta && (
                    <span className="text-faint text-[10px]">
                      {meta.slotRangeLabel}
                    </span>
                  )}
                  {meta && (
                    <span className="text-faint text-[10px]">
                      → V2 #{meta.r2MatchIndex + 1}
                    </span>
                  )}
                </div>
                <ManualDrawLeafSlot
                  slot={
                    displaySlots[draft.slotIndex1] ?? {
                      slotIndex: draft.slotIndex1,
                    }
                  }
                  label="Cặp A"
                  compact={compact}
                  onToggleBye={() => onToggleBye(draft.slotIndex1)}
                  onClear={() => onClearSlot(draft.slotIndex1)}
                />
                <div className="text-muted py-0.5 text-center text-[10px]">
                  VS
                </div>
                <ManualDrawLeafSlot
                  slot={
                    displaySlots[draft.slotIndex2] ?? {
                      slotIndex: draft.slotIndex2,
                    }
                  }
                  label="Cặp B"
                  compact={compact}
                  onToggleBye={() => onToggleBye(draft.slotIndex2)}
                  onClear={() => onClearSlot(draft.slotIndex2)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </GlassPanel>
  );
}
