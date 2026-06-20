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

import { useDraggable } from '@dnd-kit/react';
import { useDroppable } from '@dnd-kit/react';
import { IonIcon } from '@/components/atoms/IonIcon';
import { cn } from '@/lib/utils';
import { badgeVariants } from '@/config/theme';
import type { DrawSlot } from '@/lib/tournament/draw/types';
import { manualDrawLeafId } from '@/lib/tournament/draw/manual-draw-dnd-ids';

interface ManualDrawLeafSlotProps {
  slot: DrawSlot;
  label: string;
  compact?: boolean;
  locked?: boolean;
  onToggleBye: () => void;
  onClear: () => void;
}

export function ManualDrawLeafSlot({
  slot,
  label,
  compact,
  locked,
  onToggleBye,
  onClear,
}: ManualDrawLeafSlotProps) {
  const id = manualDrawLeafId(slot.slotIndex);
  const { ref: dropRef, isDropTarget } = useDroppable({
    id,
    data: { type: 'leaf', slotIndex: slot.slotIndex },
    disabled: locked,
  });

  const hasPlayer = !!slot.player;
  const isBye = !!slot.isBye;

  const { ref: dragRef, isDragging } = useDraggable({
    id: hasPlayer ? `${id}:player` : `${id}:empty`,
    data: {
      type: hasPlayer ? 'leaf-player' : 'leaf-empty',
      slotIndex: slot.slotIndex,
      playerId: slot.player?.id,
    },
    disabled: !hasPlayer || locked,
  });

  return (
    <div
      ref={dropRef}
      className={cn(
        'group relative flex items-center gap-2 rounded-lg border px-3 py-2',
        compact ? 'min-h-[38px]' : 'min-h-[44px]',
        locked && 'pointer-events-none opacity-60',
        isDropTarget && !locked && 'border-primary ring-primary/30 ring-2',
        !hasPlayer && !isBye && 'border-surface-border border-dashed',
        (hasPlayer || isBye) && 'border-surface-border bg-surface-elevated'
      )}
    >
      <span className="text-muted w-16 shrink-0 text-[10px]">{label}</span>
      <div
        ref={hasPlayer ? dragRef : undefined}
        className={cn('min-w-0 flex-1', isDragging && 'opacity-40')}
      >
        {isBye ? (
          <span className={badgeVariants.warning}>BYE</span>
        ) : hasPlayer ? (
          <div>
            <div className="flex items-center gap-2">
              <div className="text-heading truncate text-sm font-medium">
                {slot.player!.name}
              </div>
              {slot.player!.seed != null && (
                <span className="text-muted text-[10px]">
                  #{slot.player!.seed}
                </span>
              )}
              {slot.player!.bibNumber != null && (
                <span className="text-faint text-[10px]">
                  BIB {slot.player!.bibNumber}
                </span>
              )}
            </div>
            {slot.player!.club && (
              <div className="text-muted truncate text-xs">
                {slot.player!.club}
              </div>
            )}
          </div>
        ) : locked ? (
          <span className="text-faint text-xs italic">Nhánh trống (khóa)</span>
        ) : (
          <span className="text-faint text-xs italic">Kéo cặp vào đây</span>
        )}
      </div>
      {!locked && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            className="text-muted hover:text-primary rounded p-1"
            title="Đặt BYE"
            onClick={onToggleBye}
          >
            <IonIcon name="flash-outline" size="xs" />
          </button>
          {(hasPlayer || isBye) && (
            <button
              type="button"
              className="text-muted rounded p-1 hover:text-red-400"
              title="Xóa"
              onClick={onClear}
            >
              <IonIcon name="close-outline" size="xs" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
