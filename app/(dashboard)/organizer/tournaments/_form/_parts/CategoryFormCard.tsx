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

import type { Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { TournamentFormData } from '@/types/tournament-form';
import { accentColors } from './category-form.constants';
import { CategoryBasicFieldsSection } from './CategoryBasicFieldsSection';
import { CategoryBracketSettingsSection } from './CategoryBracketSettingsSection';
import { CategoryScoringSection } from './CategoryScoringSection';
import { CategoryPrizesSection } from './CategoryPrizesSection';

interface CategoryFormCardProps {
  index: number;
  sport: TournamentFormData['sport'];
  control: Control<TournamentFormData>;
  onRemove: () => void;
  canRemove: boolean;
  /** Show a "pending creation" badge — used in create mode where categories
   *  are stored in form state and created only after the tournament is saved. */
  pending?: boolean;
}

export function CategoryFormCard({
  index,
  sport,
  control,
  onRemove,
  canRemove,
  pending = false,
}: CategoryFormCardProps) {
  const accent = accentColors[index % accentColors.length];

  return (
    <div
      className={cn(
        'relative rounded-xl border bg-gradient-to-br p-5 transition-shadow hover:shadow-md',
        accent
      )}
    >
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-muted hover:bg-danger/10 hover:text-danger absolute top-3 right-3 rounded-lg p-1 transition-colors"
        >
          <IonIcon name="close-outline" size="sm" />
        </button>
      )}

      <div className="mb-4 flex items-center gap-2">
        <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold">
          {index + 1}
        </div>
        <span className="text-heading text-sm font-semibold">
          Nội dung {index + 1}
        </span>
        {pending && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-500">
            <IonIcon name="time-outline" size="xs" />
            Chờ lưu
          </span>
        )}
      </div>

      <div className="space-y-4">
        <CategoryBasicFieldsSection index={index} control={control} />
        <CategoryBracketSettingsSection index={index} control={control} />
        <CategoryScoringSection index={index} sport={sport} control={control} />
        <CategoryPrizesSection index={index} control={control} />
      </div>
    </div>
  );
}
