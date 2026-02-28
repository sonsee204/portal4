'use client';

import { Controller, useFieldArray, type Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { TournamentFormData } from '@/types/tournament-form';

const rankConfig = {
  gold: {
    label: 'Giải Nhất',
    icon: 'trophy-outline',
    accent:
      'from-amber-400/20 to-yellow-500/10 border-amber-300/30 dark:border-amber-500/20',
    iconColor: 'text-amber-500',
  },
  silver: {
    label: 'Giải Nhì',
    icon: 'medal-outline',
    accent:
      'from-slate-300/20 to-gray-400/10 border-slate-300/30 dark:border-slate-400/20',
    iconColor: 'text-slate-400',
  },
  bronze: {
    label: 'Giải Ba',
    icon: 'ribbon-outline',
    accent:
      'from-orange-300/20 to-amber-400/10 border-orange-300/30 dark:border-orange-400/20',
    iconColor: 'text-orange-400',
  },
} as const;

interface PrizeEditorProps {
  index: number;
  control: Control<TournamentFormData>;
  rank: 'gold' | 'silver' | 'bronze';
}

export function PrizeEditor({ index, control, rank }: PrizeEditorProps) {
  const config = rankConfig[rank];

  const {
    fields: perkFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `prizes.${index}.perks` as never,
  });

  return (
    <div
      className={cn(
        'rounded-xl border bg-gradient-to-br p-5 transition-shadow hover:shadow-md',
        config.accent
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            'bg-surface/80 flex h-10 w-10 items-center justify-center rounded-xl',
            config.iconColor
          )}
        >
          <IonIcon name={config.icon} size="md" />
        </div>
        <h4 className="text-heading text-sm font-bold">{config.label}</h4>
      </div>

      <div className="space-y-3">
        <Controller
          name={`prizes.${index}.amount`}
          control={control}
          render={({ field }) => (
            <CurrencyInput
              {...field}
              label="Giá trị giải thưởng"
              placeholder="VD: 600.000đ"
            />
          )}
        />

        <div>
          <label className="text-body mb-1.5 block text-sm font-medium">
            Phần thưởng kèm theo
          </label>
          <div className="space-y-2">
            {perkFields.map((perk, pi) => (
              <div key={perk.id} className="flex items-center gap-2">
                <Controller
                  name={`prizes.${index}.perks.${pi}`}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="VD: Huy chương Vàng"
                      className="flex-1"
                    />
                  )}
                />
                {perkFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(pi)}
                    className="text-faint hover:bg-danger/10 hover:text-danger shrink-0 rounded-lg p-1"
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
            Thêm phần thưởng
          </Button>
        </div>
      </div>
    </div>
  );
}
