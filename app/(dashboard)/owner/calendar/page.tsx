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

import { useCallback, useMemo, useState } from 'react';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { DatePicker } from '@/components/molecules/DatePicker';
import { QueryState } from '@/components/molecules/QueryState';
import { PageHeader } from '@/components/organisms/PageHeader';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  CalendarGrid,
  BookingDetailModal,
  StaffBookingFormModal,
  StaffSelectedSlotsBar,
} from '@/components/organisms/VenueCalendar';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';
import { toIsoDateString } from '@/lib/date/calendar';
import { buildHourSlotsForDay } from '@/lib/venue/operating-hours';
import {
  buildCalendarBookingSegments,
  VENUE_CALENDAR_VISIBLE_STATUSES,
} from '@/lib/venue/calendar-booking-segments';
import {
  buildStaffSlotKey,
  sumStaffSelectedSlots,
  type StaffAvailabilityCourt,
  type StaffAvailabilitySlot,
  type StaffSelectedSlot,
} from '@/lib/venue/calendar-staff-booking';
import { VenueAction, PaymentMethod } from '@/graphql/generated';
import {
  useCreateStaffBooking,
  useMyVenueAvailability,
  useVenueBookings,
  useVenueCourts,
  useVenueDetail,
} from '@/hooks/owner';

export default function OwnerCalendarPage() {
  const {
    selectedVenueId,
    loading: venueLoading,
    canVenue,
  } = useVenueContext();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(
    null
  );
  const [selectedSlots, setSelectedSlots] = useState<StaffSelectedSlot[]>([]);
  const [showStaffBookingForm, setShowStaffBookingForm] = useState(false);

  const canCreateStaffBooking = canVenue(VenueAction.CreateBooking);

  const dateStr = toIsoDateString(currentDate);

  const { venue, loading: venueDetailLoading } =
    useVenueDetail(selectedVenueId);

  const hourRange = useMemo(
    () => buildHourSlotsForDay(venue?.operatingHours ?? [], currentDate),
    [venue?.operatingHours, currentDate]
  );

  const { bookings, loading, error, refetch } = useVenueBookings(
    selectedVenueId,
    {
      fromDate: dateStr,
      toDate: dateStr,
      statuses: VENUE_CALENDAR_VISIBLE_STATUSES,
    },
    { limit: CURSOR_PAGE_MAX }
  );

  const {
    courts: availabilityCourts,
    loading: availabilityLoading,
    refetch: refetchAvailability,
  } = useMyVenueAvailability(selectedVenueId, dateStr);

  const { createStaffBooking, loading: creatingStaffBooking } =
    useCreateStaffBooking(selectedVenueId);

  const { courts: venueCourts, loading: courtsLoading } = useVenueCourts(
    selectedVenueId,
    { limit: CURSOR_PAGE_MAX }
  );

  const courts = useMemo(() => {
    const fromVenue = venueCourts
      .map((court) => court.name)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'vi'));
    if (fromVenue.length > 0) {
      return fromVenue;
    }

    const fromAvailability = availabilityCourts
      .map((court) => court.courtName)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'vi'));
    if (fromAvailability.length > 0) {
      return fromAvailability;
    }

    const fromBookings = new Set<string>();
    bookings.forEach((booking) => {
      booking.slots?.forEach((slot) => {
        if (slot.courtName) fromBookings.add(slot.courtName);
      });
    });
    return Array.from(fromBookings).sort((a, b) => a.localeCompare(b, 'vi'));
  }, [venueCourts, availabilityCourts, bookings]);

  const calendarSegments = useMemo(
    () => buildCalendarBookingSegments(bookings),
    [bookings]
  );

  const selectedSlotKeys = useMemo(
    () =>
      new Set(
        selectedSlots.map((slot) =>
          buildStaffSlotKey(slot.courtId, slot.startTime)
        )
      ),
    [selectedSlots]
  );

  const selectedTotal = useMemo(
    () => sumStaffSelectedSlots(selectedSlots),
    [selectedSlots]
  );

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
    setSelectedSlots([]);
    setShowStaffBookingForm(false);
  }, []);

  const handleRemoveSelectedSlot = useCallback((slotKey: string) => {
    setSelectedSlots((current) =>
      current.filter(
        (item) => buildStaffSlotKey(item.courtId, item.startTime) !== slotKey
      )
    );
  }, []);

  const handleStaffSlotToggle = useCallback(
    (court: StaffAvailabilityCourt, slot: StaffAvailabilitySlot) => {
      const slotKey = buildStaffSlotKey(court.courtId, slot.startTime);
      setSelectedSlots((current) => {
        const exists = current.some(
          (item) => buildStaffSlotKey(item.courtId, item.startTime) === slotKey
        );
        if (exists) {
          return current.filter(
            (item) =>
              buildStaffSlotKey(item.courtId, item.startTime) !== slotKey
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
    []
  );

  const handleStaffBookingConfirm = useCallback(
    async (payload: {
      customerId?: string;
      customerName: string;
      customerPhone: string;
      internalNote?: string;
      paymentMethod: PaymentMethod;
    }) => {
      if (!selectedVenueId || selectedSlots.length === 0) return;

      await createStaffBooking({
        venueId: selectedVenueId,
        date: dateStr,
        slots: selectedSlots.map((slot) => ({
          courtId: slot.courtId,
          courtName: slot.courtName,
          startTime: slot.startTime,
          endTime: slot.endTime,
          price: slot.price,
          isPeakHour: slot.isPeakHour,
        })),
        ...(payload.customerId ? { customerId: payload.customerId } : {}),
        customerInfo: {
          name: payload.customerName,
          phone: payload.customerPhone,
        },
        ...(payload.internalNote ? { internalNote: payload.internalNote } : {}),
        paymentMethod: payload.paymentMethod,
      });

      setShowStaffBookingForm(false);
      setSelectedSlots([]);
      await Promise.all([refetch(), refetchAvailability()]);
    },
    [
      selectedVenueId,
      selectedSlots,
      createStaffBooking,
      dateStr,
      refetch,
      refetchAvailability,
    ]
  );

  const scheduleDescription = hourRange.isClosed
    ? 'Cơ sở đóng cửa trong ngày này.'
    : hourRange.openTime && hourRange.closeTime
      ? `Giờ mở cửa ${hourRange.openTime} – ${hourRange.closeTime}${hourRange.usedFallback ? ' (mặc định)' : ''}. Chọn khung giờ trống để đặt lịch cho khách.`
      : 'Chọn khung giờ trống trên lịch để đặt lịch cho khách.';

  const pageLoading =
    loading ||
    venueLoading ||
    venueDetailLoading ||
    courtsLoading ||
    availabilityLoading;

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Lịch sân" description={scheduleDescription} />
        <DatePicker
          value={currentDate}
          onChange={handleDateChange}
          withNavigation
          showTodayButton
        />
      </div>

      <GlassPanel card className="mt-6 w-full min-w-0 overflow-hidden p-0">
        <QueryState
          loading={pageLoading && !selectedVenueId}
          error={error}
          empty={!selectedVenueId}
          emptyMessage="Chọn cơ sở ở thanh trên để xem lịch."
          onRetry={() => void Promise.all([refetch(), refetchAvailability()])}
        >
          <VenueActionGate action={VenueAction.CreateBooking}>
            <StaffSelectedSlotsBar
              selectedSlots={selectedSlots}
              totalPrice={selectedTotal}
              onRemoveSlot={handleRemoveSelectedSlot}
              onClear={() => setSelectedSlots([])}
              onBook={() => setShowStaffBookingForm(true)}
            />
          </VenueActionGate>

          <CalendarGrid
            courts={courts}
            segments={calendarSegments}
            hours={hourRange.hours}
            onSegmentClick={(segment) =>
              setSelectedBookingId(segment.bookingId)
            }
            staffBookingEnabled={canCreateStaffBooking}
            availabilityCourts={availabilityCourts}
            selectedSlotKeys={selectedSlotKeys}
            onStaffSlotToggle={
              canCreateStaffBooking ? handleStaffSlotToggle : undefined
            }
          />
        </QueryState>
      </GlassPanel>

      <VenueActionGate action={VenueAction.CreateBooking}>
        <StaffBookingFormModal
          open={showStaffBookingForm}
          onClose={() => setShowStaffBookingForm(false)}
          bookingDate={currentDate}
          selectedSlots={selectedSlots}
          loading={creatingStaffBooking}
          onConfirm={handleStaffBookingConfirm}
        />
      </VenueActionGate>

      <BookingDetailModal
        bookingId={selectedBookingId}
        open={selectedBookingId != null}
        onClose={() => setSelectedBookingId(null)}
        onActionComplete={async () => {
          await Promise.all([refetch(), refetchAvailability()]);
        }}
      />
    </div>
  );
}
