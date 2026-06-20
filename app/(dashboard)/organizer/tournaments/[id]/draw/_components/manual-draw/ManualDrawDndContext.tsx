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

import { useCallback, useRef, type ReactNode } from 'react';
import { DragDropProvider, useDragDropMonitor } from '@dnd-kit/react';
import type { DrawPlayer } from '@/lib/tournament/draw/types';
import {
  isManualDrawPoolId,
  parseManualDrawLeafId,
  parseManualDrawPoolPlayerId,
} from '@/lib/tournament/draw/manual-draw-dnd-ids';

interface ManualDrawDndContextProps {
  players: DrawPlayer[];
  onPlacePlayer: (slotIndex: number, player: DrawPlayer) => void;
  onRemoveFromSlot: (slotIndex: number) => void;
  children: ReactNode;
}

function ManualDrawDndMonitor({
  players,
  onPlacePlayer,
  onRemoveFromSlot,
}: Omit<ManualDrawDndContextProps, 'children'>) {
  const sourceSlotRef = useRef<number | null>(null);
  const sourcePlayerIdRef = useRef<string | null>(null);

  useDragDropMonitor({
    onDragStart(event) {
      const data = event.operation.source?.data as
        | { type?: string; slotIndex?: number; playerId?: string }
        | undefined;
      sourceSlotRef.current =
        data?.type === 'leaf-player' ? (data.slotIndex ?? null) : null;
      sourcePlayerIdRef.current = data?.playerId ?? null;
    },
    onDragEnd(event) {
      const targetId = event.operation.target?.id?.toString();
      if (!targetId) return;

      const playerId =
        parseManualDrawPoolPlayerId(
          event.operation.source?.id?.toString() ?? '',
        ) ?? sourcePlayerIdRef.current;

      if (!playerId) return;
      const player = players.find((p) => p.id === playerId);
      if (!player) return;

      if (isManualDrawPoolId(targetId)) {
        if (sourceSlotRef.current != null) {
          onRemoveFromSlot(sourceSlotRef.current);
        }
        return;
      }

      const slotIndex = parseManualDrawLeafId(targetId);
      if (slotIndex == null) return;

      if (sourceSlotRef.current != null && sourceSlotRef.current !== slotIndex) {
        onRemoveFromSlot(sourceSlotRef.current);
      }
      onPlacePlayer(slotIndex, player);
      sourceSlotRef.current = null;
      sourcePlayerIdRef.current = null;
    },
  });

  return null;
}

export function ManualDrawDndContext({
  players,
  onPlacePlayer,
  onRemoveFromSlot,
  children,
}: ManualDrawDndContextProps) {
  const handlePlace = useCallback(
    (slotIndex: number, player: DrawPlayer) => onPlacePlayer(slotIndex, player),
    [onPlacePlayer],
  );
  const handleRemove = useCallback(
    (slotIndex: number) => onRemoveFromSlot(slotIndex),
    [onRemoveFromSlot],
  );

  return (
    <DragDropProvider>
      <ManualDrawDndMonitor
        players={players}
        onPlacePlayer={handlePlace}
        onRemoveFromSlot={handleRemove}
      />
      {children}
    </DragDropProvider>
  );
}
