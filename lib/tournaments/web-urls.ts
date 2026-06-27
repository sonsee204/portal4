/**
 * Ao Trình (NALee Sports)
 * @copyright 2025-2026 Lê Trung Hiếu
 */

export type WebTournamentManageSection =
  | 'registrations'
  | 'draw'
  | 'schedule'
  | 'referees'
  | 'scoring';

function webBase(): string {
  return (process.env.NEXT_PUBLIC_WEB_URL ?? 'http://localhost:3003').replace(
    /\/$/,
    '',
  );
}

export function webTournamentUrl(tournamentId: string): string {
  return `${webBase()}/tournaments/${tournamentId}`;
}

export function webTournamentManageUrl(
  tournamentId: string,
  section: WebTournamentManageSection,
  matchId?: string,
): string {
  switch (section) {
    case 'registrations':
      return `${webBase()}/tournaments/${tournamentId}/manage/registrations`;
    case 'draw':
      return `${webBase()}/tournaments/${tournamentId}/draw`;
    case 'schedule':
      return `${webBase()}/tournaments/${tournamentId}/manage/schedule`;
    case 'referees':
      return `${webBase()}/tournaments/${tournamentId}/manage/referees`;
    case 'scoring':
      return `${webBase()}/tournaments/${tournamentId}/scoring/${matchId ?? ''}`;
    default:
      return webTournamentUrl(tournamentId);
  }
}
