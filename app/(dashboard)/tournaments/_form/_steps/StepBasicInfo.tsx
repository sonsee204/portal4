'use client';

import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { SportRadioCard } from '../../create/_components/SportRadioCard';
import { CoverImageUploader } from '../_parts/CoverImageUploader';
import type { TournamentFormData } from '@/types/tournament-form';

interface StepBasicInfoProps {
  form: UseFormReturn<TournamentFormData>;
  tournamentId?: string;
}

export function StepBasicInfo({ form, tournamentId }: StepBasicInfoProps) {
  const { control, watch } = form;
  const startDate = watch('startDate');

  const {
    fields: highlightFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: 'highlights' as never,
  });

  return (
    <div className="space-y-6">
      {/* Tournament Name */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon name="trophy-outline" size="sm" className="text-primary" />
          Thông tin cơ bản
        </h3>
        <div className="space-y-4">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Tên giải đấu"
                placeholder="VD: Giải Cầu lông Mùa Đông 2026"
                leftIcon="trophy-outline"
                error={fieldState.error?.message}
              />
            )}
          />

          <div>
            <label className="text-body mb-2 block text-sm font-medium">
              Môn thể thao
            </label>
            <Controller
              name="sport"
              control={control}
              render={({ field }) => (
                <SportRadioCard
                  selected={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </GlassPanel>

      {/* Cover Image */}
      <GlassPanel card>
        <Controller
          name="coverImageUrl"
          control={control}
          render={({ field }) => (
            <CoverImageUploader
              value={field.value}
              onChange={field.onChange}
              tournamentId={tournamentId}
            />
          )}
        />
      </GlassPanel>

      {/* Dates & Location */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon name="calendar-outline" size="sm" className="text-primary" />
          Thời gian & Địa điểm
        </h3>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Controller
              name="startDate"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Ngày bắt đầu"
                  type="date"
                  leftIcon="calendar-outline"
                  error={fieldState.error?.message}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Ngày kết thúc"
                  type="date"
                  leftIcon="calendar-outline"
                  min={startDate || undefined}
                  error={fieldState.error?.message}
                />
              )}
            />
          </div>
          <Controller
            name="locationName"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Tên địa điểm"
                placeholder="VD: Nhà thi đấu Đa năng Thanh Trì"
                leftIcon="location-outline"
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="locationAddress"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Địa chỉ"
                placeholder="VD: Xã Nhị Khê, Huyện Thường Tín, TP. Hà Nội"
                leftIcon="navigate-outline"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </GlassPanel>

      {/* Description */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon
            name="document-text-outline"
            size="sm"
            className="text-primary"
          />
          Mô tả
        </h3>
        <div className="space-y-4">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                label="Mô tả giải đấu"
                placeholder="Thông tin thêm về giải đấu..."
                rows={4}
              />
            )}
          />

          <div>
            <label className="text-body mb-2 block text-sm font-medium">
              Điểm nổi bật
            </label>
            <div className="space-y-2">
              {highlightFields.map((field, i) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Controller
                    name={`highlights.${i}`}
                    control={control}
                    render={({ field: f }) => (
                      <Input
                        {...f}
                        placeholder="VD: Hệ thống quản lý tự động..."
                        leftIcon="star-outline"
                        className="flex-1"
                      />
                    )}
                  />
                  {highlightFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      className="text-faint hover:bg-danger/10 hover:text-danger shrink-0 rounded-lg p-1.5"
                    >
                      <IonIcon name="close-outline" size="sm" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2"
              iconLeft="add-outline"
              onClick={() => append('' as never)}
            >
              Thêm điểm nổi bật
            </Button>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
