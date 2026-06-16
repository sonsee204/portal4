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

import { useCallback, useRef } from 'react';
import { useDragDropMonitor } from '@dnd-kit/react';
import {
  parseCourtDropId,
  parseScheduleMatchId,
  parseUnscheduledMatchId,
  UNSCHEDULED_POOL_DROP_ID,
} from '@/lib/tournament/schedule-dnd-ids';
import { resolveTimelineDrop } from '@/lib/tournament/resolve-timeline-drop';
import {
  validateScheduleDrop,
  canUnscheduleViaDrop,
} from '@/lib/tournament/validate-schedule-drop';
import type { ScheduleDropPreview } from '../schedule-dnd-types';
import { syncPointerFromDragEvent } from './sync-pointer-from-drag-event';
import type { ScheduleDndMonitorProps } from './types';
import { useScheduleDndAutoScroll } from './useScheduleDndAutoScroll';

export function ScheduleDndMonitor({
  enabled,
  matches,
  courts,
  selectedDate,
  gridMetrics,
  minRestMinutes,
  courtBufferMinutes,
  columnRefs,
  onPreviewChange,
  onScheduleDrop,
  onUnscheduleDrop,
}: ScheduleDndMonitorProps) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const draggingMatchIdRef = useRef<string | null>(null);
  const lastDropPreviewRef = useRef<ScheduleDropPreview | null>(null);

  useScheduleDndAutoScroll(enabled, draggingMatchIdRef, pointerRef);

  const resolveTimeOnCourt = useCallback(
    (courtId: string, clientY: number) => {
      const columnEl = columnRefs.current.get(courtId);
      if (!columnEl) return null;

      return resolveTimelineDrop({
        clientY,
        columnRect: columnEl.getBoundingClientRect(),
        dayStart: gridMetrics.dayStart,
        dayEnd: gridMetrics.dayEnd,
        pxPerMinute: gridMetrics.pxPerMinute,
      });
    },
    [columnRefs, gridMetrics],
  );

  const resolvePreview = useCallback(
    (targetId: string | undefined): ScheduleDropPreview | null => {
      const matchId = draggingMatchIdRef.current;
      if (!matchId || !targetId) return null;

      const courtId = parseCourtDropId(targetId);
      if (!courtId) return null;

      const match = matches.find((m) => m.id === matchId);
      if (!match) return null;

      const resolved = resolveTimeOnCourt(courtId, pointerRef.current.y);
      if (!resolved) return null;

      const { time, snappedMinutes } = resolved;

      const validation = validateScheduleDrop({
        match,
        courtId,
        time,
        selectedDate,
        allMatches: matches,
        courts,
        minRestMinutes,
        courtBufferMinutes,
      });

      const preview = {
        courtId,
        time,
        snappedMinutes,
        severity: validation.severity,
        messages: validation.messages,
      };
      lastDropPreviewRef.current = preview;
      return preview;
    },
    [
      matches,
      courts,
      selectedDate,
      minRestMinutes,
      courtBufferMinutes,
      resolveTimeOnCourt,
    ],
  );

  useDragDropMonitor({
    onDragStart: (event) => {
      if (!enabled) return;
      lastDropPreviewRef.current = null;
      syncPointerFromDragEvent(pointerRef, event);
      const sourceId = String(event.operation.source?.id ?? '');
      draggingMatchIdRef.current =
        parseScheduleMatchId(sourceId) ?? parseUnscheduledMatchId(sourceId);
    },
    onDragMove: (event) => {
      if (!enabled) return;
      syncPointerFromDragEvent(pointerRef, event);
      const targetId = event.operation.target
        ? String(event.operation.target.id)
        : undefined;
      onPreviewChange(resolvePreview(targetId));
    },
    onDragOver: (event) => {
      if (!enabled) return;
      syncPointerFromDragEvent(pointerRef, event);
      const targetId = event.operation.target
        ? String(event.operation.target.id)
        : undefined;
      onPreviewChange(resolvePreview(targetId));
    },
    onDragEnd: async (event) => {
      const savedPreview = lastDropPreviewRef.current;
      syncPointerFromDragEvent(pointerRef, event);
      onPreviewChange(null);
      lastDropPreviewRef.current = null;
      draggingMatchIdRef.current = null;
      if (!enabled || event.canceled) return;

      const { source, target } = event.operation;
      if (!source) return;

      const sourceId = String(source.id);
      const targetId = target ? String(target.id) : undefined;
      const matchId =
        parseScheduleMatchId(sourceId) ?? parseUnscheduledMatchId(sourceId);
      if (!matchId) return;

      const match = matches.find((m) => m.id === matchId);
      if (!match) return;

      if (targetId === UNSCHEDULED_POOL_DROP_ID) {
        if (!canUnscheduleViaDrop(match)) return;
        await onUnscheduleDrop?.(matchId);
        return;
      }

      let courtId = targetId ? parseCourtDropId(targetId) : null;
      if (!courtId && savedPreview) {
        courtId = savedPreview.courtId;
      }
      if (!courtId) return;

      let time: string;
      if (savedPreview && savedPreview.courtId === courtId) {
        time = savedPreview.time;
      } else {
        const resolved = resolveTimeOnCourt(courtId, pointerRef.current.y);
        if (!resolved) return;
        time = resolved.time;
      }

      const validation = validateScheduleDrop({
        match,
        courtId,
        time,
        selectedDate,
        allMatches: matches,
        courts,
        minRestMinutes,
        courtBufferMinutes,
      });

      if (!validation.canDrop) return;

      const sourceType = parseUnscheduledMatchId(sourceId)
        ? 'unscheduled'
        : 'grid';

      if (
        sourceType === 'grid' &&
        match.courtId === courtId &&
        match.startTime === time
      ) {
        return;
      }

      await onScheduleDrop({
        matchId,
        courtId,
        time,
        source: sourceType,
      });
    },
  });

  return null;
}
