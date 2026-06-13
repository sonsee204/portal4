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

export type MatchStatus =
  | 'scheduled'
  | 'live'
  | 'finished'
  | 'walkover'
  | 'cancelled'
  | 'retirement';

export interface EntryMember {
  userId?: string;
  name: string;
  avatarUrl?: string;
}

export interface SchedulePlayerInfo {
  name: string;
  isPlaceholder?: boolean;
  club?: string;
  dateOfBirth?: string;
  bibNumber?: number;
  members?: EntryMember[];
}

export interface ScheduleSetScore {
  p1: number;
  p2: number;
}

export interface ScheduleMatch {
  id: string;
  matchNumber: number;
  categoryId: string;
  categoryTitle: string;
  round: number;
  roundLabel: string;
  players: [SchedulePlayerInfo | null, SchedulePlayerInfo | null];
  playerIds: [string | null, string | null];
  sets?: ScheduleSetScore[];
  status: MatchStatus;
  courtId?: string;
  startTime?: string;
  endTime?: string;
  scheduledDate?: string;
  matchStartedAt?: string;
  durationSeconds?: number;
  estimatedDurationMinutes: number;
  refereeId?: string;
  refereeName?: string;
  winner?: 1 | 2;
  updatedAt?: string;
  needsDrawBeforeSchedule?: boolean;
}

export interface ScheduleCourt {
  id: string;
  name: string;
  status: 'available' | 'maintenance' | 'reserved';
  notes?: string;
}
