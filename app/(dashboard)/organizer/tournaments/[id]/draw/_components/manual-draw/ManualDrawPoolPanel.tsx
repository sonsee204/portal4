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
import { cn } from '@/lib/utils';
import { badgeVariants } from '@/config/theme';
import type { DrawPlayer } from '@/lib/tournament/draw/types';
import {
  MANUAL_DRAW_POOL_ID,
  manualDrawPoolPlayerId,
} from '@/lib/tournament/draw/manual-draw-dnd-ids';

function PoolPlayerChip({ player }: { player: DrawPlayer }) {
  const { ref, isDragging } = useDraggable({
    id: manualDrawPoolPlayerId(player.id),
    data: { type: 'pool-player', playerId: player.id },
  });

  return (
    <div
      ref={ref}
      className={cn(
        'bg-surface border-surface-border cursor-grab rounded-lg border px-3 py-2 text-sm active:cursor-grabbing',
        isDragging && 'opacity-40'
      )}
    >
      <div className="text-heading truncate font-medium">{player.name}</div>
      {player.club && (
        <div className="text-muted truncate text-xs">{player.club}</div>
      )}
    </div>
  );
}

interface ManualDrawPoolPanelProps {
  unassigned: DrawPlayer[];
  loading?: boolean;
}

export function ManualDrawPoolPanel({
  unassigned,
  loading,
}: ManualDrawPoolPanelProps) {
  const { ref, isDropTarget } = useDroppable({
    id: MANUAL_DRAW_POOL_ID,
    data: { type: 'pool' },
  });

  return (
    <div
      ref={ref}
      className={cn(
        'sticky top-4 w-full shrink-0 lg:w-80',
        isDropTarget && 'ring-primary/40 rounded-xl ring-2'
      )}
    >
      <h3 className="text-heading mb-2 text-sm font-semibold">Cặp chưa xếp</h3>
      <div className="border-surface-border bg-surface-elevated/50 max-h-[480px] space-y-2 overflow-y-auto rounded-xl border border-dashed p-3">
        {loading ? (
          <p className="text-muted text-xs">Đang tải...</p>
        ) : unassigned.length === 0 ? (
          <p className="text-muted text-xs">Đã xếp hết cặp vào nhánh.</p>
        ) : (
          unassigned.map((player) => (
            <PoolPlayerChip key={player.id} player={player} />
          ))
        )}
      </div>
      <p className="text-muted mt-2 text-[11px]">
        Kéo cặp vào hàng lá bên phải hoặc kéo về đây để gỡ. Chỉ cần kéo một cặp
        vào trận — ô đối diện trống tự thành BYE (walkover).
      </p>
      <span className={cn(badgeVariants.warning, 'mt-2 inline-flex')}>BYE</span>
      <span className="text-muted ml-2 text-[11px]">
        = tự động hoặc nhấn ⚡ trên hàng lá
      </span>
    </div>
  );
}
