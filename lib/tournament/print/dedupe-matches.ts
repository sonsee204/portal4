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

export function dedupePrintMatchesById(
  matches: PrintMatchInput[],
): PrintMatchInput[] {
  if (matches.length <= 1) return matches;
  const byId = new Map<string, PrintMatchInput>();
  for (const m of matches) {
    byId.set(m.id, m);
  }
  return byId.size === matches.length ? matches : [...byId.values()];
}
