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

import { DragOverlay, useDragOperation } from '@dnd-kit/react';
import { cn } from '@/lib/utils';
import type { ScheduleMatch, ScheduleCourt } from '@/types/tournament-schedule';
import { getCategoryScheduleAccent } from '@/lib/tournament/category-schedule-accent';
import { SCHEDULE_MATCH_SLOT_SURFACE } from '@/lib/tournament/category-schedule-accent';
import {
  parseScheduleMatchId,
  parseUnscheduledMatchId,
} from '@/lib/tournament/schedule-dnd-ids';
import type { ScheduleDropPreview } from './schedule-dnd-types';

interface ScheduleDragOverlayProps {
  matches: ScheduleMatch[];
  courts: ScheduleCourt[];
  preview: ScheduleDropPreview | null;
}

export function ScheduleDragOverlay({
  matches,
  courts,
  preview,
}: ScheduleDragOverlayProps) {
  const { source } = useDragOperation();
  if (!source) return null;

  const activeId = String(source.id);
  const matchId =
    parseScheduleMatchId(activeId) ?? parseUnscheduledMatchId(activeId);
  const match = matchId ? matches.find((m) => m.id === matchId) : null;
  if (!match) return null;

  const accent = getCategoryScheduleAccent(match.categoryId);
  const courtName = preview
    ? courts.find((c) => c.id === preview.courtId)?.name
    : undefined;

  return (
    <DragOverlay dropAnimation={null}>
      <div
        className={cn(
          'border-primary/40 bg-surface cursor-grabbing rounded-xl border-l-4 px-3 py-2 shadow-xl',
          SCHEDULE_MATCH_SLOT_SURFACE,
          accent.border,
        )}
        style={{ opacity: 0.95, maxWidth: 220 }}
      >
        <p className="text-heading text-xs font-bold">#{match.matchNumber}</p>
        <p className="text-muted truncate text-[10px]">{match.categoryTitle}</p>
        {preview ? (
          <p className="text-primary mt-1 text-[10px] font-semibold">
            {preview.time}
            {courtName ? ` · ${courtName}` : ''}
          </p>
        ) : null}
      </div>
    </DragOverlay>
  );
}
