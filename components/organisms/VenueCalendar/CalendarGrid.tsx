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

import { cn } from '@/lib/utils';
import {
  segmentPositionInHourGrid,
  isCalendarSegmentClickable,
  type CalendarBookingSegment,
} from '@/lib/venue/calendar-booking-segments';
import {
  buildStaffSlotKey,
  isStaffSlotSelectable,
  slotPositionInHourGrid,
  type StaffAvailabilityCourt,
  type StaffAvailabilitySlot,
} from '@/lib/venue/calendar-staff-booking';
import { MergedBookedSlotGroup } from './MergedBookedSlotGroup';

const COURT_LABEL_WIDTH = 120;
/** One hour column; 30-min slot ≈ 68px (aligned with mobile TIME_SLOT_WIDTH 70). */
const HOUR_CELL_WIDTH = 144;
const ROW_HEIGHT = 88;
const SLOT_INSET_Y = 4;
const DEFAULT_HOURS = Array.from({ length: 12 }, (_, index) => index + 7);

interface CalendarGridProps {
  courts: string[];
  segments: CalendarBookingSegment[];
  hours?: number[];
  onSegmentClick?: (segment: CalendarBookingSegment) => void;
  staffBookingEnabled?: boolean;
  availabilityCourts?: StaffAvailabilityCourt[];
  selectedSlotKeys?: Set<string>;
  onStaffSlotToggle?: (
    court: StaffAvailabilityCourt,
    slot: StaffAvailabilitySlot
  ) => void;
}

export function CalendarGrid({
  courts,
  segments,
  hours = DEFAULT_HOURS,
  onSegmentClick,
  staffBookingEnabled = false,
  availabilityCourts = [],
  selectedSlotKeys,
  onStaffSlotToggle,
}: CalendarGridProps) {
  if (hours.length === 0) {
    return (
      <p className="text-muted py-10 text-center text-sm">
        Cơ sở đóng cửa trong ngày này.
      </p>
    );
  }

  if (courts.length === 0) {
    return (
      <p className="text-muted py-10 text-center text-sm">
        Không có sân để hiển thị lịch.
      </p>
    );
  }

  const gridStartHour = hours[0] ?? 0;
  const gridMinWidth = COURT_LABEL_WIDTH + hours.length * HOUR_CELL_WIDTH;
  const slotHeight = ROW_HEIGHT - SLOT_INSET_Y * 2;

  const availabilityByCourtName = new Map(
    availabilityCourts.map((court) => [court.courtName, court])
  );

  return (
    <div className="border-surface-border w-full min-w-0 overflow-hidden rounded-lg border">
      <div
        className="max-h-[min(70vh,720px)] w-full min-w-0 overflow-x-auto overflow-y-auto overscroll-x-contain"
        data-venue-calendar-scroll
      >
        <div style={{ minWidth: gridMinWidth }}>
          <div className="border-surface-border bg-surface sticky top-0 z-20 flex border-b">
            <div
              className="border-surface-border bg-surface text-faint sticky left-0 z-30 flex shrink-0 items-center border-r px-3 text-xs font-medium"
              style={{ width: COURT_LABEL_WIDTH, height: ROW_HEIGHT }}
            >
              Sân
            </div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="border-surface-border relative shrink-0 border-r px-1 py-2 text-center text-xs font-medium last:border-r-0"
                style={{ width: HOUR_CELL_WIDTH, height: ROW_HEIGHT }}
              >
                <span className="text-body">
                  {String(hour).padStart(2, '0')}:00
                </span>
                <div
                  aria-hidden
                  className="border-surface-border/60 pointer-events-none absolute top-0 bottom-0 left-1/2 border-l border-dashed"
                />
              </div>
            ))}
          </div>

          {courts.map((court) => {
            const courtSegments = segments.filter(
              (segment) => segment.court === court
            );
            const availabilityCourt = availabilityByCourtName.get(court);
            const selectableSlots =
              staffBookingEnabled && availabilityCourt
                ? availabilityCourt.slots.filter(isStaffSlotSelectable)
                : [];

            return (
              <div
                key={court}
                className="border-surface-border flex border-b last:border-b-0"
              >
                <div
                  className="border-surface-border bg-surface text-heading sticky left-0 z-10 flex shrink-0 items-center border-r px-3 text-sm font-medium"
                  style={{ width: COURT_LABEL_WIDTH, height: ROW_HEIGHT }}
                  title={court}
                >
                  <span className="truncate">{court}</span>
                </div>

                <div
                  className="relative flex"
                  style={{
                    width: hours.length * HOUR_CELL_WIDTH,
                    height: ROW_HEIGHT,
                  }}
                >
                  {hours.map((hour) => (
                    <div
                      key={hour}
                      className="border-surface-border relative shrink-0 border-r last:border-r-0"
                      style={{ width: HOUR_CELL_WIDTH, height: ROW_HEIGHT }}
                    >
                      <div
                        aria-hidden
                        className="border-surface-border/60 pointer-events-none absolute top-0 bottom-0 left-1/2 border-l border-dashed"
                      />
                    </div>
                  ))}

                  {staffBookingEnabled &&
                    selectableSlots.map((slot) => {
                      const slotKey = buildStaffSlotKey(
                        availabilityCourt!.courtId,
                        slot.startTime
                      );
                      const isSelected =
                        selectedSlotKeys?.has(slotKey) ?? false;
                      const { left, width } = slotPositionInHourGrid(
                        slot.startTime,
                        slot.endTime,
                        gridStartHour,
                        HOUR_CELL_WIDTH
                      );

                      return (
                        <button
                          key={slotKey}
                          type="button"
                          title={`${slot.startTime} – ${slot.endTime}`}
                          className={cn(
                            'absolute z-[5] rounded-md border border-dashed transition-colors',
                            isSelected
                              ? 'border-primary bg-primary/20 hover:bg-primary/25'
                              : 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/15'
                          )}
                          style={{
                            left,
                            width,
                            height: slotHeight,
                            top: SLOT_INSET_Y,
                          }}
                          onClick={() =>
                            onStaffSlotToggle?.(availabilityCourt!, slot)
                          }
                        />
                      );
                    })}

                  {courtSegments.map((segment) => {
                    const { left, width } = segmentPositionInHourGrid(
                      segment,
                      gridStartHour,
                      HOUR_CELL_WIDTH
                    );

                    return (
                      <MergedBookedSlotGroup
                        key={segment.id}
                        segment={segment}
                        width={width}
                        height={slotHeight}
                        left={left}
                        className="top-1 z-10"
                        onClick={
                          onSegmentClick &&
                          isCalendarSegmentClickable(segment.status)
                            ? () => onSegmentClick(segment)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export type { CalendarBookingSegment };
