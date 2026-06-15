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

export type PrintTournamentFormat =
  | 'SINGLE_ELIMINATION'
  | 'DOUBLE_ELIMINATION'
  | 'ROUND_ROBIN'
  | 'GROUP_KNOCKOUT';

export interface PrintPlayerInput {
  name?: string | null;
  club?: string | null;
  seed?: number | null;
  registrationId?: string | null;
  members?: Array<{ name?: string | null; club?: string | null } | null> | null;
}

export interface PrintScoreSummary {
  finalScore?: number[] | null;
  sets?: Array<{ player1?: number | null; player2?: number | null } | null> | null;
}

export interface PrintMatchInput {
  id: string;
  matchNumber: number;
  categoryId: string;
  round: number;
  roundLabel: string;
  bracketPosition?: number | null;
  groupId?: string | null;
  status: string;
  isBye: boolean;
  scheduledAt?: string | null;
  courtName?: string | null;
  player1?: PrintPlayerInput | null;
  player2?: PrintPlayerInput | null;
  player1SlotLabel?: string | null;
  player2SlotLabel?: string | null;
  winner?: number | null;
  scoreSummary?: PrintScoreSummary | null;
  nextMatchId?: string | null;
  losersNextMatchId?: string | null;
}

export interface PrintCategoryInput {
  id: string;
  title: string;
  format: PrintTournamentFormat;
  ageLabel?: string | null;
  displayOrder?: number | null;
  bracketSize?: number | null;
  status?: string | null;
}

export interface PrintTournamentInput {
  id: string;
  title: string;
  status?: string | null;
  locationName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  courtCount: number;
}

export interface PrintScheduleMatchInput {
  id: string;
  matchNumber: number;
  categoryId: string;
  categoryTitle: string;
  round: number;
  roundLabel: string;
  scheduledDate?: string;
  startTime?: string;
  displayOrder?: number;
}

export interface PrintMasterScheduleRow {
  kind: 'match' | 'break';
  timeLabel?: string;
  categoryTitle?: string;
  roundLabel?: string;
  matchFrom?: number;
  matchTo?: number;
  matchCount?: number;
  breakLabel?: string;
}

export interface PrintMasterScheduleSection {
  dateLabel: string;
  dateKey: string;
  rows: PrintMasterScheduleRow[];
  dayTotal: number;
}

export interface PrintMasterScheduleDoc {
  header: {
    title: string;
    locationName?: string;
    dateRangeLabel: string;
    timeRangeLabel?: string;
    courtCountLabel: string;
    isDraft: boolean;
  };
  sections: PrintMasterScheduleSection[];
  grandTotal: number;
  unscheduledCount: number;
}

export interface PrintBracketEntryRow {
  index: number;
  club?: string;
  athleteLabel: string;
  isBye?: boolean;
}

export interface PrintBracketRoundColumn {
  label: string;
  shortLabel: string;
  matches: Array<{
    /** Undefined for skeleton placeholder boxes (match not created/played yet). */
    matchNumber?: number;
    matchId: string;
    rowIndexFrom: number;
    rowIndexTo: number;
    player1Label?: string;
    player2Label?: string;
    scheduledLabel?: string;
    scoreLabel?: string;
    /** 1 or 2 when the match is finished and a winner is recorded. */
    winnerSide?: 1 | 2;
    /** True when this box is a structural placeholder with no real match data. */
    isPlaceholder?: boolean;
  }>;
}

export interface PrintBracketHalf {
  title: string;
  entries: PrintBracketEntryRow[];
  rounds: PrintBracketRoundColumn[];
}

export interface PrintRoundRobinRow {
  matchNumber: number;
  roundLabel: string;
  player1: string;
  player2: string;
  scheduledLabel?: string;
}

export interface PrintGroupTable {
  groupId: string;
  groupLabel: string;
  rows: PrintRoundRobinRow[];
}

export interface PrintBracketDocument {
  categoryId: string;
  categoryTitle: string;
  format: PrintTournamentFormat;
  orientation: 'landscape' | 'portrait';
  isDraft: boolean;
  /** Single / double elim */
  halves?: PrintBracketHalf[];
  /** Round robin */
  roundRobinRows?: PrintRoundRobinRow[];
  /** Group knockout */
  groupTables?: PrintGroupTable[];
  knockoutHalves?: PrintBracketHalf[];
}

export interface PrintReadiness {
  unscheduledCount: number;
  undrawnCategoryIds: string[];
  drawnCategoryIds: string[];
}
