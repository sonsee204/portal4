import type { DropSeverity } from '@/lib/tournament/validate-schedule-drop';

export type ScheduleDragSource = 'grid' | 'unscheduled';

export interface ScheduleDropPreview {
  courtId: string;
  time: string;
  snappedMinutes: number;
  severity: DropSeverity;
  messages: string[];
}

export interface ScheduleDndGridMetrics {
  dayStart: number;
  dayEnd: number;
  pxPerMinute: number;
}

export interface ScheduleDropPayload {
  matchId: string;
  courtId: string;
  time: string;
  source: ScheduleDragSource;
}
