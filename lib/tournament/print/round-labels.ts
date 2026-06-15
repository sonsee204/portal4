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

/** Map round depth to short column label (R64, TK, BK, …). */
export function roundShortLabel(
  roundIndex: number,
  totalRounds: number,
  roundLabel: string,
): string {
  const upper = roundLabel.toUpperCase();
  if (upper.includes('CHUNG KẾT') || upper === 'CK') return 'CK';
  if (upper.includes('BÁN KẾT') || upper === 'BK') return 'BK';
  if (upper.includes('TỨ KẾT') || upper === 'TK') return 'TK';
  if (upper.includes('R16')) return 'R16';
  if (upper.includes('R32')) return 'R32';
  if (upper.includes('R64')) return 'R64';
  if (upper.includes('R128')) return 'R128';

  const roundsFromEnd = totalRounds - roundIndex;
  if (roundsFromEnd === 1) return 'CK';
  if (roundsFromEnd === 2) return 'BK';
  if (roundsFromEnd === 3) return 'TK';

  const teamsInRound = 2 ** (totalRounds - roundIndex);
  if (teamsInRound >= 128) return 'R128';
  if (teamsInRound >= 64) return 'R64';
  if (teamsInRound >= 32) return 'R32';
  if (teamsInRound >= 16) return 'R16';
  return roundLabel.slice(0, 6);
}

/** Accept YYYY-MM-DD or ISO datetime from GraphQL. */
export function normalizePrintDateKey(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return trimmed;
  if (trimmed.includes('T')) return trimmed.slice(0, 10);
  return trimmed;
}

export function formatViDate(dateKey: string): string {
  const normalized = normalizePrintDateKey(dateKey);
  const d = new Date(`${normalized}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateKey;
  return d.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateRangeLabel(
  startDate?: string | null,
  endDate?: string | null,
): string {
  if (!startDate) return '—';
  const start = formatViDate(startDate);
  const endKey = endDate ? normalizePrintDateKey(endDate) : null;
  const startKey = normalizePrintDateKey(startDate);
  if (!endKey || endKey === startKey) return start;
  return `${start} – ${formatViDate(endDate!)}`;
}

export function formatTimeRangeFromBlocks(
  blocks: string[],
): string | undefined {
  if (blocks.length === 0) return undefined;
  const sorted = [...blocks].sort();
  return `Từ ${sorted[0]} – ${sorted[sorted.length - 1]}`;
}

export function floorTimeToHourBlock(time: string): string {
  const [h] = time.split(':').map(Number);
  return `${String(h).padStart(2, '0')}:00`;
}

export const DRAWN_CATEGORY_STATUSES = new Set([
  'DRAW_COMPLETED',
  'IN_PROGRESS',
  'COMPLETED',
]);

export function isCategoryDrawnForPrint(status?: string | null): boolean {
  return !!status && DRAWN_CATEGORY_STATUSES.has(status);
}

export function nextPowerOf2(n: number): number {
  let p = 1;
  while (p < n) p *= 2;
  return p;
}
