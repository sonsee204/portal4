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

import { cn } from '@/lib/utils';
import type {
  PrintBracketDocument,
  PrintCategoryInput,
  PrintTournamentInput,
} from '@/lib/tournament/print/types';
import { useCategoryBracketDoc } from '../../_hooks/useCategoryBracketDoc';
import { PrintDocumentShell } from '../PrintPreviewFrame';
import { BracketRoundRobinSheet } from './BracketRoundRobinSheet';
import { PrintBracketHalfSheet } from './PrintBracketHalfSheet';

interface BracketDocumentProps {
  doc: PrintBracketDocument;
  tournamentTitle: string;
}

export function BracketDocument({
  doc,
  tournamentTitle,
}: BracketDocumentProps) {
  const hasGroupTables = (doc.groupTables?.length ?? 0) > 0;
  const hasKnockoutHalves = (doc.knockoutHalves?.length ?? 0) > 0;

  return (
    <PrintDocumentShell isDraft={doc.isDraft} orientation={doc.orientation}>
      <header className="print-bracket-header mb-4 text-center">
        <h1 className="text-base font-bold uppercase">{tournamentTitle}</h1>
        <p className="mt-1 text-sm font-semibold uppercase">
          {doc.categoryTitle}
        </p>
        <p className="text-xs uppercase">Sơ đồ thi đấu</p>
      </header>

      {doc.roundRobinRows ? (
        <BracketRoundRobinSheet
          title={doc.categoryTitle}
          rows={doc.roundRobinRows}
        />
      ) : null}

      {doc.groupTables?.map((g, i) => (
        <div
          key={g.groupId}
          className={cn('mb-6', i > 0 && 'print-page-break-before')}
        >
          <BracketRoundRobinSheet title={g.groupLabel} rows={g.rows} />
        </div>
      ))}

      {hasKnockoutHalves && hasGroupTables ? (
        <div className="print-page-break-before mb-2">
          {doc.knockoutHalves!.map((half, i) => (
            <div
              key={`ko-${half.title}-${i}`}
              className={cn(
                i < doc.knockoutHalves!.length - 1 ? 'mb-6' : 'mb-2',
                i > 0 && 'print-page-break-before'
              )}
            >
              <PrintBracketHalfSheet half={half} />
            </div>
          ))}
        </div>
      ) : (
        doc.knockoutHalves?.map((half, i) => (
          <div
            key={`ko-${half.title}-${i}`}
            className={cn(
              i > 0 && 'print-page-break-before',
              i < (doc.knockoutHalves?.length ?? 0) - 1 ? 'mb-6' : 'mb-2'
            )}
          >
            <PrintBracketHalfSheet half={half} />
          </div>
        ))
      )}

      {doc.halves?.map((half, i) => (
        <div
          key={`${half.title}-${i}`}
          className={cn(
            i > 0 && 'print-page-break-before',
            i < (doc.halves?.length ?? 0) - 1 ? 'mb-6' : 'mb-2'
          )}
        >
          <PrintBracketHalfSheet
            half={half}
            showTitle={doc.halves!.length > 1}
          />
        </div>
      ))}
    </PrintDocumentShell>
  );
}

/**
 * Loads one category's FULL bracket (via the dedicated `tournamentBracket`
 * query) and renders it. Each section owns its own data fetch so that "print
 * all" never depends on the paginated tournament-wide match connection.
 */
function CategoryBracketSection({
  tournament,
  category,
  tournamentTitle,
  pageBreak,
}: {
  tournament: PrintTournamentInput;
  category: PrintCategoryInput;
  tournamentTitle: string;
  pageBreak: boolean;
}) {
  const { doc } = useCategoryBracketDoc(tournament, category);
  if (!doc) return null;
  return (
    <div className={pageBreak ? 'print-page-break-before' : undefined}>
      <BracketDocument doc={doc} tournamentTitle={tournamentTitle} />
    </div>
  );
}

/** Renders every drawn category's bracket with page breaks between them. */
export function AllBracketsDocument({
  tournament,
  categories,
  tournamentTitle,
}: {
  tournament: PrintTournamentInput;
  categories: PrintCategoryInput[];
  tournamentTitle: string;
}) {
  return (
    <div>
      {categories.map((category, i) => (
        <CategoryBracketSection
          key={category.id}
          tournament={tournament}
          category={category}
          tournamentTitle={tournamentTitle}
          pageBreak={i > 0}
        />
      ))}
    </div>
  );
}
