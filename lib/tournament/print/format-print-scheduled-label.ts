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

import type { PrintMatchInput } from './types';

function parseScheduledParts(iso: string): { time: string; date: string } | null {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return { time: `${h}:${mi}`, date: `${da}/${mo}` };
}

export function formatPrintScheduledLabel(
  m: Pick<PrintMatchInput, 'scheduledAt' | 'courtName'>,
): string | undefined {
  if (!m.scheduledAt) return undefined;

  const parts = parseScheduledParts(m.scheduledAt);
  if (!parts) return undefined;

  const court = m.courtName?.trim();
  const base = `${parts.time} · ${parts.date}`;
  return court ? `${base} · ${court}` : base;
}

const FINISHED_STATUSES = new Set(['FINISHED', 'WALKOVER', 'COMPLETED']);

export function formatPrintScoreLabel(
  m: Pick<PrintMatchInput, 'status' | 'scoreSummary'>,
): string | undefined {
  if (!FINISHED_STATUSES.has(m.status)) return undefined;

  const sets = m.scoreSummary?.sets?.filter(
    (s): s is { player1?: number | null; player2?: number | null } => Boolean(s),
  );
  if (sets && sets.length > 0) {
    return sets
      .map((s) => `${s.player1 ?? 0}-${s.player2 ?? 0}`)
      .join(', ');
  }

  const finalScore = m.scoreSummary?.finalScore;
  if (finalScore && finalScore.length >= 2) {
    return `${finalScore[0]}-${finalScore[1]}`;
  }
  return undefined;
}

export function resolvePrintWinnerSide(
  m: Pick<PrintMatchInput, 'status' | 'winner'>,
): 1 | 2 | undefined {
  if (!FINISHED_STATUSES.has(m.status)) return undefined;
  if (m.winner === 1) return 1;
  if (m.winner === 2) return 2;
  return undefined;
}
