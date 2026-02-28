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
import type { TournamentCategory } from '@/graphql/generated';
import { MatchType, TournamentFormat } from '@/graphql/generated';

interface StepCategoriesProps {
  form: UseFormReturn<TournamentFormData>;
  tournamentId?: string;
}

/* ------------------------------------------------------------------ */
/* Edit mode: direct API CRUD                                          */
/* ------------------------------------------------------------------ */

function CategoryApiCard({
  category,
  onDelete,
  deleting,
}: {
  category: TournamentCategory;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const matchLabel: Record<MatchType, string> = {
    [MatchType.Singles]: 'Đơn',
    [MatchType.Doubles]: 'Đôi',
    [MatchType.Team]: 'Đội',
  };
  const formatLabel: Record<TournamentFormat, string> = {
    [TournamentFormat.SingleElimination]: 'Loại trực tiếp',
    [TournamentFormat.DoubleElimination]: 'Loại kép',
    [TournamentFormat.RoundRobin]: 'Vòng tròn',
    [TournamentFormat.GroupKnockout]: 'Bảng + Loại trực tiếp',
  };

  return (
    <div className="border-surface-border bg-surface relative flex items-start gap-4 rounded-xl border p-4 transition-shadow hover:shadow-sm">
      <div className="bg-primary/15 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
        <IonIcon name="trophy-outline" size="sm" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-heading truncate font-semibold">{category.title}</p>
        <div className="text-muted mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
          {category.ageLabel && <span>{category.ageLabel}</span>}
          <span>{matchLabel[category.matchType] ?? category.matchType}</span>
          <span>{formatLabel[category.format] ?? category.format}</span>
          <span className="text-faint">{category.registeredCount} VĐV</span>
        </div>
      </div>
      <button
        type="button"
        disabled={deleting}
        onClick={() => onDelete(category._id)}
        className="text-faint hover:bg-danger/10 hover:text-danger shrink-0 rounded-lg p-1.5 transition-colors disabled:opacity-40"
      >
        <IonIcon name="close-outline" size="sm" />
      </button>
    </div>
  );
}

function StepCategoriesEditMode({
  tournamentId,
  sport,
  form,
}: {
  tournamentId: string;
  sport: TournamentFormData['sport'];
  form: UseFormReturn<TournamentFormData>;
}) {
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

  // Staged entry for the inline "add" form
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'categories',
  });
  const [saving, setSaving] = useState(false);

  const handleAddStaged = useCallback(() => {
    append({
      title: '',
      ageLabel: '',
      matchType: 'single',
      icon: 'person-outline',
      description: '',
    });
  }, [append]);

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

      {/* Existing saved categories */}
      <div className="space-y-3">
        {categories.map((cat) => (
          <CategoryApiCard
            key={cat._id}
            category={cat}
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

      {/* Staged (unsaved) entries */}
      {fields.length > 0 && (
        <div className="space-y-3">
          <p className="text-muted text-xs font-medium">
            Nội dung chưa lưu — nhấn &quot;Lưu&quot; để xác nhận:
          </p>
          {fields.map((field, i) => (
            <div key={field.id} className="space-y-2">
              <CategoryFormCard
                index={i}
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

/* ------------------------------------------------------------------ */
/* Create mode: form state only (saved after tournament creation)      */
/* ------------------------------------------------------------------ */

function StepCategoriesCreateMode({
  form,
}: {
  form: UseFormReturn<TournamentFormData>;
}) {
  const { control, formState } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });
  const error = formState.errors.categories?.message;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
            <IonIcon name="list-outline" size="sm" className="text-primary" />
            Nội dung thi đấu
          </h3>
          <p className="text-muted mt-1 text-xs">
            Thiết lập các nội dung thi đấu. Sẽ được tạo tự động sau khi lưu
            giải.
          </p>
          {error && <p className="text-danger mt-1 text-xs">{error}</p>}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          iconLeft="add-outline"
          onClick={() =>
            append({
              title: '',
              ageLabel: '',
              matchType: 'single',
              icon: 'person-outline',
              description: '',
            })
          }
        >
          Thêm nội dung
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <CategoryFormCard
            key={field.id}
            index={index}
            control={control}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </div>

      {fields.length === 0 && (
        <div className="border-surface-border flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center">
          <div className="bg-overlay-faint text-faint mb-3 flex h-12 w-12 items-center justify-center rounded-2xl">
            <IonIcon name="add-circle-outline" size="lg" />
          </div>
          <p className="text-muted text-sm">Chưa có nội dung thi đấu nào</p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-3"
            iconLeft="add-outline"
            onClick={() =>
              append({
                title: '',
                ageLabel: '',
                matchType: 'single',
                icon: 'person-outline',
                description: '',
              })
            }
          >
            Thêm nội dung đầu tiên
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Entry point                                                         */
/* ------------------------------------------------------------------ */

export function StepCategories({ form, tournamentId }: StepCategoriesProps) {
  const sport = form.watch('sport');

  if (tournamentId) {
    return (
      <StepCategoriesEditMode
        tournamentId={tournamentId}
        sport={sport}
        form={form}
      />
    );
  }
  return <StepCategoriesCreateMode form={form} />;
}
