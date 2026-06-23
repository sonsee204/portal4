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

import type { GhostRoundColumn } from '@/lib/tournament/draw/types';

interface ManualDrawGhostRoundProps {
  column: GhostRoundColumn;
}

export function ManualDrawGhostRound({ column }: ManualDrawGhostRoundProps) {
  return (
    <div className="flex w-56 shrink-0 flex-col">
      <div className="text-muted mb-3 text-center text-xs font-bold tracking-wider uppercase">
        {column.label}
      </div>
      <div className="flex flex-col gap-3">
        {column.matchups.map((m, i) => (
          <div
            key={i}
            className="border-surface-border bg-surface-elevated/40 rounded-lg border border-dashed p-3 opacity-60"
          >
            <div className="text-heading truncate text-sm">{m.player1Name}</div>
            <div className="text-muted my-1 text-center text-[10px]">vs</div>
            <div className="text-heading truncate text-sm">{m.player2Name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
