/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { IonIcon } from '@/components/atoms/IonIcon';

interface BookingRecurringPromoCalloutProps {
  recurringPromoEligible: boolean;
  effectiveSessionCount: number;
  minRecurringPromoSessions: number;
  hasExcludedDates: boolean;
}

export function BookingRecurringPromoCallout({
  recurringPromoEligible,
  effectiveSessionCount,
  minRecurringPromoSessions,
  hasExcludedDates,
}: BookingRecurringPromoCalloutProps) {
  if (!hasExcludedDates) {
    return null;
  }

  if (recurringPromoEligible) {
    return (
      <div className="bg-primary/5 border-primary/15 mt-2 flex items-center gap-3 rounded-xl border p-3">
        <IonIcon
          name="information-circle-outline"
          className="text-primary shrink-0"
        />
        <p className="text-muted m-0 text-xs leading-snug">
          KM lịch cố định được điều chỉnh theo{' '}
          <span className="text-heading font-medium">
            {effectiveSessionCount} buổi
          </span>{' '}
          còn lại.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
      <IonIcon
        name="alert-circle-outline"
        className="shrink-0 text-amber-500"
      />
      <p className="text-muted m-0 text-xs leading-snug">
        KM lịch cố định yêu cầu tối thiểu{' '}
        <span className="text-heading font-medium">
          {minRecurringPromoSessions} buổi
        </span>
        . Hiện còn{' '}
        <span className="text-heading font-medium">
          {effectiveSessionCount} buổi
        </span>
        .
      </p>
    </div>
  );
}
