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

import Link from 'next/link';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { mapMatchesToBracketTree } from '@/lib/tournament/draw/mappers';
import { BracketTree } from '../_components/bracket-tree/BracketTree';
import type { DrawPageData } from '../_hooks/useDrawData';

interface DrawBracketTreeSectionProps {
  data: DrawPageData;
}

export function DrawBracketTreeSection({ data }: DrawBracketTreeSectionProps) {
  const { matches, activeCategory, tournamentId } = data;
  if (!activeCategory || matches.length === 0) return null;

  const treeData = mapMatchesToBracketTree(matches, activeCategory);

  return (
    <GlassPanel card>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-heading text-lg font-semibold">Nhánh đấu</h2>
          <p className="text-secondary text-sm">
            {activeCategory.title}
            {activeCategory.ageLabel ? ` · ${activeCategory.ageLabel}` : ''}
          </p>
        </div>
        <Link
          href={`/organizer/tournaments/${tournamentId}/print`}
          className="text-primary hover:text-primary/80 text-sm font-medium"
        >
          In nhánh đấu
        </Link>
      </div>
      <BracketTree data={treeData} />
    </GlassPanel>
  );
}
