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

import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { APPLY_LEVEL_OPTIONS } from '@/lib/promotion/promotion-constants';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';
import { PromotionOptionCard } from '../_components/PromotionOptionCard';

interface ApplyLevelSectionProps {
  data: CreatePromotionPageData;
}

export function ApplyLevelSection({ data }: ApplyLevelSectionProps) {
  const { formValues, setField, supportsPerHour } = data;

  if (!supportsPerHour) return null;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon
          name="calculator-outline"
          size="sm"
          className="text-purple-500"
        />
        Cách tính giảm
      </h2>

      <div className="grid gap-3">
        {APPLY_LEVEL_OPTIONS.map((item) => (
          <PromotionOptionCard
            key={item.id}
            label={item.label}
            description={item.description}
            icon={item.icon}
            selected={formValues.applyLevel === item.id}
            onSelect={() => setField('applyLevel', item.id)}
          />
        ))}
      </div>

      {formValues.applyLevel === 'PER_HOUR' ? (
        <div className="border-surface-border space-y-3 rounded-xl border p-4">
          <Checkbox
            label="Giới hạn khung giờ"
            checked={formValues.hasTimeRanges}
            onChange={(event) =>
              setField('hasTimeRanges', event.target.checked)
            }
          />
          <p className="text-muted text-xs">
            {formValues.hasTimeRanges
              ? 'Chỉ giảm giá cho các slot trong khung giờ bên dưới'
              : 'Áp dụng cho mọi giờ trong ngày'}
          </p>

          {formValues.hasTimeRanges ? (
            <div className="space-y-2">
              {formValues.applicableTimeRanges.map((range, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="06:00"
                    value={range.startTime}
                    onChange={(event) => {
                      const next = formValues.applicableTimeRanges.map(
                        (item, idx) =>
                          idx === index
                            ? { ...item, startTime: event.target.value }
                            : item
                      );
                      setField('applicableTimeRanges', next);
                    }}
                  />
                  <span className="text-muted">–</span>
                  <Input
                    placeholder="08:00"
                    value={range.endTime}
                    onChange={(event) => {
                      const next = formValues.applicableTimeRanges.map(
                        (item, idx) =>
                          idx === index
                            ? { ...item, endTime: event.target.value }
                            : item
                      );
                      setField('applicableTimeRanges', next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    iconLeft="trash-outline"
                    className="text-red-500"
                    onClick={() => {
                      if (formValues.applicableTimeRanges.length <= 1) return;
                      setField(
                        'applicableTimeRanges',
                        formValues.applicableTimeRanges.filter(
                          (_, idx) => idx !== index
                        )
                      );
                    }}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                iconLeft="add-circle-outline"
                onClick={() =>
                  setField('applicableTimeRanges', [
                    ...formValues.applicableTimeRanges,
                    { startTime: '09:00', endTime: '12:00' },
                  ])
                }
              >
                Thêm khung giờ
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </GlassPanel>
  );
}
