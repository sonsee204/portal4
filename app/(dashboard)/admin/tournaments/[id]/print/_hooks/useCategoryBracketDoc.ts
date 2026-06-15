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

'use client';

import { useMemo } from 'react';
import { useTournamentBracket } from '@/hooks/tournament';
import { buildBracketDocument } from '@/lib/tournament/print';
import { mapGqlMatchToPrintInput } from '@/lib/tournament/print/adapters';
import type {
  PrintBracketDocument,
  PrintCategoryInput,
  PrintTournamentInput,
} from '@/lib/tournament/print/types';

/**
 * Build one category's bracket document from the FULL bracket query
 * (`tournamentBracket`) rather than the paginated tournament-wide match
 * connection.  The connection is sorted by round then bracketPosition, so for
 * large finished tournaments later-round pages can be dropped — leaving empty
 * semifinal/final boxes.  The full-bracket query returns every match for the
 * category in a single response, guaranteeing complete data.
 */
export function useCategoryBracketDoc(
  tournament: PrintTournamentInput | null,
  category: PrintCategoryInput | undefined,
  skip = false,
): { doc: PrintBracketDocument | null; loading: boolean } {
  const { matches, loading } = useTournamentBracket(
    category?.id ?? '',
    skip || !category,
  );

  const doc = useMemo(() => {
    if (!tournament || !category) return null;
    return buildBracketDocument(
      tournament,
      category,
      matches.map(mapGqlMatchToPrintInput),
    );
  }, [tournament, category, matches]);

  return { doc, loading };
}
