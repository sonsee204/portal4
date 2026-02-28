'use client';

import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { RuleEditor } from '../_parts/RuleEditor';
import { PrizeEditor } from '../_parts/PrizeEditor';
import type { TournamentFormData } from '@/types/tournament-form';

interface StepRulesPrizesProps {
  form: UseFormReturn<TournamentFormData>;
}

export function StepRulesPrizes({ form }: StepRulesPrizesProps) {
  const { control, watch } = form;

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({ control, name: 'rules' });

  const prizes = watch('prizes');

  return (
    <div className="space-y-6">
      {/* Rules */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-heading">
              <IonIcon name="book-outline" size="sm" className="text-primary" />
              Thể lệ thi đấu
            </h3>
            <p className="mt-1 text-xs text-muted">
              Các điều khoản và quy định của giải đấu
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            iconLeft="add-outline"
            onClick={() => appendRule({ title: '', content: '' })}
          >
            Thêm thể lệ
          </Button>
        </div>
        <div className="space-y-3">
          {ruleFields.map((field, i) => (
            <RuleEditor
              key={field.id}
              index={i}
              control={control}
              onRemove={() => removeRule(i)}
              canRemove={ruleFields.length > 1}
            />
          ))}
          {ruleFields.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-border py-8 text-center">
              <IonIcon name="document-text-outline" size="lg" className="mb-2 text-faint" />
              <p className="text-sm text-muted">Chưa có thể lệ nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Prizes */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold text-heading">
          <IonIcon name="medal-outline" size="sm" className="text-primary" />
          Giải thưởng
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          {prizes.map((prize, i) => (
            <PrizeEditor
              key={prize.rank}
              index={i}
              control={control}
              rank={prize.rank}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
