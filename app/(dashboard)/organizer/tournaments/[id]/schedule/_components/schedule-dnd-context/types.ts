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

import type { MutableRefObject, ReactNode } from 'react';
import type { ScheduleCourt, ScheduleMatch } from '@/types/tournament-schedule';
import type {
  ScheduleDndGridMetrics,
  ScheduleDropPayload,
  ScheduleDropPreview,
} from '../schedule-dnd-types';

export interface ScheduleDndContextValue {
  enabled: boolean;
  registerCourtColumn: (courtId: string, el: HTMLElement | null) => void;
  preview: ScheduleDropPreview | null;
}

export interface ScheduleDndProviderProps {
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

export type DragPointerEvent = {
  nativeEvent?: Event;
  operation: { position: { current: { x: number; y: number } } };
};

export type ScheduleDndMonitorProps = Omit<ScheduleDndProviderProps, 'children'> & {
  columnRefs: MutableRefObject<Map<string, HTMLElement>>;
  onPreviewChange: (preview: ScheduleDropPreview | null) => void;
};
