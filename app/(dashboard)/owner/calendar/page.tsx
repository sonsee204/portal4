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

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { QueryState } from '@/components/molecules/QueryState';
import { CalendarGrid } from '@/app/(dashboard)/admin/calendar/_components/CalendarGrid';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';
import { useMyVenues, useVenueBookings } from '@/hooks/owner';

function formatDateForQuery(date: Date): string {
  return date.toISOString().split('T')[0];
}

function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function OwnerCalendarPage() {
  const { venues } = useMyVenues({ limit: 50 });
  const [venueId, setVenueId] = useState('');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const effectiveVenueId = venueId || venues[0]?._id || null;
  const dateStr = formatDateForQuery(currentDate);

  const { bookings, loading, error, refetch } = useVenueBookings(
    effectiveVenueId,
    { fromDate: dateStr, toDate: dateStr },
    { limit: CURSOR_PAGE_MAX }
  );

  const venueOptions = useMemo(
    () => venues.map((v) => ({ label: v.name, value: v._id })),
    [venues]
  );

  const courts = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b) => {
      b.slots?.forEach((s) => {
        if (s.courtName) set.add(s.courtName);
      });
    });
    return Array.from(set).sort();
  }, [bookings]);

  const calendarBookings = useMemo(
    () =>
      bookings.flatMap((b) =>
        (b.slots ?? []).map((slot) => {
          const startHour = slot.startTime
            ? parseInt(slot.startTime.split(':')[0], 10)
            : 0;
          const endHour = slot.endTime
            ? parseInt(slot.endTime.split(':')[0], 10)
            : startHour + 1;
          return {
            _id: `${b._id}-${slot.courtName}-${slot.startTime}`,
            court: slot.courtName,
            startHour,
            endHour,
            status: (b.status.toLowerCase() === 'confirmed'
              ? 'paid'
              : b.status.toLowerCase()) as 'paid' | 'pending' | 'maintenance',
            userName: b.customer?.displayName ?? '',
            venue: '',
          };
        })
      ),
    [bookings]
  );

  const navigateDate = (delta: number) => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + delta);
      return next;
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Lịch sân"
          description="Xem lịch đặt sân theo ngày cho từng cơ sở."
        />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateDate(-1)}
              className="hover:bg-surface-hover text-muted hover:text-heading rounded-lg p-1.5"
            >
              <IonIcon name="chevron-back-outline" size="sm" />
            </button>
            <span className="text-heading min-w-[120px] text-center text-sm font-medium">
              {formatDateDisplay(currentDate)}
            </span>
            <button
              onClick={() => navigateDate(1)}
              className="hover:bg-surface-hover text-muted hover:text-heading rounded-lg p-1.5"
            >
              <IonIcon name="chevron-forward-outline" size="sm" />
            </button>
          </div>
          <Button
            size="sm"
            variant="ghost"
            iconLeft="today-outline"
            onClick={() => setCurrentDate(new Date())}
          >
            Hôm nay
          </Button>
        </div>
      </div>

      <GlassPanel card className="mt-6 space-y-4">
        {venueOptions.length > 0 && (
          <Select
            label="Chọn sân"
            options={venueOptions}
            value={effectiveVenueId ?? ''}
            onChange={(e) => setVenueId(e.target.value)}
          />
        )}

        <QueryState
          loading={loading && !effectiveVenueId}
          error={error}
          empty={!effectiveVenueId}
          emptyMessage="Chọn sân để xem lịch."
          onRetry={() => void refetch()}
        >
          <CalendarGrid courts={courts} bookings={calendarBookings} />
        </QueryState>
      </GlassPanel>
    </>
  );
}
