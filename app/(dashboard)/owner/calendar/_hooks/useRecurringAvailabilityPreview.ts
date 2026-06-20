/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { useCheckRecurringAvailability } from '@/hooks/owner';
import type { BookingPromotionSlot } from '@/lib/booking/build-booking-promotion-input';
import {
  buildRecurringAvailabilityCheckInput,
  type RecurringAvailabilityResult,
} from '@/lib/booking/recurring-availability-check';

interface RecurringPreviewContext {
  selectedDays: number[];
  primaryDayOfWeek: number;
  slotsByDay: Map<number, BookingPromotionSlot[]>;
  anchorSlots: BookingPromotionSlot[];
  durationMonths: number;
  appliedPromoCode: string | null;
}

interface UseRecurringAvailabilityPreviewParams {
  step: number;
  venueId: string | null | undefined;
  dateStr: string;
  excludeDates: string[];
  customerId?: string;
  appliedPromoCode: string | null;
  previewContext: RecurringPreviewContext;
  checkRecurringAvailability: ReturnType<
    typeof useCheckRecurringAvailability
  >['checkRecurringAvailability'];
  onResult: (result: RecurringAvailabilityResult) => void;
}

export function useRecurringAvailabilityPreview({
  step,
  venueId,
  dateStr,
  excludeDates,
  customerId,
  appliedPromoCode,
  previewContext,
  checkRecurringAvailability,
  onResult,
}: UseRecurringAvailabilityPreviewParams) {
  const [previewLoading, setPreviewLoading] = useState(false);
  const previewSkipInitialRef = useRef(true);
  const previewContextRef = useRef(previewContext);
  previewContextRef.current = previewContext;

  const refreshAvailabilityPreview = useCallback(
    async (nextExcludeDates: string[], nextCustomerId?: string) => {
      if (!venueId || step !== 1) return;

      setPreviewLoading(true);
      try {
        const ctx = previewContextRef.current;
        const { slots, daySchedules } = buildRecurringAvailabilityCheckInput({
          selectedDays: ctx.selectedDays,
          primaryDayOfWeek: ctx.primaryDayOfWeek,
          slotsByDay: ctx.slotsByDay,
          anchorSlots: ctx.anchorSlots,
        });

        const result = await checkRecurringAvailability({
          venueId,
          startDate: dateStr,
          durationMonths: ctx.durationMonths,
          slots,
          daySchedules,
          isStaffMode: true,
          excludeDates: nextExcludeDates,
          customerId: nextCustomerId,
          discountCode: ctx.appliedPromoCode ?? undefined,
        });

        if (result) {
          onResult(result);
        }
      } finally {
        setPreviewLoading(false);
      }
    },
    [venueId, dateStr, step, checkRecurringAvailability, onResult],
  );

  useEffect(() => {
    if (step !== 1) {
      previewSkipInitialRef.current = true;
      return;
    }

    const hasPreviewInputs =
      excludeDates.length > 0 || Boolean(customerId) || Boolean(appliedPromoCode);

    if (previewSkipInitialRef.current && !hasPreviewInputs) {
      previewSkipInitialRef.current = false;
      return;
    }
    previewSkipInitialRef.current = false;

    const timer = window.setTimeout(() => {
      void refreshAvailabilityPreview(excludeDates, customerId);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [
    step,
    excludeDates,
    customerId,
    appliedPromoCode,
    refreshAvailabilityPreview,
  ]);

  return { previewLoading };
}
