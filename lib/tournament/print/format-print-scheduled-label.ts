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

export function formatPrintScheduledLabel(
  m: Pick<PrintMatchInput, 'scheduledAt' | 'courtName'>,
): string | undefined {
  if (!m.scheduledAt) return undefined;

  let timeLabel: string;
  try {
    timeLabel = new Date(m.scheduledAt).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return undefined;
  }

  const court = m.courtName?.trim();
  return court ? `${timeLabel} · ${court}` : timeLabel;
}
