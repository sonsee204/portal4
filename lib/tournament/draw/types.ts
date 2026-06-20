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

export type DrawMode = 'auto' | 'manual';

export interface DrawPlayer {
  id: string;
  name: string;
  club?: string;
  seed?: number;
  avatarUrl?: string;
  bibNumber?: number;
}

export interface DrawSlot {
  slotIndex: number;
  player?: DrawPlayer;
  isBye?: boolean;
}

/** UX layer: one R1 pairing (Trận V1 #k) — hides raw slot indices from BTC. */
export interface R1MatchDraft {
  matchIndex: number;
  slotIndex1: number;
  slotIndex2: number;
  player1?: DrawPlayer;
  player2?: DrawPlayer;
  isBye1?: boolean;
  isBye2?: boolean;
}

export type MatchStatus =
  | 'scheduled'
  | 'live'
  | 'finished'
  | 'walkover'
  | 'cancelled'
  | 'retirement';

export interface BracketPlayer {
  id: string;
  name: string;
  club?: string;
  seed?: number;
  avatarUrl?: string;
  bibNumber?: number;
  score?: number;
  winner?: boolean;
  isPlaceholder?: boolean;
  members?: Array<{ userId?: string; name: string; avatarUrl?: string }>;
}

export interface BracketMatch {
  id: string;
  matchNumber: number;
  status: MatchStatus;
  isBye?: boolean;
  scheduledAt?: string;
  court?: string;
  refereeName?: string;
  players: [BracketPlayer | null, BracketPlayer | null];
  sets?: Array<{ p1: number; p2: number }>;
}

export interface BracketRoundData {
  label: string;
  matches: BracketMatch[];
}

export interface BracketCategoryData {
  categoryId: string;
  categoryTitle: string;
  ageLabel: string;
  rounds: BracketRoundData[];
}

export interface GhostRoundColumn {
  label: string;
  round: number;
  matchups: Array<{ player1Name: string; player2Name: string }>;
}
