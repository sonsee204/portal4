'use client';

import { Controller, type Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { TournamentFormData } from '@/types/tournament-form';

const statusColors = {
  completed: 'bg-emerald-500',
  active: 'bg-primary animate-pulse',
  upcoming: 'bg-surface-border',
};

interface SchedulePhaseRowProps {
  index: number;
  control: Control<TournamentFormData>;
  status: 'upcoming' | 'active' | 'completed';
  onRemove: () => void;
  canRemove: boolean;
  minDate?: string;
  maxDate?: string;
}

export function SchedulePhaseRow({
  index,
  control,
  status,
  onRemove,
  canRemove,
  minDate,
  maxDate,
}: SchedulePhaseRowProps) {
  return (
    <div className="group flex items-center gap-3">
      <div
        className={cn('h-3 w-3 shrink-0 rounded-full', statusColors[status])}
      />

      <div className="flex flex-1 items-center gap-3">
        <div className="flex-1">
          <Controller
            name={`schedule.${index}.label`}
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="VD: Vòng bảng" />
            )}
          />
        </div>
        <div className="w-44">
          <Controller
            name={`schedule.${index}.date`}
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                type="date"
                min={minDate}
                max={maxDate}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-faint hover:bg-danger/10 hover:text-danger shrink-0 rounded-lg p-1 opacity-0 transition-all group-hover:opacity-100"
        >
          <IonIcon name="close-outline" size="sm" />
        </button>
      )}
    </div>
  );
}
