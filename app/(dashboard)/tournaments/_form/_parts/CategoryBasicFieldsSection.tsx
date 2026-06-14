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

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import type { TournamentFormData } from '@/types/tournament-form';
import {
  formatOptions,
  iconOptions,
  matchTypeOptions,
} from './category-form.constants';

interface CategoryBasicFieldsSectionProps {
  index: number;
  control: Control<TournamentFormData>;
}

export function CategoryBasicFieldsSection({
  index,
  control,
}: CategoryBasicFieldsSectionProps) {
  return (
    <>
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

      <div className="grid gap-4 sm:grid-cols-3">
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
          name={`categories.${index}.format`}
          control={control}
          render={({ field }) => (
            <Select {...field} label="Thể thức" options={formatOptions} />
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
    </>
  );
}
