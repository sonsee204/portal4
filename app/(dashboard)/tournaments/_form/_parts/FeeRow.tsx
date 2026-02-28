'use client';

import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { TournamentFormData } from '@/types/tournament-form';

interface FeeRowProps {
  index: number;
  control: Control<TournamentFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export function FeeRow({ index, control, onRemove, canRemove }: FeeRowProps) {
  return (
    <div className="group flex items-end gap-3">
      <div className="flex-1">
        <Controller
          name={`fees.${index}.label`}
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label={index === 0 ? 'Nội dung' : undefined}
              placeholder="VD: Đơn nam/nữ"
            />
          )}
        />
      </div>
      <div className="w-44">
        <Controller
          name={`fees.${index}.amount`}
          control={control}
          render={({ field }) => (
            <CurrencyInput
              {...field}
              label={index === 0 ? 'Lệ phí' : undefined}
              placeholder="50.000đ"
            />
          )}
        />
      </div>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-faint hover:bg-danger/10 hover:text-danger mb-1 shrink-0 rounded-lg p-1.5 opacity-0 transition-all group-hover:opacity-100"
        >
          <IonIcon name="close-outline" size="sm" />
        </button>
      )}
    </div>
  );
}
