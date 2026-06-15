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

import { Controller, useFieldArray, type Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { TournamentFormData } from '@/types/tournament-form';

const RANK_CONFIG: Record<
  string,
  { label: string; icon: string; accent: string; iconColor: string }
> = {
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
};

function getRankConfig(rank: string, position: number) {
  if (RANK_CONFIG[rank]) return RANK_CONFIG[rank];
  return {
    label: `Giải ${position}`,
    icon: 'star-outline',
    accent:
      'from-slate-200/20 to-gray-300/10 border-slate-200/30 dark:border-slate-600/20',
    iconColor: 'text-slate-500',
  };
}

const TOP_RANKS = ['gold', 'silver', 'bronze'] as const;

export function getNextPrizeRank(currentPrizes: { rank: string }[]): string {
  if (currentPrizes.length < 3) return TOP_RANKS[currentPrizes.length];
  return String(currentPrizes.length + 1);
}

interface PrizeEditorProps {
  index: number;
  control: Control<TournamentFormData>;
  rank: string;
  onRemove?: () => void;
  canRemove?: boolean;
  /** Base path for nested prizes (e.g. "categories.0" for category prizes) */
  basePath?: string;
  /** When true and rank is bronze, show "×2" badge (đồng giải ba) */
  sharedThirdPlace?: boolean;
}

export function PrizeEditor({
  index,
  control,
  rank,
  onRemove,
  canRemove,
  basePath = 'prizes',
  sharedThirdPlace = false,
}: PrizeEditorProps) {
  const config = getRankConfig(rank, index + 1);
  const perksPath = basePath === 'prizes' ? `prizes.${index}.perks` : `${basePath}.prizes.${index}.perks`;

  const {
    fields: perkFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: perksPath as never,
  });

  return (
    <div
      className={cn(
        'rounded-xl border bg-gradient-to-br p-5 transition-shadow hover:shadow-md',
        config.accent
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'bg-surface/80 flex h-10 w-10 items-center justify-center rounded-xl',
              config.iconColor
            )}
          >
            <IonIcon name={config.icon} size="md" />
          </div>
          <div className="flex items-center gap-2">
            <h4 className="text-heading text-sm font-bold">{config.label}</h4>
            {sharedThirdPlace && rank === 'bronze' && (
              <span
                className="rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] font-semibold text-orange-600 dark:text-orange-400"
                title="Đồng giải ba - 2 VĐV"
              >
                ×2
              </span>
            )}
          </div>
        </div>
        {canRemove && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-faint hover:bg-danger/10 hover:text-danger shrink-0 rounded-lg p-1"
            title="Xóa giải thưởng"
          >
            <IonIcon name="trash-outline" size="sm" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <Controller
          name={
            (basePath === 'prizes'
              ? `prizes.${index}.amount`
              : `${basePath}.prizes.${index}.amount`) as never
          }
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
                  name={
                    (basePath === 'prizes'
                      ? `prizes.${index}.perks.${pi}`
                      : `${basePath}.prizes.${index}.perks.${pi}`) as never
                  }
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
