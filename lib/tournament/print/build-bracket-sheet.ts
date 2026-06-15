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

import { buildDoubleEliminationBracket } from './builders/double-elimination';
import { buildGroupKnockoutDocument } from './builders/group-knockout';
import { buildRoundRobinRows } from './builders/round-robin';
import { buildSingleEliminationBracket } from './builders/single-elimination';
import { dedupePrintMatchesById } from './dedupe-matches';
import { isCategoryDrawnForPrint } from './round-labels';
import type {
  PrintBracketDocument,
  PrintCategoryInput,
  PrintMatchInput,
  PrintReadiness,
  PrintTournamentInput,
} from './types';

export function buildBracketDocument(
  tournament: PrintTournamentInput,
  category: PrintCategoryInput,
  rawMatches: PrintMatchInput[],
): PrintBracketDocument | null {
  if (!isCategoryDrawnForPrint(category.status)) return null;

  const matches = dedupePrintMatchesById(
    rawMatches.filter((m) => m.categoryId === category.id),
  );

  const base = {
    categoryId: category.id,
    categoryTitle: category.title,
    format: category.format,
    isDraft: tournament.status === 'DRAFT',
  };

  switch (category.format) {
    case 'SINGLE_ELIMINATION':
      return {
        ...base,
        orientation: 'landscape',
        halves: buildSingleEliminationBracket(category, matches),
      };
    case 'DOUBLE_ELIMINATION':
      return {
        ...base,
        orientation: 'landscape',
        halves: buildDoubleEliminationBracket(category, matches),
      };
    case 'ROUND_ROBIN':
      return {
        ...base,
        orientation: 'portrait',
        roundRobinRows: buildRoundRobinRows(matches),
      };
    case 'GROUP_KNOCKOUT': {
      const { groupTables, knockoutHalves } = buildGroupKnockoutDocument(
        category,
        matches,
      );
      return {
        ...base,
        orientation: 'landscape',
        groupTables,
        knockoutHalves,
      };
    }
    default:
      return null;
  }
}

export function computePrintReadiness(
  categories: PrintCategoryInput[],
  scheduledCount: number,
  totalMatchCount: number,
): PrintReadiness {
  const undrawnCategoryIds = categories
    .filter((c) => !isCategoryDrawnForPrint(c.status))
    .map((c) => c.id);
  const drawnCategoryIds = categories
    .filter((c) => isCategoryDrawnForPrint(c.status))
    .map((c) => c.id);

  return {
    unscheduledCount: Math.max(0, totalMatchCount - scheduledCount),
    undrawnCategoryIds,
    drawnCategoryIds,
  };
}
