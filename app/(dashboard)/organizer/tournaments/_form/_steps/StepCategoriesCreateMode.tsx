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

import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { CategoryFormCard } from '../_parts/CategoryFormCard';
import type { TournamentFormData } from '@/types/tournament-form';
import { createDefaultCategoryEntry } from './step-categories.constants';

interface StepCategoriesCreateModeProps {
  form: UseFormReturn<TournamentFormData>;
}

export function StepCategoriesCreateMode({
  form,
}: StepCategoriesCreateModeProps) {
  const { control, formState, watch } = form;
  const sport = watch('sport');
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
          onClick={() => append(createDefaultCategoryEntry(sport))}
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
            sport={sport}
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
            onClick={() => append(createDefaultCategoryEntry(sport))}
          >
            Thêm nội dung đầu tiên
          </Button>
        </div>
      )}
    </div>
  );
}
