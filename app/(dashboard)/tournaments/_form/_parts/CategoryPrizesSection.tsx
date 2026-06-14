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

import { useFieldArray, useWatch, type Control } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PrizeEditor, getNextPrizeRank } from './PrizeEditor';
import type { TournamentFormData } from '@/types/tournament-form';

interface CategoryPrizesSectionProps {
  index: number;
  control: Control<TournamentFormData>;
}

export function CategoryPrizesSection({
  index,
  control,
}: CategoryPrizesSectionProps) {
  const basePath = `categories.${index}`;

  const {
    fields: prizeFields,
    append: appendPrize,
    remove: removePrize,
  } = useFieldArray({
    control,
    name: `${basePath}.prizes` as never,
  });

  const prizes =
    useWatch({ control, name: `categories.${index}.prizes` }) ?? [];
  const sharedThirdPlace =
    useWatch({ control, name: `categories.${index}.sharedThirdPlace` }) ??
    false;

  return (
    <div className="border-surface-border mt-4 rounded-lg border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-heading flex items-center gap-2 text-xs font-semibold">
          <IonIcon
            name="medal-outline"
            size="sm"
            className="text-primary"
          />
          Giải thưởng
        </h4>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          iconLeft="add-outline"
          onClick={() =>
            appendPrize({
              rank: getNextPrizeRank(prizes),
              title: `Giải ${prizes.length + 1}`,
              amount: '',
              perks: [''],
            } as never)
          }
        >
          Thêm giải
        </Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {prizeFields.map((field, pi) => (
          <PrizeEditor
            key={field.id}
            index={pi}
            control={control}
            rank={prizes[pi]?.rank ?? 'gold'}
            basePath={basePath}
            sharedThirdPlace={sharedThirdPlace}
            onRemove={() => removePrize(pi)}
            canRemove={prizeFields.length > 1}
          />
        ))}
      </div>
    </div>
  );
}
