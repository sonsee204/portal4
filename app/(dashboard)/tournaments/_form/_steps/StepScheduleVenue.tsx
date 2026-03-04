'use client';

import { useCallback } from 'react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { SchedulePhaseRow } from '../_parts/SchedulePhaseRow';
import type { TournamentFormData } from '@/types/tournament-form';

const formatOptions = [
  { label: 'Loại trực tiếp (Single Elimination)', value: 'single_elim' },
  { label: 'Vòng tròn (Round Robin)', value: 'round_robin' },
  { label: 'Thụy Sĩ (Swiss)', value: 'swiss' },
];

const facilityPresets = [
  { icon: 'car-outline', label: 'Bãi đỗ xe' },
  { icon: 'wifi-outline', label: 'Wi-Fi' },
  { icon: 'water-outline', label: 'Nước uống' },
  { icon: 'medkit-outline', label: 'Y tế' },
  { icon: 'videocam-outline', label: 'Camera' },
  { icon: 'megaphone-outline', label: 'Âm thanh' },
  { icon: 'restaurant-outline', label: 'Canteen' },
  { icon: 'flash-outline', label: 'Chiếu sáng' },
];

const courtStatusOptions = [
  { label: 'Sẵn sàng', value: 'available' },
  { label: 'Bảo trì', value: 'maintenance' },
  { label: 'Đặt trước', value: 'reserved' },
];

interface StepScheduleVenueProps {
  form: UseFormReturn<TournamentFormData>;
}

export function StepScheduleVenue({ form }: StepScheduleVenueProps) {
  const { control, watch } = form;

  const {
    fields: scheduleFields,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({ control, name: 'schedule' });

  const {
    fields: facilityFields,
    append: appendFacility,
    remove: removeFacility,
  } = useFieldArray({ control, name: 'facilities' });

  const {
    fields: courtFields,
    append: appendCourt,
    remove: removeCourt,
  } = useFieldArray({ control, name: 'courts' });

  const facilities = watch('facilities');
  const selectedLabels = new Set(facilities.map((f) => f.label));

  const toggleFacility = useCallback(
    (preset: { icon: string; label: string }) => {
      const idx = facilities.findIndex((f) => f.label === preset.label);
      if (idx >= 0) {
        removeFacility(idx);
      } else {
        appendFacility(preset);
      }
    },
    [facilities, appendFacility, removeFacility]
  );

  return (
    <div className="space-y-6">
      {/* Format & Slots */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon
            name="git-branch-outline"
            size="sm"
            className="text-primary"
          />
          Thể thức thi đấu
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            name="format"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                {...field}
                label="Thể thức"
                options={formatOptions}
                error={!!fieldState.error}
              />
            )}
          />
          <Controller
            name="totalSlots"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                value={field.value || ''}
                onChange={(e) => field.onChange(Number(e.target.value) || 0)}
                label="Số slot tối đa"
                type="number"
                placeholder="32"
                leftIcon="people-outline"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </GlassPanel>

      {/* Schedule Phases */}
      <GlassPanel card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
            <IonIcon
              name="calendar-outline"
              size="sm"
              className="text-primary"
            />
            Lịch trình giải đấu
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft="add-outline"
            onClick={() =>
              appendSchedule({ label: '', date: '', startTime: '', endTime: '', status: 'upcoming' })
            }
          >
            Thêm giai đoạn
          </Button>
        </div>
        <div className="space-y-3">
          {scheduleFields.map((field, i) => (
            <SchedulePhaseRow
              key={field.id}
              index={i}
              control={control}
              status={watch(`schedule.${i}.status`)}
              onRemove={() => removeSchedule(i)}
              canRemove={scheduleFields.length > 1}
            />
          ))}
        </div>
      </GlassPanel>

      {/* Venue */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon name="location-outline" size="sm" className="text-primary" />
          Địa điểm thi đấu
        </h3>
        <div className="space-y-4">
          <Controller
            name="venueName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Tên nhà thi đấu / sân"
                placeholder="VD: Nhà thi đấu Đa năng Thanh Trì"
                leftIcon="business-outline"
              />
            )}
          />
          <Controller
            name="venueAddress"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Địa chỉ"
                placeholder="Địa chỉ chi tiết..."
                leftIcon="navigate-outline"
              />
            )}
          />
        </div>
      </GlassPanel>

      {/* Facilities */}
      <GlassPanel card>
        <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
          <IonIcon
            name="construct-outline"
            size="sm"
            className="text-primary"
          />
          Tiện ích
        </h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {facilityPresets.map((preset) => {
            const selected = selectedLabels.has(preset.label);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => toggleFacility(preset)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  selected
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-surface-border bg-surface text-muted hover:border-primary/20 hover:text-heading'
                }`}
              >
                <IonIcon
                  name={preset.icon}
                  size="sm"
                  className={selected ? 'text-primary' : 'text-faint'}
                />
                <span className="truncate">{preset.label}</span>
                {selected && (
                  <IonIcon
                    name="checkmark-circle"
                    size="xs"
                    className="text-primary ml-auto shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
        {/* Hidden field array — keeps form state in sync */}
        {facilityFields.map((field, i) => (
          <input
            key={field.id}
            type="hidden"
            {...{ name: `facilities.${i}.label` }}
            defaultValue={facilities[i]?.label}
          />
        ))}
      </GlassPanel>

      {/* Courts */}
      <GlassPanel card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
            <IonIcon name="grid-outline" size="sm" className="text-primary" />
            Sân thi đấu
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            iconLeft="add-outline"
            onClick={() =>
              appendCourt({
                name: `Sân ${courtFields.length + 1}`,
                status: 'available',
              })
            }
          >
            Thêm sân
          </Button>
        </div>
        <div className="space-y-3">
          {courtFields.map((field, i) => (
            <div key={field.id} className="group flex items-end gap-3">
              <div className="flex-1">
                <Controller
                  name={`courts.${i}.name`}
                  control={control}
                  render={({ field: f }) => (
                    <Input
                      {...f}
                      label={i === 0 ? 'Tên sân' : undefined}
                      placeholder="VD: Sân 1"
                    />
                  )}
                />
              </div>
              <div className="w-36">
                <Controller
                  name={`courts.${i}.status`}
                  control={control}
                  render={({ field: f }) => (
                    <Select
                      {...f}
                      label={i === 0 ? 'Trạng thái' : undefined}
                      options={courtStatusOptions}
                    />
                  )}
                />
              </div>
              {courtFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCourt(i)}
                  className="text-faint hover:bg-danger/10 hover:text-danger mb-1 shrink-0 rounded-lg p-1.5 opacity-0 transition-all group-hover:opacity-100"
                >
                  <IonIcon name="close-outline" size="sm" />
                </button>
              )}
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
