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

import type { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import {
  scheduleMatchId,
  unscheduledMatchId,
} from '@/lib/tournament/schedule-dnd-ids';
import type { ScheduleDragSource } from './schedule-dnd-types';

interface ScheduleDraggableMatchWrapperProps {
  matchId: string;
  source: ScheduleDragSource;
  disabled?: boolean;
  showDragHandle?: boolean;
  children: ReactNode;
}

export function ScheduleDraggableMatchWrapper({
  matchId,
  source,
  disabled = false,
  showDragHandle = false,
  children,
}: ScheduleDraggableMatchWrapperProps) {
  const id =
    source === 'grid' ? scheduleMatchId(matchId) : unscheduledMatchId(matchId);

  const { ref, handleRef, isDragging } = useDraggable({
    id,
    data: { matchId, source },
    disabled,
  });

  return (
    <div
      ref={showDragHandle ? undefined : ref}
      className={cn('relative h-full w-full', isDragging && 'opacity-40')}
      data-schedule-drag-id={id}
    >
      {showDragHandle && !disabled ? (
        <button
          type="button"
          ref={handleRef}
          className="text-muted hover:text-primary absolute top-1 left-0.5 z-20 flex h-5 w-5 cursor-grab items-center justify-center rounded active:cursor-grabbing"
          aria-label="Kéo để đổi lịch"
          onClick={(e) => e.stopPropagation()}
        >
          <IonIcon name="reorder-two-outline" size="xs" />
        </button>
      ) : null}
      {showDragHandle ? (
        <div ref={ref} className="h-full w-full">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
