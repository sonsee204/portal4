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
