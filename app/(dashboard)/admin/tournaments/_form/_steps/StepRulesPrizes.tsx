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

import { useFieldArray, type UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { RuleEditor } from '../_parts/RuleEditor';
import type { TournamentFormData } from '@/types/tournament-form';

interface StepRulesPrizesProps {
  form: UseFormReturn<TournamentFormData>;
}

export function StepRulesPrizes({ form }: StepRulesPrizesProps) {
  const { control } = form;

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({ control, name: 'rules' });

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
              <IonIcon name="book-outline" size="sm" className="text-primary" />
              Thể lệ thi đấu
            </h3>
            <p className="text-muted mt-1 text-xs">
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
            <div className="border-surface-border flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 text-center">
              <IonIcon
                name="document-text-outline"
                size="lg"
                className="text-faint mb-2"
              />
              <p className="text-muted text-sm">Chưa có thể lệ nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
