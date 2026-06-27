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

import { useCallback, useState } from 'react';

import { IonIcon } from '@/components/atoms/IonIcon';
import { useUpdateCategory } from '@/hooks/tournament';
import type { TournamentCategory } from '@/graphql/generated';
import type { SportType } from '@/types/tournament-form';

import {
  buildCategoryUpdateInput,
  categoryToEditState,
  type EditState,
} from './category-api-card.types';
import { CategoryApiCardEditForm } from './CategoryApiCardEditForm';
import { FORMAT_LABEL, MATCH_LABEL } from './step-categories.constants';

export interface CategoryApiCardProps {
  category: TournamentCategory;
  sport: SportType;
  tournamentId: string;
  onDelete: (id: string) => void;
  deleting: boolean;
}

export function CategoryApiCard({
  category,
  sport,
  tournamentId,
  onDelete,
  deleting,
}: CategoryApiCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditState>(() =>
    categoryToEditState(category)
  );

  const { updateCategory, loading: updating } = useUpdateCategory(tournamentId);

  const handleOpen = useCallback(() => {
    setDraft(categoryToEditState(category));
    setEditing(true);
  }, [category]);

  const handleSave = useCallback(async () => {
    if (!draft.title.trim()) return;
    await updateCategory(buildCategoryUpdateInput(draft, category._id));
    setEditing(false);
  }, [category._id, draft, updateCategory]);

  const handleCancel = useCallback(() => setEditing(false), []);

  const handleUpdate = useCallback(
    (partial: Partial<EditState>) =>
      setDraft((prev) => ({ ...prev, ...partial })),
    []
  );

  if (editing) {
    return (
      <CategoryApiCardEditForm
        sport={sport}
        draft={draft}
        updating={updating}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="border-surface-border bg-surface relative flex items-start gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm">
      <div className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
        <IonIcon name={category.icon || 'trophy-outline'} size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-heading truncate font-semibold">
            {category.title}
          </p>
          {category.popular && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
              <IonIcon name="star" size="xs" />
              Nổi bật
            </span>
          )}
        </div>
        <div className="text-muted mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
          {category.ageLabel && <span>{category.ageLabel}</span>}
          <span>{MATCH_LABEL[category.matchType] ?? category.matchType}</span>
          <span>{FORMAT_LABEL[category.format] ?? category.format}</span>
          {(category.maxRegistrations ?? 0) > 0 && (
            <span>Tối đa {category.maxRegistrations}</span>
          )}
          <span className="text-faint">{category.registeredCount} VĐV</span>
        </div>
        {category.description && (
          <p className="text-muted mt-1.5 line-clamp-2 text-xs">
            {category.description}
          </p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={handleOpen}
          className="text-faint hover:bg-primary/10 hover:text-primary rounded-lg p-1.5 transition-colors"
        >
          <IonIcon name="create-outline" size="sm" />
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={() => onDelete(category._id)}
          className="text-faint hover:bg-danger/10 hover:text-danger rounded-lg p-1.5 transition-colors disabled:opacity-40"
        >
          <IonIcon name="close-outline" size="sm" />
        </button>
      </div>
    </div>
  );
}
