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

import { Controller, useWatch, type Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { TournamentFormat } from '@/graphql/generated';
import type { TournamentFormData } from '@/types/tournament-form';
import { bracketSizeOptions } from './category-form.constants';

interface CategoryBracketSettingsSectionProps {
  index: number;
  control: Control<TournamentFormData>;
}

export function CategoryBracketSettingsSection({
  index,
  control,
}: CategoryBracketSettingsSectionProps) {
  const selectedFormat =
    useWatch({ control, name: `categories.${index}.format` }) ??
    TournamentFormat.SingleElimination;
  const isRoundRobin = selectedFormat === TournamentFormat.RoundRobin;
  const isGroupKnockout = selectedFormat === TournamentFormat.GroupKnockout;
  const groupCount =
    useWatch({ control, name: `categories.${index}.groupCount` }) ?? 4;
  const advancingPerGroup =
    useWatch({ control, name: `categories.${index}.advancingPerGroup` }) ?? 2;

  return (
    <>
      <div
        className={cn(
          'grid gap-4',
          isRoundRobin || isGroupKnockout
            ? 'sm:grid-cols-2'
            : 'sm:grid-cols-3'
        )}
      >
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
        {!isRoundRobin && !isGroupKnockout && (
          <Controller
            name={`categories.${index}.bracketSize`}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={String(field.value ?? 0)}
                onChange={(e) => field.onChange(Number(e.target.value))}
                label="Kích thước nhánh đấu"
                options={bracketSizeOptions}
              />
            )}
          />
        )}
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

      {isGroupKnockout && (
        <div className="space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name={`categories.${index}.groupCount`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Số bảng"
                  placeholder="VD: 4"
                  type="number"
                  min={2}
                  value={field.value === undefined ? '' : String(field.value)}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value, 10) || 4)
                  }
                />
              )}
            />
            <Controller
              name={`categories.${index}.advancingPerGroup`}
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="VĐV đi tiếp / bảng"
                  placeholder="VD: 2"
                  type="number"
                  min={1}
                  value={field.value === undefined ? '' : String(field.value)}
                  onChange={(e) =>
                    field.onChange(parseInt(e.target.value, 10) || 2)
                  }
                />
              )}
            />
          </div>
          <p className="text-muted text-xs">
            {groupCount} bảng × {advancingPerGroup} VĐV đi tiếp ={' '}
            <strong className="text-heading">
              {groupCount * advancingPerGroup} VĐV
            </strong>{' '}
            vào vòng loại trực tiếp
          </p>
        </div>
      )}

      {isRoundRobin && (
        <p className="text-muted text-xs">
          Tổng số trận vòng tròn tính theo công thức N×(N−1)/2
        </p>
      )}

      {selectedFormat === TournamentFormat.SingleElimination && (
        <div className="flex items-end pb-1">
          <Controller
            name={`categories.${index}.sharedThirdPlace`}
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
                  Đồng giải ba (không đánh trận tranh hạng 3-4)
                </span>
              </label>
            )}
          />
        </div>
      )}

      <Controller
        name={`categories.${index}.defaultMatchDurationMinutes`}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            label="Thời lượng dự kiến mỗi trận (phút)"
            placeholder="30"
            type="number"
            min={5}
            step={5}
            value={field.value === undefined ? '' : String(field.value)}
            onChange={(e) =>
              field.onChange(parseInt(e.target.value, 10) || 30)
            }
          />
        )}
      />

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
    </>
  );
}
