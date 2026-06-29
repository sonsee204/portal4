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

import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { PROMOTION_TYPES } from '@/lib/promotion/promotion-constants';
import { formatCurrencyDisplay } from '@/lib/utils';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';
import { PromotionOptionCard } from '../_components/PromotionOptionCard';

function stripNumeric(value: string): string {
  return value.replace(/[^\d]/g, '');
}

interface DiscountTypeSectionProps {
  data: CreatePromotionPageData;
}

export function DiscountTypeSection({ data }: DiscountTypeSectionProps) {
  const { formValues, setField, formErrors } = data;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon
          name="pricetag-outline"
          size="sm"
          className="text-purple-500"
        />
        Loại giảm giá
      </h2>

      <div className="grid gap-3 sm:grid-cols-2">
        {PROMOTION_TYPES.map((item) => (
          <PromotionOptionCard
            key={item.id}
            label={item.label}
            description={
              formValues.applyLevel === 'PER_HOUR'
                ? item.descriptionPerHour
                : item.description
            }
            icon={item.icon}
            selected={formValues.type === item.id}
            onSelect={() => setField('type', item.id)}
          />
        ))}
      </div>

      <Input
        label={
          formValues.type === 'PERCENTAGE'
            ? 'Giá trị giảm (%) *'
            : 'Giá trị giảm (đ) *'
        }
        placeholder={formValues.type === 'PERCENTAGE' ? 'VD: 20' : 'VD: 50.000'}
        value={
          formValues.type === 'FIXED_AMOUNT'
            ? formatCurrencyDisplay(formValues.value)
            : formValues.value
        }
        onChange={(event) => {
          const raw =
            formValues.type === 'FIXED_AMOUNT'
              ? stripNumeric(event.target.value)
              : event.target.value.replace(/[^\d.]/g, '');
          setField('value', raw);
        }}
        error={formErrors.value?.message}
      />

      {formValues.type === 'PERCENTAGE' ? (
        <Input
          label="Giảm tối đa (đ)"
          placeholder="VD: 100.000"
          value={formatCurrencyDisplay(formValues.maxDiscountAmount)}
          onChange={(event) =>
            setField('maxDiscountAmount', stripNumeric(event.target.value))
          }
        />
      ) : null}
    </GlassPanel>
  );
}
