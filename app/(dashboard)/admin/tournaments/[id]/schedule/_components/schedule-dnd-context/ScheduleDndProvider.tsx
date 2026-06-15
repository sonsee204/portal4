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

import { useCallback, useMemo, useRef, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { ScheduleDragOverlay } from '../ScheduleDragOverlay';
import { ScheduleDropConflictHint } from '../ScheduleDropConflictHint';
import type { ScheduleDropPreview } from '../schedule-dnd-types';
import { ScheduleDndCtx } from './context';
import { ScheduleDndMonitor } from './ScheduleDndMonitor';
import type { ScheduleDndProviderProps } from './types';

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
    [],
  );

  const ctxValue = useMemo(
    () => ({ enabled, registerCourtColumn, preview }),
    [enabled, registerCourtColumn, preview],
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
