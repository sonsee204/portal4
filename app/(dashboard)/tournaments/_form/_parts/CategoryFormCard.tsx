'use client';

import { Controller, type Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { IonIcon } from '@/components/atoms/IonIcon';
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
}

export function CategoryFormCard({
  index,
  control,
  onRemove,
  canRemove,
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
          className="absolute top-3 right-3 rounded-lg p-1 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
        >
          <IonIcon name="close-outline" size="sm" />
        </button>
      )}

      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary text-sm font-bold">
          {index + 1}
        </div>
        <span className="text-sm font-semibold text-heading">
          Nội dung {index + 1}
        </span>
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
              <Select
                {...field}
                label="Icon"
                options={iconOptions}
              />
            )}
          />
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
      </div>
    </div>
  );
}
