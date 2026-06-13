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

/**
 * Shared types for components that haven't fully migrated to backend-driven types.
 * Tournament types will move to types/tournament.ts when tournaments go live.
 */

/* ------------------------------------------------------------------ */
/* Tournaments                                                         */
/* ------------------------------------------------------------------ */

export type MatchStatus = 'live' | 'finished' | 'scheduled' | 'upcoming';

export interface MatchPlayer {
  name: string;
  avatar?: string;
  score?: number;
  winner?: boolean;
}

export interface BracketMatch {
  _id: string;
  matchNumber: number;
  status: MatchStatus;
  players: [MatchPlayer, MatchPlayer];
  time?: string;
}

/* ------------------------------------------------------------------ */
/* Ecosystem                                                           */
/* ------------------------------------------------------------------ */

export type SportType = 'football' | 'badminton' | 'pickleball' | 'tennis';

export interface SportModule {
  sport: SportType;
  label: string;
  activeUsers: string;
  status: 'online' | 'maintenance' | 'offline';
  enabled: boolean;
  icon: string;
}

/* ------------------------------------------------------------------ */
/* Calendar                                                            */
/* ------------------------------------------------------------------ */

export interface CalendarBooking {
  _id: string;
  venue: string;
  court: string;
  startHour: number;
  endHour: number;
  status: 'paid' | 'pending' | 'maintenance';
  userName?: string;
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export interface ApiKey {
  _id: string;
  name: string;
  clientId: string;
  secret: string;
  status: 'active' | 'test';
  createdAt: string;
}
