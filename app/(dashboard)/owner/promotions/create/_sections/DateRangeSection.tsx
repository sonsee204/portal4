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

import { IonIcon } from '@/components/atoms/IonIcon';
import { DatePicker } from '@/components/molecules/DatePicker';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { addDays } from '@/lib/date/calendar';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';

interface DateRangeSectionProps {
  data: CreatePromotionPageData;
}

export function DateRangeSection({ data }: DateRangeSectionProps) {
  const { formValues, setField, minStartDate, isPastStartDate, formErrors } =
    data;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon
          name="calendar-outline"
          size="sm"
          className="text-purple-500"
        />
        Thời gian áp dụng
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <DatePicker
          label="Ngày bắt đầu"
          value={formValues.startDate}
          minDate={minStartDate}
          maxDate={formValues.endDate}
          onChange={(date) => {
            setField('startDate', date);
            if (date >= formValues.endDate) {
              setField('endDate', addDays(date, 1));
            }
          }}
        />
        <DatePicker
          label="Ngày kết thúc"
          value={formValues.endDate}
          minDate={formValues.startDate}
          onChange={(date) => {
            setField('endDate', date);
            if (date <= formValues.startDate) {
              setField('startDate', addDays(date, -1));
            }
          }}
        />
      </div>

      {formErrors.startDate?.message ? (
        <p className="text-xs text-red-500">{formErrors.startDate.message}</p>
      ) : null}
      {formErrors.endDate?.message ? (
        <p className="text-xs text-red-500">{formErrors.endDate.message}</p>
      ) : null}

      {isPastStartDate ? (
        <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3">
          <IonIcon
            name="warning-outline"
            size="sm"
            className="mt-0.5 shrink-0 text-amber-500"
          />
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Bạn đang tạo khuyến mãi với ngày bắt đầu trong quá khứ. Khuyến mãi
            này sẽ được áp dụng cho các lịch đặt hồi tố.
          </p>
        </div>
      ) : null}
    </GlassPanel>
  );
}
