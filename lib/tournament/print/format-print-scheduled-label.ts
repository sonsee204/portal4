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
