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
import type { ManualKnockoutDrawPreview } from '@/graphql/generated';
import { previewToBracketCategoryData } from '@/lib/tournament/draw/preview-to-bracket-tree';
import type { DrawSlot } from '@/lib/tournament/draw/types';
import { BracketTree } from '../bracket-tree/BracketTree';

interface ManualDrawBracketPreviewProps {
  preview: ManualKnockoutDrawPreview;
  slots: DrawSlot[];
  categoryId: string;
  categoryTitle: string;
  ageLabel: string;
}

export function ManualDrawBracketPreview({
  preview,
  slots,
  categoryId,
  categoryTitle,
  ageLabel,
}: ManualDrawBracketPreviewProps) {
  const data = useMemo(
    () =>
      previewToBracketCategoryData(preview, slots, {
        categoryId,
        categoryTitle,
        ageLabel,
      }),
    [preview, slots, categoryId, categoryTitle, ageLabel]
  );

  if (data.rounds.length === 0) {
    return (
      <p className="text-muted py-8 text-center text-sm">
        Xếp cặp vào nhánh để xem preview cây đấu.
      </p>
    );
  }

  return (
    <div className="min-h-[320px]">
      <BracketTree data={data} />
    </div>
  );
}
