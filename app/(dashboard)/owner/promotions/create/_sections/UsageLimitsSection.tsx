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
import { formatCurrencyDisplay } from '@/lib/utils';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';

function stripNumeric(value: string): string {
  return value.replace(/[^\d]/g, '');
}

interface UsageLimitsSectionProps {
  data: CreatePromotionPageData;
}

export function UsageLimitsSection({ data }: UsageLimitsSectionProps) {
  const { formValues, setField } = data;

  if (
    formValues.category === 'FIRST_BOOKING' ||
    formValues.category === 'RECURRING'
  ) {
    return null;
  }

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon
          name="lock-closed-outline"
          size="sm"
          className="text-purple-500"
        />
        Giới hạn & điều kiện
      </h2>

      <Input
        label="Đơn tối thiểu (đ)"
        placeholder="Không giới hạn"
        value={formatCurrencyDisplay(formValues.minBookingAmount)}
        onChange={(event) =>
          setField('minBookingAmount', stripNumeric(event.target.value))
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Tổng lượt dùng"
          placeholder="Không giới hạn"
          value={formValues.totalUsageLimit}
          onChange={(event) =>
            setField('totalUsageLimit', stripNumeric(event.target.value))
          }
        />
        <Input
          label="Mỗi người"
          placeholder="Không giới hạn"
          value={formValues.perUserLimit}
          onChange={(event) =>
            setField('perUserLimit', stripNumeric(event.target.value))
          }
        />
      </div>
    </GlassPanel>
  );
}
