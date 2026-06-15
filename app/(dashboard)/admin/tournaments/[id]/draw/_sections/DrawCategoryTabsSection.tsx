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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { categoryStatusLabel } from '../_hooks/draw-page.derived';
import type { DrawPageData } from '../_hooks/useDrawData';

export function DrawLoadingSection() {
  return (
    <GlassPanel card>
      <div className="flex items-center justify-center py-20">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
      </div>
    </GlassPanel>
  );
}

interface DrawCategoryTabsSectionProps {
  data: DrawPageData;
}

export function DrawCategoryTabsSection({ data }: DrawCategoryTabsSectionProps) {
  const {
    categories,
    activeCategoryId,
    setSelectedCategoryId,
    statusBadge,
  } = data;

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const badge = categoryStatusLabel(cat.status as string);
          return (
            <button
              key={cat._id}
              onClick={() => setSelectedCategoryId(cat._id)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategoryId === cat._id
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-secondary hover:text-primary'
              }`}
            >
              {cat.title}
              {badge && activeCategoryId !== cat._id && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${badge.className}`}
                >
                  {badge.text}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {statusBadge && (
        <div className="mt-3">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusBadge.className}`}
          >
            {statusBadge.text}
          </span>
        </div>
      )}
    </>
  );
}
