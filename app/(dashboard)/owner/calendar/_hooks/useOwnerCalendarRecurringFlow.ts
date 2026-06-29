/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useApolloClient } from '@apollo/client/react';
import { useCallback, useMemo, useState } from 'react';
import {
  useCheckRecurringAvailability,
  useCreateStaffRecurringBooking,
} from '@/hooks/owner';
import type { BookingPromotionSlot } from '@/lib/booking/build-booking-promotion-input';
import {
  buildRecurringAvailabilityCheckInput,
  interpretRecurringAvailabilityResult,
  resolveRecurringSlotsByDay,
} from '@/lib/booking/recurring-availability-check';
import {
  buildInitialSelectedDays,
  RECURRING_WIZARD_STEPS,
  toggleDayOfWeek,
} from '@/lib/booking/recurring-booking.constants';
import type { RecurringAvailabilityResult } from '@/lib/booking/recurring-availability-check';
import type { OwnerCalendarPageData } from './useOwnerCalendarPageData';
import { useOwnerCalendarRecurringConfirmForm } from './useOwnerCalendarRecurringConfirmForm';
import { useOwnerCalendarRecurringSubmit } from './useOwnerCalendarRecurringSubmit';
import { useRecurringAvailabilityPreview } from './useRecurringAvailabilityPreview';

export type { RecurringAvailabilityResult };

export function useOwnerCalendarRecurringFlow(data: OwnerCalendarPageData) {
  const apolloClient = useApolloClient();
  const primaryDayOfWeek = data.currentDate.getDay();
  const anchorSlots = data.selectedSlots;
  const slotDurationMinutes = data.venue?.slotDurationMinutes ?? 60;

  const { checkRecurringAvailability, loading: checkingAvailability } =
    useCheckRecurringAvailability();
  const { createStaffRecurringBooking, loading: creatingRecurring } =
    useCreateStaffRecurringBooking(data.selectedVenueId);

  const [step, setStep] = useState(0);
  const [durationMonths, setDurationMonths] = useState(2);
  const [selectedDays, setSelectedDays] = useState(() =>
    buildInitialSelectedDays(primaryDayOfWeek),
  );
  const [slotsByDay, setSlotsByDay] = useState<
    Map<number, BookingPromotionSlot[]>
  >(() => new Map([[primaryDayOfWeek, anchorSlots]]));
  const [availabilityResult, setAvailabilityResult] =
    useState<RecurringAvailabilityResult | null>(null);
  const [excludeDates, setExcludeDates] = useState<string[]>([]);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [forceContinueWithPartial, setForceContinueWithPartial] =
    useState(false);

  const updateDurationMonths = useCallback((months: number) => {
    setDurationMonths(months);
    setAvailabilityResult(null);
    setAvailabilityError(null);
    setForceContinueWithPartial(false);
  }, []);

  const handleDayToggle = useCallback(
    (day: number) => {
      setSelectedDays((current) =>
        toggleDayOfWeek(current, day, primaryDayOfWeek),
      );
      setAvailabilityResult(null);
      setForceContinueWithPartial(false);
    },
    [primaryDayOfWeek],
  );

  const handleCheckAvailability = useCallback(async () => {
    if (!data.selectedVenueId || selectedDays.length === 0) return;

    setAvailabilityError(null);
    const latestSlotsByDay = await resolveRecurringSlotsByDay({
      apolloClient,
      venueId: data.selectedVenueId,
      startDate: data.dateStr,
      primaryDayOfWeek,
      selectedDays,
      slotsByDay,
      anchorSlots,
    });
    setSlotsByDay(latestSlotsByDay);

    const { slots, daySchedules } = buildRecurringAvailabilityCheckInput({
      selectedDays,
      primaryDayOfWeek,
      slotsByDay: latestSlotsByDay,
      anchorSlots,
    });

    const result = await checkRecurringAvailability({
      venueId: data.selectedVenueId,
      startDate: data.dateStr,
      durationMonths,
      slots,
      daySchedules,
      isStaffMode: true,
    });

    if (!result) {
      setAvailabilityError('Không thể kiểm tra lịch. Vui lòng thử lại.');
      return;
    }

    setAvailabilityResult(result);
    setExcludeDates([]);

    const outcome = interpretRecurringAvailabilityResult(result);
    if (outcome.kind === 'ready') {
      setStep(1);
      setForceContinueWithPartial(false);
      return;
    }

    setAvailabilityError(outcome.message);
  }, [
    data.selectedVenueId,
    data.dateStr,
    selectedDays,
    primaryDayOfWeek,
    slotsByDay,
    anchorSlots,
    apolloClient,
    checkRecurringAvailability,
    durationMonths,
  ]);

  const handleContinueWithAvailable = useCallback(() => {
    if (availabilityResult?.availableDates.length) {
      setForceContinueWithPartial(true);
      setStep(1);
    }
  }, [availabilityResult]);

  const confirmSlots = useMemo(() => {
    if (selectedDays.length === 1) {
      return slotsByDay.get(primaryDayOfWeek) ?? anchorSlots;
    }
    return anchorSlots;
  }, [selectedDays, slotsByDay, primaryDayOfWeek, anchorSlots]);

  const confirmForm = useOwnerCalendarRecurringConfirmForm({
    step,
    venueId: data.selectedVenueId,
    dateStr: data.dateStr,
    slotDurationMinutes,
    confirmSlots,
    anchorSlots,
    availabilityResult,
    excludeDates,
    creatingRecurring,
  });

  const handleAvailabilityPreview = useCallback(
    (result: RecurringAvailabilityResult) => {
      setAvailabilityResult(result);
    },
    [],
  );

  const { previewLoading } = useRecurringAvailabilityPreview({
    step,
    venueId: data.selectedVenueId,
    dateStr: data.dateStr,
    excludeDates,
    customerId: confirmForm.selectedUser?._id,
    appliedPromoCode: confirmForm.appliedPromotion?.code ?? null,
    previewContext: {
      selectedDays,
      primaryDayOfWeek,
      slotsByDay,
      anchorSlots,
      durationMonths,
      appliedPromoCode: confirmForm.appliedPromotion?.code ?? null,
    },
    checkRecurringAvailability,
    onResult: handleAvailabilityPreview,
  });

  const toggleExcludeDate = useCallback((date: string) => {
    setExcludeDates((current) =>
      current.includes(date)
        ? current.filter((item) => item !== date)
        : [...current, date],
    );
  }, []);

  const handleSubmit = useOwnerCalendarRecurringSubmit({
    data,
    availabilityResult,
    selectedDays,
    primaryDayOfWeek,
    slotsByDay,
    anchorSlots,
    durationMonths,
    excludeDates,
    confirmForm,
    createStaffRecurringBooking,
  });

  const effectiveAvailableDates = useMemo(() => {
    if (!availabilityResult) return [];
    return availabilityResult.availableDates.filter(
      (date) => !excludeDates.includes(date),
    );
  }, [availabilityResult, excludeDates]);

  const effectiveSessions =
    availabilityResult?.effectiveSessions ??
    Math.max(0, (availabilityResult?.totalSessions ?? 0) - excludeDates.length);

  return {
    steps: RECURRING_WIZARD_STEPS,
    step,
    setStep,
    durationMonths,
    setDurationMonths: updateDurationMonths,
    selectedDays,
    primaryDayOfWeek,
    handleDayToggle,
    slotsByDay,
    anchorSlots,
    checkingAvailability: checkingAvailability || previewLoading,
    availabilityResult,
    availabilityError,
    forceContinueWithPartial,
    handleCheckAvailability,
    handleContinueWithAvailable,
    ...confirmForm,
    creatingRecurring,
    handleSubmit,
    excludeDates,
    toggleExcludeDate,
    effectiveAvailableDates,
    effectiveSessions,
    slotDurationMinutes,
  };
}

export type OwnerCalendarRecurringFlow = ReturnType<
  typeof useOwnerCalendarRecurringFlow
>;
