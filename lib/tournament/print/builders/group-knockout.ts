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

import { buildKnockoutHalvesFromMatches } from './single-elimination';
import { buildRoundRobinRows } from './round-robin';
import { nextPowerOf2 } from '../round-labels';
import type {
  PrintCategoryInput,
  PrintGroupTable,
  PrintMatchInput,
} from '../types';

const GROUP_ROUND_THRESHOLD = 100;

export function buildGroupKnockoutDocument(
  category: PrintCategoryInput,
  matches: PrintMatchInput[],
): {
  groupTables: PrintGroupTable[];
  knockoutHalves: ReturnType<typeof buildKnockoutHalvesFromMatches>;
} {
  const groupMatches = matches.filter((m) => m.round < GROUP_ROUND_THRESHOLD);
  const knockoutMatches = matches.filter(
    (m) => m.round >= GROUP_ROUND_THRESHOLD,
  );

  const groupIds = [
    ...new Set(
      groupMatches
        .map((m) => m.groupId)
        .filter((g): g is string => Boolean(g)),
    ),
  ].sort();

  const groupTables: PrintGroupTable[] = groupIds.map((groupId) => ({
    groupId,
    groupLabel: `Bảng ${groupId}`,
    rows: buildRoundRobinRows(
      groupMatches.filter((m) => m.groupId === groupId),
    ),
  }));

  if (groupIds.length === 0 && groupMatches.length > 0) {
    groupTables.push({
      groupId: 'all',
      groupLabel: 'Vòng bảng',
      rows: buildRoundRobinRows(groupMatches),
    });
  }

  const koSize =
    category.bracketSize ??
    nextPowerOf2(
      Math.max(2, knockoutMatches.filter((m) => m.round === 100).length * 2),
    );

  const knockoutHalves = buildKnockoutHalvesFromMatches(
    `${category.title} — Knockout`,
    knockoutMatches,
    koSize,
  );

  return { groupTables, knockoutHalves };
}
