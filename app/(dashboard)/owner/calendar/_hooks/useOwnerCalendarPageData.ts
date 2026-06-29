/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';
import { toIsoDateString } from '@/lib/date/calendar';
import { buildHourSlotsForDay } from '@/lib/venue/operating-hours';
import { buildCalendarSegmentsFromAvailability } from '@/lib/venue/calendar-availability-segments';
import {
  buildStaffSlotKey,
  sumStaffSelectedSlots,
  type StaffAvailabilityCourt,
  type StaffAvailabilitySlot,
  type StaffSelectedSlot,
} from '@/lib/venue/calendar-staff-booking';
import { VenueAction } from '@/graphql/generated';
import {
  useMyVenueAvailability,
  useVenueCourts,
  useVenueDetail,
} from '@/hooks/owner';

export function useOwnerCalendarPageData() {
  const {
    selectedVenueId,
    loading: venueLoading,
    canVenue,
  } = useVenueContext();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null,
  );
  const [selectedSlots, setSelectedSlots] = useState<StaffSelectedSlot[]>([]);
  const [showStaffBookingForm, setShowStaffBookingForm] = useState(false);
  const [showRecurringWizard, setShowRecurringWizard] = useState(false);

  const canCreateStaffBooking = canVenue(VenueAction.CreateBooking);
  const dateStr = toIsoDateString(currentDate);

  const { venue, loading: venueDetailLoading } =
    useVenueDetail(selectedVenueId);

  const hourRange = useMemo(
    () => buildHourSlotsForDay(venue?.operatingHours ?? [], currentDate),
    [venue?.operatingHours, currentDate],
  );

  const {
    courts: availabilityCourts,
    loading: availabilityLoading,
    error: availabilityError,
    refetch: refetchAvailability,
  } = useMyVenueAvailability(selectedVenueId, dateStr);

  const { courts: venueCourts, loading: courtsLoading } = useVenueCourts(
    selectedVenueId,
    undefined,
    { limit: CURSOR_PAGE_MAX },
  );

  const courts = useMemo(() => {
    const fromVenue = venueCourts
      .map((court) => court.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'vi'));
    if (fromVenue.length > 0) {
      return fromVenue;
    }

    return availabilityCourts
      .map((court) => court.courtName)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'vi'));
  }, [venueCourts, availabilityCourts]);

  const calendarSegments = useMemo(
    () => buildCalendarSegmentsFromAvailability(availabilityCourts),
    [availabilityCourts],
  );

  const selectedSlotKeys = useMemo(
    () =>
      new Set(
        selectedSlots.map((slot) =>
          buildStaffSlotKey(slot.courtId, slot.startTime),
        ),
      ),
    [selectedSlots],
  );

  const selectedTotal = useMemo(
    () => sumStaffSelectedSlots(selectedSlots),
    [selectedSlots],
  );

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
    setSelectedSlots([]);
    setShowStaffBookingForm(false);
    setShowRecurringWizard(false);
  }, []);

  const handleRemoveSelectedSlot = useCallback((slotKey: string) => {
    setSelectedSlots((current) =>
      current.filter(
        (item) => buildStaffSlotKey(item.courtId, item.startTime) !== slotKey,
      ),
    );
  }, []);

  const handleStaffSlotToggle = useCallback(
    (court: StaffAvailabilityCourt, slot: StaffAvailabilitySlot) => {
      const slotKey = buildStaffSlotKey(court.courtId, slot.startTime);
      setSelectedSlots((current) => {
        const exists = current.some(
          (item) => buildStaffSlotKey(item.courtId, item.startTime) === slotKey,
        );
        if (exists) {
          return current.filter(
            (item) =>
              buildStaffSlotKey(item.courtId, item.startTime) !== slotKey,
          );
        }
        return [
          ...current,
          {
            courtId: court.courtId,
            courtName: court.courtName,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price,
            isPeakHour: slot.isPeakHour,
          },
        ];
      });
    },
    [],
  );

  const scheduleDescription = hourRange.isClosed
    ? 'Cơ sở đóng cửa trong ngày này.'
    : hourRange.openTime && hourRange.closeTime
      ? `Giờ mở cửa ${hourRange.openTime} – ${hourRange.closeTime}${hourRange.usedFallback ? ' (mặc định)' : ''}. Chọn khung giờ trống để đặt lịch cho khách.`
      : 'Chọn khung giờ trống trên lịch để đặt lịch cho khách.';

  const pageLoading =
    venueLoading || venueDetailLoading || courtsLoading || availabilityLoading;

  return {
    selectedVenueId,
    currentDate,
    dateStr,
    selectedBookingId,
    setSelectedBookingId,
    selectedSlots,
    setSelectedSlots,
    showStaffBookingForm,
    setShowStaffBookingForm,
    showRecurringWizard,
    setShowRecurringWizard,
    canCreateStaffBooking,
    venue,
    hourRange,
    courts,
    calendarSegments,
    availabilityCourts,
    availabilityError,
    refetchAvailability,
    selectedSlotKeys,
    selectedTotal,
    handleDateChange,
    handleRemoveSelectedSlot,
    handleStaffSlotToggle,
    scheduleDescription,
    pageLoading,
  };
}

export type OwnerCalendarPageData = ReturnType<
  typeof useOwnerCalendarPageData
>;
