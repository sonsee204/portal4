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

import { useEffect, useMemo, useState } from 'react';
import { RegistrationStatus, TournamentFormat } from '@/graphql/generated';
import { useRegistrations } from '@/hooks/tournament';
import {
  usePreviewManualKnockoutDraw,
  useGenerateManualDraw,
} from '@/hooks/tournament/useManualDraw';
import { computeEffectiveBracketSize } from './draw-page.derived';
import {
  createEmptySlots,
  mapRegistrationToDrawPlayer,
  slotsToKnockoutInput,
} from '@/lib/tournament/draw/mappers';
import {
  autoFillRemainingByes,
  canSubmitManualDraw,
  getUnassignedPlayers,
} from '@/lib/tournament/draw/manual-draw.derived';
import { previewToGhostRounds } from '@/lib/tournament/draw/preview-to-tree';
import { computeManualEditorPairCount } from '@/lib/tournament/draw/bracket-topology';
import type { DrawMode, DrawSlot } from '@/lib/tournament/draw/types';
import type { DrawPageData } from './useDrawData';

export function useManualDrawState(data: DrawPageData) {
  const {
    activeCategoryId,
    activeCategory,
    approvedCount,
    matches,
    refetch,
    refetchCategories,
  } = data;

  const effectiveBracketSize = computeEffectiveBracketSize(
    approvedCount ?? 0,
    activeCategory?.bracketSize ?? 0,
  );

  const [drawMode, setDrawMode] = useState<DrawMode>('auto');
  const [slots, setSlots] = useState<DrawSlot[]>(() =>
    createEmptySlots(effectiveBracketSize || 8),
  );

  const isSingleElimination =
    activeCategory?.format === TournamentFormat.SingleElimination;
  const canManualDraw =
    isSingleElimination &&
    matches.length === 0 &&
    (approvedCount ?? 0) >= 2;

  const { registrations, loading: regsLoading } = useRegistrations({
    tournamentId: data.tournamentId,
    filter: {
      categoryId: activeCategoryId || undefined,
      registrationStatus: RegistrationStatus.Approved,
    },
    pagination: { page: 1, limit: 500 },
    skip: !activeCategoryId || !canManualDraw,
  });

  const players = useMemo(
    () => registrations.map(mapRegistrationToDrawPlayer),
    [registrations],
  );

  const {
    preview,
    previewLoading,
    previewError,
    requestPreview,
    flushPreview,
  } = usePreviewManualKnockoutDraw();

  const knockoutInput = useMemo(
    () =>
      activeCategoryId
        ? {
          categoryId: activeCategoryId,
          knockoutSlots: slotsToKnockoutInput(slots),
        }
        : null,
    [activeCategoryId, slots],
  );

  useEffect(() => {
    if (!canManualDraw || drawMode !== 'manual' || !knockoutInput) return;
    if (knockoutInput.knockoutSlots.length === 0) return;
    requestPreview(knockoutInput);
  }, [canManualDraw, drawMode, knockoutInput, requestPreview]);

  const unassigned = useMemo(
    () => getUnassignedPlayers(players, slots),
    [players, slots],
  );

  const ghostRounds = useMemo(() => previewToGhostRounds(preview), [preview]);
  const visiblePairCount = computeManualEditorPairCount(effectiveBracketSize);

  const { generateManualDraw, loading: saving } = useGenerateManualDraw({
    onSuccess: () => {
      void refetch();
      void refetchCategories();
    },
  });

  return {
    drawMode,
    setDrawMode,
    slots,
    setSlots,
    canManualDraw,
    isSingleElimination,
    effectiveBracketSize,
    players,
    unassigned,
    regsLoading,
    preview,
    previewLoading,
    previewError,
    ghostRounds,
    visiblePairCount,
    canSubmit: canSubmitManualDraw(
      preview,
      slots,
      effectiveBracketSize,
    ),
    generateManualDraw,
    saving,
    knockoutInput,
    flushPreview,
    autoFillRemainingByes: (current: DrawSlot[]) =>
      autoFillRemainingByes(current, effectiveBracketSize, unassigned),
  };
}

export type ManualDrawState = ReturnType<typeof useManualDrawState>;
