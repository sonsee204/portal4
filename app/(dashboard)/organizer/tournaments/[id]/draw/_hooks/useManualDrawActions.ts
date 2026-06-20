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
import {
  autoFillRemainingByes,
  clearAllSlots,
} from '@/lib/tournament/draw/manual-draw.derived';
import {
  clearSlot,
  placePlayerOnSlot,
  toggleSlotBye,
} from '@/lib/tournament/draw/r1-match-draft';
import type { DrawPlayer } from '@/lib/tournament/draw/types';
import type { ManualDrawState } from './useManualDrawState';
import type { DrawPageData } from './useDrawData';

export function useManualDrawActions(
  data: DrawPageData,
  manual: ManualDrawState,
) {
  const { activeCategoryId } = data;
  const {
    setSlots,
    effectiveBracketSize,
    unassigned,
    canSubmit,
    generateManualDraw,
    knockoutInput,
    flushPreview,
  } = manual;

  const placePlayer = useCallback(
    (slotIndex: number, player: DrawPlayer) => {
      setSlots((prev) => placePlayerOnSlot(prev, slotIndex, player));
    },
    [setSlots],
  );

  const removeFromSlot = useCallback(
    (slotIndex: number) => {
      setSlots((prev) => clearSlot(prev, slotIndex));
    },
    [setSlots],
  );

  const toggleBye = useCallback(
    (slotIndex: number) => {
      setSlots((prev) => toggleSlotBye(prev, slotIndex));
    },
    [setSlots],
  );

  const handleAutoFillByes = useCallback(() => {
    setSlots((prev) =>
      autoFillRemainingByes(prev, effectiveBracketSize, unassigned),
    );
  }, [effectiveBracketSize, setSlots, unassigned]);

  const handleClearAll = useCallback(() => {
    setSlots(clearAllSlots(effectiveBracketSize));
  }, [effectiveBracketSize, setSlots]);

  const handleSave = useCallback(async () => {
    if (!activeCategoryId || !canSubmit || !knockoutInput) return;
    await flushPreview(knockoutInput);
    void generateManualDraw(
      activeCategoryId,
      knockoutInput.knockoutSlots,
    );
  }, [
    activeCategoryId,
    canSubmit,
    flushPreview,
    generateManualDraw,
    knockoutInput,
  ]);

  return {
    placePlayer,
    removeFromSlot,
    toggleBye,
    handleAutoFillByes,
    handleClearAll,
    handleSave,
  };
}

export type ManualDrawActions = ReturnType<typeof useManualDrawActions>;
