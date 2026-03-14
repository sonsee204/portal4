'use client';

import { useState, useCallback } from 'react';
import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { IonIcon } from '@/components/atoms/IonIcon';
import { CategoryFormCard } from '../_parts/CategoryFormCard';
import {
  useTournamentCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/tournament';
import { mapCategoryEntryToInput } from '../_utils/mapFormToInput';
import type { TournamentFormData } from '@/types/tournament-form';
import type {
  TournamentCategory,
  UpdateCategoryInput,
} from '@/graphql/generated';
import { MatchType, TournamentFormat } from '@/graphql/generated';

interface StepCategoriesProps {
  form: UseFormReturn<TournamentFormData>;
  tournamentId?: string;
}

const MATCH_LABEL: Record<MatchType, string> = {
  [MatchType.Singles]: 'Đơn',
  [MatchType.Doubles]: 'Đôi',
  [MatchType.Team]: 'Đội',
};

const FORMAT_LABEL: Record<TournamentFormat, string> = {
  [TournamentFormat.SingleElimination]: 'Loại trực tiếp',
  [TournamentFormat.DoubleElimination]: 'Loại kép',
  [TournamentFormat.RoundRobin]: 'Vòng tròn',
  [TournamentFormat.GroupKnockout]: 'Bảng + Loại trực tiếp',
};

const MATCH_TYPE_OPTIONS = [
  { label: 'Đơn', value: MatchType.Singles },
  { label: 'Đôi', value: MatchType.Doubles },
  { label: 'Đội', value: MatchType.Team },
];

const ICON_OPTIONS = [
  { label: 'Người', value: 'person-outline' },
  { label: 'Nhóm', value: 'people-outline' },
  { label: 'Trường học', value: 'school-outline' },
  { label: 'Thể lực', value: 'fitness-outline' },
  { label: 'Ngôi sao', value: 'star-outline' },
  { label: 'Cúp', value: 'trophy-outline' },
];

/* ------------------------------------------------------------------ */
/* Edit mode: direct API CRUD                                          */
/* ------------------------------------------------------------------ */

interface PrizeDraft {
  rank: string;
  title: string;
  amount: string;
  perks: string[];
}

interface EditState {
  title: string;
  ageLabel: string;
  matchType: MatchType;
  icon: string;
  description: string;
  popular: boolean;
  maxRegistrations: number;
  bracketSize: number;
  sharedThirdPlace: boolean;
  prizes: PrizeDraft[];
}

function CategoryApiCard({
  category,
  tournamentId,
  onDelete,
  deleting,
}: {
  category: TournamentCategory;
  tournamentId: string;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditState>(() => ({
    title: category.title,
    ageLabel: category.ageLabel ?? '',
    matchType: category.matchType,
    icon: category.icon ?? 'trophy-outline',
    description: category.description ?? '',
    popular: category.popular ?? false,
    maxRegistrations: category.maxRegistrations ?? 0,
    bracketSize: category.bracketSize ?? 0,
    sharedThirdPlace: (category as { sharedThirdPlace?: boolean }).sharedThirdPlace ?? false,
    prizes: (category.prizes ?? []).length > 0
      ? (category.prizes ?? []).map((p) => ({
          rank: p.rank ?? 'gold',
          title: p.title ?? '',
          amount: p.amount ?? '',
          perks: p.perks?.length ? p.perks : [''],
        }))
      : [
          { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
          { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
          { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
        ],
  }));

  const { updateCategory, loading: updating } = useUpdateCategory(tournamentId);

  const handleOpen = useCallback(() => {
    setDraft({
      title: category.title,
      ageLabel: category.ageLabel ?? '',
      matchType: category.matchType,
      icon: category.icon ?? 'trophy-outline',
      description: category.description ?? '',
      popular: category.popular ?? false,
      maxRegistrations: category.maxRegistrations ?? 0,
      bracketSize: category.bracketSize ?? 0,
      sharedThirdPlace: (category as { sharedThirdPlace?: boolean }).sharedThirdPlace ?? false,
      prizes: (category.prizes ?? []).length > 0
        ? (category.prizes ?? []).map((p) => ({
            rank: p.rank ?? 'gold',
            title: p.title ?? '',
            amount: p.amount ?? '',
            perks: p.perks?.length ? p.perks : [''],
          }))
        : [
            { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
            { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
            { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
          ],
    });
    setEditing(true);
  }, [category]);

  const handleSave = useCallback(async () => {
    if (!draft.title.trim()) return;
    const input: UpdateCategoryInput = {
      id: category._id,
      title: draft.title,
      ageLabel: draft.ageLabel || undefined,
      matchType: draft.matchType,
      icon: draft.icon || undefined,
      description: draft.description || undefined,
      popular: draft.popular,
      maxRegistrations: draft.maxRegistrations,
      bracketSize: draft.bracketSize > 0 ? draft.bracketSize : undefined,
      sharedThirdPlace: draft.sharedThirdPlace,
      prizes: draft.prizes
        .filter((p) => p.title)
        .map((p, i) => ({
          rank: p.rank || (i < 3 ? ['gold', 'silver', 'bronze'][i] : String(i + 1)),
          title: p.title,
          amount: p.amount || undefined,
          perks: p.perks.filter(Boolean).length > 0 ? p.perks.filter(Boolean) : undefined,
        })),
    };
    await updateCategory(input);
    setEditing(false);
  }, [category._id, draft, updateCategory]);

  const handleCancel = useCallback(() => setEditing(false), []);

  const update = (partial: Partial<EditState>) =>
    setDraft((prev) => ({ ...prev, ...partial }));

  if (editing) {
    return (
      <div className="border-primary/30 bg-surface space-y-4 rounded-xl border p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-heading text-sm font-semibold">
            Chỉnh sửa nội dung
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
            >
              Huỷ
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={updating || !draft.title.trim()}
              iconLeft="checkmark-outline"
              onClick={handleSave}
            >
              Lưu
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tên nội dung"
            placeholder="VD: Đơn Nam U11"
            leftIcon="trophy-outline"
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
          />
          <Input
            label="Nhóm tuổi"
            placeholder="VD: U11, 12-13"
            leftIcon="calendar-outline"
            value={draft.ageLabel}
            onChange={(e) => update({ ageLabel: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Loại thi đấu"
            options={MATCH_TYPE_OPTIONS}
            value={draft.matchType}
            onChange={(e) => update({ matchType: e.target.value as MatchType })}
          />
          <Select
            label="Icon"
            options={ICON_OPTIONS}
            value={draft.icon}
            onChange={(e) => update({ icon: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Số VĐV tối đa"
            placeholder="0 = Không giới hạn"
            type="number"
            min={0}
            value={String(draft.maxRegistrations)}
            onChange={(e) =>
              update({ maxRegistrations: parseInt(e.target.value, 10) || 0 })
            }
          />
          <Select
            label="Kích thước nhánh đấu"
            value={String(draft.bracketSize)}
            onChange={(e) => update({ bracketSize: Number(e.target.value) })}
            options={[
              { label: 'Tự động', value: '0' },
              { label: '4', value: '4' },
              { label: '8', value: '8' },
              { label: '16', value: '16' },
              { label: '32', value: '32' },
              { label: '64', value: '64' },
              { label: '128', value: '128' },
            ]}
          />
          <div className="flex items-end pb-1">
            <label className="flex cursor-pointer items-center gap-2.5">
              <button
                type="button"
                role="switch"
                aria-checked={draft.popular}
                onClick={() => update({ popular: !draft.popular })}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  draft.popular ? 'bg-primary' : 'bg-surface-border'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    draft.popular ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-heading text-sm">
                Nổi bật trên trang giới thiệu
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-end pb-1">
          <label className="flex cursor-pointer items-center gap-2.5">
            <button
              type="button"
              role="switch"
              aria-checked={draft.sharedThirdPlace}
              onClick={() => update({ sharedThirdPlace: !draft.sharedThirdPlace })}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                draft.sharedThirdPlace ? 'bg-primary' : 'bg-surface-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                  draft.sharedThirdPlace ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-heading text-sm">
              Đồng giải ba (không đánh trận tranh hạng 3-4)
            </span>
          </label>
        </div>

        <Textarea
          label="Mô tả"
          placeholder="Mô tả ngắn về nội dung thi đấu..."
          rows={2}
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
        />

        <div className="border-surface-border mt-4 rounded-lg border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-heading flex items-center gap-2 text-xs font-semibold">
              <IonIcon name="medal-outline" size="sm" className="text-primary" />
              Giải thưởng
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              iconLeft="add-outline"
              onClick={() =>
                update({
                  prizes: [
                    ...draft.prizes,
                    {
                      rank: String(draft.prizes.length + 1),
                      title: `Giải ${draft.prizes.length + 1}`,
                      amount: '',
                      perks: [''],
                    },
                  ],
                })
              }
            >
              Thêm giải
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {draft.prizes.map((prize, pi) => (
              <div
                key={pi}
                className="border-surface-border rounded-lg border p-3"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-heading text-sm font-medium">
                      {prize.rank === 'gold'
                        ? 'Giải Nhất'
                        : prize.rank === 'silver'
                          ? 'Giải Nhì'
                          : prize.rank === 'bronze'
                            ? 'Giải Ba'
                            : `Giải ${pi + 1}`}
                    </span>
                    {draft.sharedThirdPlace && prize.rank === 'bronze' && (
                      <span
                        className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400"
                        title="Đồng giải ba - 2 VĐV"
                      >
                        ×2
                      </span>
                    )}
                  </div>
                  {draft.prizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        update({
                          prizes: draft.prizes.filter((_, i) => i !== pi),
                        })
                      }
                      className="text-faint hover:text-danger rounded p-1"
                    >
                      <IonIcon name="trash-outline" size="sm" />
                    </button>
                  )}
                </div>
                <CurrencyInput
                  label="Giá trị"
                  placeholder="VD: 600.000đ"
                  value={prize.amount}
                  onChange={(value) =>
                    update({
                      prizes: draft.prizes.map((p, i) =>
                        i === pi ? { ...p, amount: value } : p
                      ),
                    })
                  }
                />
                <div className="mt-2">
                  <label className="text-body mb-1 block text-xs font-medium">
                    Phần thưởng kèm theo
                  </label>
                  {prize.perks.map((perk, ki) => (
                    <div key={ki} className="mb-1 flex gap-1">
                      <Input
                        placeholder="VD: Huy chương Vàng"
                        value={perk}
                        onChange={(e) =>
                          update({
                            prizes: draft.prizes.map((p, i) =>
                              i === pi
                                ? {
                                    ...p,
                                    perks: p.perks.map((pk, k) =>
                                      k === ki ? e.target.value : pk
                                    ),
                                  }
                                : p
                            ),
                          })
                        }
                        className="flex-1"
                      />
                      {prize.perks.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            update({
                              prizes: draft.prizes.map((p, i) =>
                                i === pi
                                  ? {
                                      ...p,
                                      perks: p.perks.filter((_, k) => k !== ki),
                                    }
                                  : p
                              ),
                            })
                          }
                          className="text-faint hover:text-danger shrink-0 rounded p-1"
                        >
                          <IonIcon name="close-outline" size="sm" />
                        </button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-1"
                    iconLeft="add-outline"
                    onClick={() =>
                      update({
                        prizes: draft.prizes.map((p, i) =>
                          i === pi ? { ...p, perks: [...p.perks, ''] } : p
                        ),
                      })
                    }
                  >
                    Thêm phần thưởng
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
      popular: false,
      maxRegistrations: 0,
      bracketSize: 0,
      sharedThirdPlace: false,
      prizes: [
        { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
        { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
        { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
      ],
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
              popular: false,
              maxRegistrations: 0,
              bracketSize: 0,
              sharedThirdPlace: false,
              prizes: [
                { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
                { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
                { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
              ],
            })
          }
        >
          Thêm nội dung
        </Button>
      </div>

      {fields.length > 0 && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <IonIcon
            name="information-circle-outline"
            size="sm"
            className="mt-0.5 shrink-0 text-amber-500"
          />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Các nội dung bên dưới sẽ được tạo tự động sau khi bạn{' '}
            <strong>lưu nháp</strong> hoặc <strong>tạo giải đấu</strong>.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <CategoryFormCard
            key={field.id}
            index={index}
            control={control}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
            pending
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
                popular: false,
                maxRegistrations: 0,
                bracketSize: 0,
                sharedThirdPlace: false,
                prizes: [
                  { rank: 'gold', title: 'Giải Nhất', amount: '', perks: [''] },
                  { rank: 'silver', title: 'Giải Nhì', amount: '', perks: [''] },
                  { rank: 'bronze', title: 'Giải Ba', amount: '', perks: [''] },
                ],
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
