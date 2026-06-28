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

import { useState, useCallback } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { CategoryFormCard } from '../_parts/CategoryFormCard';
import {
  useTournamentCategories,
  useCreateCategory,
  useDeleteCategory,
} from '@/hooks/tournament';
import { mapCategoryEntryToInput } from '../_utils/mapFormToInput';
import type { TournamentFormData } from '@/types/tournament-form';
import { CategoryApiCard } from './CategoryApiCard';
import { createDefaultCategoryEntry } from './step-categories.constants';

interface StepCategoriesEditModeProps {
  tournamentId: string;
  sport: TournamentFormData['sport'];
  form: UseFormReturn<TournamentFormData>;
}

export function StepCategoriesEditMode({
  tournamentId,
  sport,
  form,
}: StepCategoriesEditModeProps) {
  const { categories, loading, refetch } =
    useTournamentCategories(tournamentId);
  const { createCategory, loading: creating } = useCreateCategory(
    tournamentId,
    {
      onSuccess: () => refetch(),
    }
  );
  const { deleteCategory, loading: deleting } = useDeleteCategory(
    tournamentId,
    {
      onSuccess: () => refetch(),
    }
  );

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'categories',
  });
  const [saving, setSaving] = useState(false);

  const handleAddStaged = useCallback(() => {
    append(createDefaultCategoryEntry(sport));
  }, [append, sport]);

  const handleSaveStaged = useCallback(
    async (index: number) => {
      const entry = form.getValues(`categories.${index}`);
      if (!entry.title.trim()) return;
      setSaving(true);
      try {
        await createCategory(
          mapCategoryEntryToInput(entry, tournamentId, sport)
        );
        remove(index);
        await refetch();
      } finally {
        setSaving(false);
      }
    },
    [form, createCategory, tournamentId, sport, remove, refetch]
  );

  if (loading) {
    return (
      <div className="text-muted flex items-center justify-center py-12 text-sm">
        <IonIcon name="sync-outline" size="sm" className="mr-2 animate-spin" />
        Đang tải...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
            <IonIcon name="list-outline" size="sm" className="text-primary" />
            Nội dung thi đấu
          </h3>
          <p className="text-muted mt-1 text-xs">
            Thêm hoặc xoá nội dung thi đấu. Thể thức và cấu hình tính điểm có
            thể chỉnh từ trang Bốc thăm.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconLeft="add-outline"
          onClick={handleAddStaged}
        >
          Thêm nội dung
        </Button>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <CategoryApiCard
            key={cat._id}
            category={cat}
            sport={sport}
            tournamentId={tournamentId}
            onDelete={deleteCategory}
            deleting={deleting}
          />
        ))}
        {categories.length === 0 && fields.length === 0 && (
          <div className="border-surface-border flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-10 text-center">
            <div className="bg-overlay-faint text-faint mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
              <IonIcon name="add-circle-outline" size="lg" />
            </div>
            <p className="text-muted text-sm">Chưa có nội dung thi đấu nào</p>
          </div>
        )}
      </div>

      {fields.length > 0 && (
        <div className="space-y-3">
          <p className="text-muted text-xs font-medium">
            Nội dung chưa lưu — nhấn &quot;Lưu&quot; để xác nhận:
          </p>
          {fields.map((field, i) => (
            <div key={field.id} className="space-y-2">
              <CategoryFormCard
                index={i}
                sport={sport}
                control={form.control}
                onRemove={() => remove(i)}
                canRemove
              />
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={saving || creating}
                iconLeft="checkmark-outline"
                onClick={() => handleSaveStaged(i)}
              >
                Lưu nội dung này
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
