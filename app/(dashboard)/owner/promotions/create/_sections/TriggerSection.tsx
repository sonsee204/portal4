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
import { PROMOTION_TRIGGERS } from '@/lib/promotion/promotion-constants';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';
import { PromotionOptionCard } from '../_components/PromotionOptionCard';

interface TriggerSectionProps {
  data: CreatePromotionPageData;
}

export function TriggerSection({ data }: TriggerSectionProps) {
  const { formValues, setField, setCode, formErrors } = data;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon name="flash-outline" size="sm" className="text-purple-500" />
        Cách áp dụng
      </h2>

      {formValues.category === 'VOUCHER' ? (
        <p className="text-muted text-xs">
          Voucher yêu cầu khách nhập mã để áp dụng
        </p>
      ) : null}

      {formValues.category === 'LOYALTY' ||
      formValues.category === 'RECURRING' ? (
        <p className="text-muted text-xs">
          {formValues.category === 'LOYALTY'
            ? 'Tự động áp dụng cho khách đạt điều kiện thân thiết'
            : 'Tự động áp dụng cho đặt lịch cố định'}
        </p>
      ) : null}

      {formValues.category === 'FIRST_BOOKING' ? (
        <div className="grid gap-3">
          {PROMOTION_TRIGGERS.map((item) => (
            <PromotionOptionCard
              key={item.id}
              label={item.label}
              description={item.description}
              selected={formValues.trigger === item.id}
              onSelect={() => setField('trigger', item.id)}
            />
          ))}
        </div>
      ) : null}

      {formValues.trigger === 'CODE' ? (
        <Input
          label="Mã code *"
          placeholder="VD: GIAMGIA20"
          value={formValues.code}
          onChange={(event) => setCode(event.target.value)}
          error={formErrors.code?.message}
        />
      ) : null}
    </GlassPanel>
  );
}
