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

import { useCallback, type ReactNode } from 'react';
import { Controller, useFieldArray, type UseFormReturn } from 'react-hook-form';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { SchedulePhaseRow } from '../_parts/SchedulePhaseRow';
import type { TournamentFormData } from '@/types/tournament-form';

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
  courtsOnlyMode?: boolean;
}

function ReadOnlySection({
  children,
  courtsOnlyMode,
}: {
  children: ReactNode;
  courtsOnlyMode?: boolean;
}) {
  if (!courtsOnlyMode) return <>{children}</>;
  return (
    <div className="pointer-events-none opacity-50" aria-hidden>
      {children}
    </div>
  );
}

export function StepScheduleVenue({
  form,
  courtsOnlyMode = false,
}: StepScheduleVenueProps) {
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
      <ReadOnlySection courtsOnlyMode={courtsOnlyMode}>
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
                appendSchedule({
                  label: '',
                  date: '',
                  startTime: '',
                  endTime: '',
                  status: 'upcoming',
                })
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

        {/* Schedule Config */}
        <GlassPanel card>
          <h3 className="text-heading mb-4 flex items-center gap-2 text-sm font-bold">
            <IonIcon name="timer-outline" size="sm" className="text-primary" />
            Cấu hình xếp lịch
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Controller
              name="minRestMinutes"
              control={control}
              render={({ field: f }) => (
                <Input
                  {...f}
                  type="number"
                  label="Thời gian nghỉ tối thiểu giữa 2 trận của 1 VĐV (phút)"
                  placeholder="30"
                  min={0}
                  step={5}
                  onChange={(e) => f.onChange(Number(e.target.value))}
                />
              )}
            />
            <Controller
              name="courtBufferMinutes"
              control={control}
              render={({ field: f }) => (
                <Input
                  {...f}
                  type="number"
                  label="Thời gian chuyển sân giữa 2 trận (phút)"
                  placeholder="5"
                  min={0}
                  step={5}
                  onChange={(e) => f.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>
        </GlassPanel>
      </ReadOnlySection>

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
