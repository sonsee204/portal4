'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import { DragDropProvider, useDragDropMonitor } from '@dnd-kit/react';
import type { ScheduleMatch, ScheduleCourt } from '@/types/tournament-schedule';
import {
  parseCourtDropId,
  parseScheduleMatchId,
  parseUnscheduledMatchId,
  UNSCHEDULED_POOL_DROP_ID,
} from '@/lib/tournament/schedule-dnd-ids';
import { resolveTimelineDrop } from '@/lib/tournament/resolve-timeline-drop';
import { timeToMinutes } from '@/lib/tournament/schedule-time';
import {
  validateScheduleDrop,
  canUnscheduleViaDrop,
} from '@/lib/tournament/validate-schedule-drop';
import { ScheduleDragOverlay } from './ScheduleDragOverlay';
import { ScheduleDropConflictHint } from './ScheduleDropConflictHint';
import type {
  ScheduleDndGridMetrics,
  ScheduleDropPayload,
  ScheduleDropPreview,
} from './schedule-dnd-types';

interface ScheduleDndContextValue {
  enabled: boolean;
  registerCourtColumn: (courtId: string, el: HTMLElement | null) => void;
  preview: ScheduleDropPreview | null;
}

const ScheduleDndCtx = createContext<ScheduleDndContextValue>({
  enabled: false,
  registerCourtColumn: () => {},
  preview: null,
});

export function useScheduleDnd() {
  return useContext(ScheduleDndCtx);
}

interface ScheduleDndProviderProps {
  enabled: boolean;
  matches: ScheduleMatch[];
  courts: ScheduleCourt[];
  selectedDate: string;
  gridMetrics: ScheduleDndGridMetrics;
  minRestMinutes?: number;
  courtBufferMinutes?: number;
  onScheduleDrop: (payload: ScheduleDropPayload) => void | Promise<void>;
  onUnscheduleDrop?: (matchId: string) => void | Promise<void>;
  children: ReactNode;
}

type DragPointerEvent = {
  nativeEvent?: Event;
  operation: { position: { current: { x: number; y: number } } };
};

function syncPointerFromDragEvent(
  pointerRef: MutableRefObject<{ x: number; y: number }>,
  event: DragPointerEvent
) {
  const native = event.nativeEvent;
  if (
    native &&
    'clientX' in native &&
    'clientY' in native &&
    typeof native.clientX === 'number' &&
    typeof native.clientY === 'number'
  ) {
    pointerRef.current = { x: native.clientX, y: native.clientY };
    return;
  }

  const { x, y } = event.operation.position.current;
  if (Number.isFinite(x) && Number.isFinite(y)) {
    pointerRef.current = { x, y };
  }
}

function ScheduleDndMonitor({
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
}: Omit<ScheduleDndProviderProps, 'children'> & {
  columnRefs: MutableRefObject<Map<string, HTMLElement>>;
  onPreviewChange: (preview: ScheduleDropPreview | null) => void;
}) {
  const pointerRef = useRef({ x: 0, y: 0 });
  const draggingMatchIdRef = useRef<string | null>(null);
  const lastDropPreviewRef = useRef<ScheduleDropPreview | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };

      // Auto-scroll only while dragging — not on normal mouse movement
      if (!draggingMatchIdRef.current) return;

      const scrollers = document.querySelectorAll<HTMLElement>(
        '[data-schedule-timeline-scroll]'
      );
      for (const el of scrollers) {
        const rect = el.getBoundingClientRect();
        const edge = 48;
        if (e.clientY < rect.top + edge) {
          el.scrollTop -= 12;
        } else if (e.clientY > rect.bottom - edge) {
          el.scrollTop += 12;
        }
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [enabled]);

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
    [columnRefs, gridMetrics]
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
    ]
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

export function ScheduleDndProvider({
  enabled,
  matches,
  courts,
  selectedDate,
  gridMetrics,
  minRestMinutes = 0,
  courtBufferMinutes = 5,
  onScheduleDrop,
  onUnscheduleDrop,
  children,
}: ScheduleDndProviderProps) {
  const columnRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [preview, setPreview] = useState<ScheduleDropPreview | null>(null);

  const registerCourtColumn = useCallback(
    (courtId: string, el: HTMLElement | null) => {
      if (el) columnRefs.current.set(courtId, el);
      else columnRefs.current.delete(courtId);
    },
    []
  );

  const ctxValue = useMemo(
    () => ({ enabled, registerCourtColumn, preview }),
    [enabled, registerCourtColumn, preview]
  );

  if (!enabled) {
    return (
      <ScheduleDndCtx.Provider value={ctxValue}>
        {children}
      </ScheduleDndCtx.Provider>
    );
  }

  return (
    <DragDropProvider>
      <ScheduleDndCtx.Provider value={ctxValue}>
        <ScheduleDndMonitor
          enabled={enabled}
          matches={matches}
          courts={courts}
          selectedDate={selectedDate}
          gridMetrics={gridMetrics}
          minRestMinutes={minRestMinutes}
          courtBufferMinutes={courtBufferMinutes}
          columnRefs={columnRefs}
          onPreviewChange={setPreview}
          onScheduleDrop={onScheduleDrop}
          onUnscheduleDrop={onUnscheduleDrop}
        />
        {children}
        <ScheduleDragOverlay
          matches={matches}
          courts={courts}
          preview={preview}
        />
        {preview && preview.messages.length > 0 ? (
          <ScheduleDropConflictHint
            severity={preview.severity}
            messages={preview.messages}
          />
        ) : null}
      </ScheduleDndCtx.Provider>
    </DragDropProvider>
  );
}

export function previewTopPx(
  preview: ScheduleDropPreview,
  dayStart: number,
  pxPerMinute: number
): number {
  return (preview.snappedMinutes - dayStart) * pxPerMinute;
}

export { timeToMinutes };
