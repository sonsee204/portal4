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

export const TOURNAMENT_BASE_PATH = '/organizer/tournaments';

export function getTournamentBasePath(): string {
  return TOURNAMENT_BASE_PATH;
}

export interface TournamentRoutePaths {
  list: string;
  create: string;
  detail: (id: string) => string;
  edit: (id: string) => string;
  registrations: (id: string) => string;
  draw: (id: string) => string;
  schedule: (id: string) => string;
  print: (id: string) => string;
  scoring: (id: string, matchId: string) => string;
}

export function tournamentRoutes(
  base: string = TOURNAMENT_BASE_PATH,
): TournamentRoutePaths {
  return {
    list: base,
    create: `${base}/create`,
    detail: (id: string) => `${base}/${id}`,
    edit: (id: string) => `${base}/${id}/edit`,
    registrations: (id: string) => `${base}/${id}/registrations`,
    draw: (id: string) => `${base}/${id}/draw`,
    schedule: (id: string) => `${base}/${id}/schedule`,
    print: (id: string) => `${base}/${id}/print`,
    scoring: (id: string, matchId: string) => `${base}/${id}/scoring/${matchId}`,
  };
}

/** @deprecated Admin tournament routes removed — always organizer workspace. */
export function detectTournamentWorkspace(_pathname: string): 'organizer' {
  return 'organizer';
}

/** @deprecated Use TOURNAMENT_BASE_PATH or tournamentRoutes() instead. */
export type TournamentWorkspace = 'organizer';
