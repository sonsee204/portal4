'use client';

import { Controller, useFieldArray, useWatch, type Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PrizeEditor, getNextPrizeRank } from './PrizeEditor';
import type { TournamentFormData } from '@/types/tournament-form';

const matchTypeOptions = [
  { label: 'Đơn', value: 'single' },
  { label: 'Đôi', value: 'double' },
  { label: 'Đôi nam nữ', value: 'mixed' },
];

const iconOptions = [
  { label: 'Người', value: 'person-outline' },
  { label: 'Nhóm', value: 'people-outline' },
  { label: 'Trường học', value: 'school-outline' },
  { label: 'Thể lực', value: 'fitness-outline' },
  { label: 'Ngôi sao', value: 'star-outline' },
  { label: 'Cúp', value: 'trophy-outline' },
];

const accentColors = [
  'from-orange-400/20 to-amber-500/10 border-orange-300/30 dark:border-orange-500/20',
  'from-violet-400/20 to-purple-500/10 border-violet-300/30 dark:border-violet-500/20',
  'from-blue-400/20 to-cyan-500/10 border-blue-300/30 dark:border-blue-500/20',
  'from-emerald-400/20 to-green-500/10 border-emerald-300/30 dark:border-emerald-500/20',
  'from-pink-400/20 to-rose-500/10 border-pink-300/30 dark:border-pink-500/20',
  'from-indigo-400/20 to-blue-500/10 border-indigo-300/30 dark:border-indigo-500/20',
];

interface CategoryFormCardProps {
  index: number;
  control: Control<TournamentFormData>;
  onRemove: () => void;
  canRemove: boolean;
  /** Show a "pending creation" badge — used in create mode where categories
   *  are stored in form state and created only after the tournament is saved. */
  pending?: boolean;
}

export function CategoryFormCard({
  index,
  control,
  onRemove,
  canRemove,
  pending = false,
}: CategoryFormCardProps) {
  const accent = accentColors[index % accentColors.length];
  const basePath = `categories.${index}`;

  const {
    fields: prizeFields,
    append: appendPrize,
    remove: removePrize,
  } = useFieldArray({
    control,
    name: `${basePath}.prizes` as never,
  });

  const prizes = useWatch({ control, name: `categories.${index}.prizes` }) ?? [];

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
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name={`categories.${index}.title`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Tên nội dung"
                placeholder="VD: Đơn Nam U11"
                leftIcon="trophy-outline"
              />
            )}
          />
          <Controller
            name={`categories.${index}.ageLabel`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nhóm tuổi"
                placeholder="VD: U11, 12-13"
                leftIcon="calendar-outline"
              />
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name={`categories.${index}.matchType`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Loại thi đấu"
                options={matchTypeOptions}
              />
            )}
          />
          <Controller
            name={`categories.${index}.icon`}
            control={control}
            render={({ field }) => (
              <Select {...field} label="Icon" options={iconOptions} />
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name={`categories.${index}.maxRegistrations`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Số VĐV tối đa"
                placeholder="0 = Không giới hạn"
                type="number"
                min={0}
                value={field.value === undefined ? '' : String(field.value)}
                onChange={(e) =>
                  field.onChange(parseInt(e.target.value, 10) || 0)
                }
              />
            )}
          />
          <div className="flex items-end pb-1">
            <Controller
              name={`categories.${index}.popular`}
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-2.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={field.value}
                    onClick={() => field.onChange(!field.value)}
                    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                      field.value ? 'bg-primary' : 'bg-surface-border'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                        field.value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-heading text-sm">
                    Nổi bật trên trang giới thiệu
                  </span>
                </label>
              )}
            />
          </div>
        </div>

        <Controller
          name={`categories.${index}.description`}
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              label="Mô tả"
              placeholder="Mô tả ngắn về nội dung thi đấu..."
              rows={2}
            />
          )}
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
                appendPrize({
                  rank: getNextPrizeRank(prizes),
                  title: `Giải ${prizes.length + 1}`,
                  amount: '',
                  perks: [''],
                } as never)
              }
            >
              Thêm giải
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {prizeFields.map((field, pi) => (
              <PrizeEditor
                key={field.id}
                index={pi}
                control={control}
                rank={prizes[pi]?.rank ?? 'gold'}
                basePath={basePath}
                onRemove={() => removePrize(pi)}
                canRemove={prizeFields.length > 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
