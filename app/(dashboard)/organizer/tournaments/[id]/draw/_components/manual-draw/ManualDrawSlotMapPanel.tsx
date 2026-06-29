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

import { useState } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { IonIcon } from '@/components/atoms/IonIcon';
import { cn } from '@/lib/utils';
import { getR1Pairs } from '@/lib/tournament/draw/bracket-topology';
import { syncAllPairByes } from '@/lib/tournament/draw/manual-draw.derived';
import type { DrawSlot } from '@/lib/tournament/draw/types';

function pairStatus(slots: DrawSlot[], pairIndex: number): string {
  const s1 = slots[pairIndex * 2];
  const s2 = slots[pairIndex * 2 + 1];
  if (s1?.isBye && s2?.isBye) return 'BYE vs BYE';
  if (s1?.player && s2?.player) return 'Đủ TvT';
  if (s1?.player || s2?.player || s1?.isBye || s2?.isBye) return 'Đủ WO';
  return 'Thiếu';
}

interface ManualDrawSlotMapPanelProps {
  slots: DrawSlot[];
  bracketSize: number;
}

export function ManualDrawSlotMapPanel({
  slots,
  bracketSize,
}: ManualDrawSlotMapPanelProps) {
  const [open, setOpen] = useState(true);
  const pairCount = bracketSize / 2;
  const displaySlots = syncAllPairByes(slots, pairCount);
  const pairs = getR1Pairs(bracketSize);

  const scrollToMatch = (matchIndex: number) => {
    document
      .querySelector(`[data-match-index="${matchIndex}"]`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <GlassPanel card className="w-full shrink-0 p-4 lg:w-80">
      <button
        type="button"
        className="text-heading flex w-full items-center justify-between text-sm font-semibold"
        onClick={() => setOpen((v) => !v)}
      >
        Bản đồ nhánh
        <IonIcon
          name={open ? 'chevron-up-outline' : 'chevron-down-outline'}
          size="xs"
        />
      </button>
      {open && (
        <div className="mt-3 max-h-64 overflow-y-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="text-muted border-surface-border border-b">
                <th className="py-1 pr-2 font-medium">V1</th>
                <th className="py-1 pr-2 font-medium">V2</th>
                <th className="py-1 font-medium">TT</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((pair) => {
                const status = pairStatus(displaySlots, pair.pairIndex);
                const isOk = status === 'Đủ TvT' || status === 'Đủ WO';
                const isBothBye = status === 'BYE vs BYE';

                return (
                  <tr
                    key={pair.pairIndex}
                    className="border-surface-border/50 hover:bg-surface-elevated/50 cursor-pointer border-b"
                    onClick={() => scrollToMatch(pair.pairIndex + 1)}
                  >
                    <td className="text-heading py-1.5 pr-2 font-medium">
                      #{pair.pairIndex + 1}
                    </td>
                    <td className="text-muted py-1.5 pr-2">
                      #{pair.r2MatchIndex + 1}
                    </td>
                    <td
                      className={cn(
                        'py-1.5',
                        isBothBye
                          ? 'text-red-400'
                          : isOk
                            ? 'text-green-500'
                            : 'text-amber-500'
                      )}
                    >
                      {status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </GlassPanel>
  );
}
