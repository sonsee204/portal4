'use client';

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { TabGroup } from '@/components/molecules/TabGroup';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { CalendarGrid } from './_components/CalendarGrid';
import { VenueFilter } from './_components/VenueFilter';
import { QueryState } from '@/components/molecules/QueryState';
import { COMMON } from '@/lib/strings';
import { useAdminAllBookings } from '@/hooks/admin';

const CALENDAR_BOOKING_LIMIT = 100;

const viewTabs = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
];

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

export default function CalendarPage() {
  const [view, setView] = useState('day');
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const dateStr = formatDateForQuery(currentDate);

  const { bookings, loading, error, refetch } = useAdminAllBookings({
    fromDate: dateStr,
    toDate: dateStr,
    pagination: { page: 1, limit: CALENDAR_BOOKING_LIMIT },
  });

  const courts = useMemo(() => {
    const set = new Set<string>();
    bookings.forEach((b: { venueName: string; courtName: string }) => {
      if (b.courtName) set.add(`${b.venueName} - ${b.courtName}`);
    });
    return Array.from(set).sort();
  }, [bookings]);

  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const effectiveSelected = selected.size > 0 ? selected : new Set(courts);

  const handleToggle = (court: string) => {
    setSelected((prev) => {
      const base = prev.size > 0 ? prev : new Set(courts);
      const next = new Set(base);
      if (next.has(court)) next.delete(court);
      else next.add(court);
      return next;
    });
  };

  const venueGroups = useMemo(() => {
    const map: Record<string, string[]> = {};
    courts.forEach((c) => {
      const parts = c.split(' - ');
      const venue = parts[0];
      const court = parts.slice(1).join(' - ');
      if (!map[venue]) map[venue] = [];
      map[venue].push(c);
    });
    return Object.entries(map).map(([group, cts]) => ({ group, courts: cts }));
  }, [courts]);

  const calendarBookings = useMemo(
    () =>
      bookings
        .filter((b: { venueName: string; courtName: string }) =>
          effectiveSelected.has(`${b.venueName} - ${b.courtName}`)
        )
        .map(
          (b: {
            _id: string;
            venueName: string;
            courtName: string;
            timeSlots: string;
            status: string;
          }) => {
            const [startTime] = (b.timeSlots || '').split(' - ');
            const startHour = startTime
              ? parseInt(startTime.split(':')[0], 10)
              : 0;
            const endPart = (b.timeSlots || '').split(' - ')[1];
            const endHour = endPart
              ? parseInt(endPart.split(':')[0], 10)
              : startHour + 1;
            return {
              _id: b._id,
              court: `${b.venueName} - ${b.courtName}`,
              startHour,
              endHour,
              status: (b.status.toLowerCase() === 'confirmed'
                ? 'paid'
                : b.status.toLowerCase()) as 'paid' | 'pending' | 'maintenance',
              userName: '',
              venue: b.venueName,
            };
          }
        ),
    [bookings, effectiveSelected]
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
          title="Lịch đặt sân"
          description="Quản lý lịch đặt sân theo ngày."
        />
        <div className="flex items-center gap-3">
          <TabGroup tabs={viewTabs} active={view} onChange={setView} />
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

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <VenueFilter
          venues={venueGroups}
          selected={effectiveSelected}
          onToggle={handleToggle}
        />
        <GlassPanel card>
          <QueryState
            loading={loading}
            error={error}
            onRetry={() => void refetch()}
          >
            <CalendarGrid
              courts={Array.from(effectiveSelected)}
              bookings={calendarBookings}
            />
          </QueryState>
        </GlassPanel>
      </div>
    </>
  );
}
