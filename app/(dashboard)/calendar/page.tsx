'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { TabGroup } from '@/components/molecules/TabGroup';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { CalendarGrid } from './_components/CalendarGrid';
import { VenueFilter } from './_components/VenueFilter';
import { mockCalendarBookings, mockVenues } from '@/lib/mock-data';

const viewTabs = [
  { label: 'Ngày', value: 'day' },
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
];

export default function CalendarPage() {
  const [view, setView] = useState('day');
  const allCourts = mockVenues.flatMap((v) =>
    v.courts.map((c) => `${v.group.split('(')[0].trim()} - ${c}`)
  );
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(allCourts)
  );

  const handleToggle = (court: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(court)) next.delete(court);
      else next.add(court);
      return next;
    });
  };

  const flatVenues = mockVenues.map((v) => ({
    group: v.group,
    courts: v.courts.map((c) => `${v.group.split('(')[0].trim()} - ${c}`),
  }));

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Lịch đặt sân"
          description="Quản lý lịch đặt sân theo ngày."
        />
        <div className="flex items-center gap-3">
          <TabGroup tabs={viewTabs} active={view} onChange={setView} />
          {/* Date navigation */}
          <div className="flex items-center gap-1">
            <button className="hover:bg-surface-hover rounded-lg p-1.5 text-slate-400 hover:text-white">
              <IonIcon name="chevron-back-outline" size="sm" />
            </button>
            <span className="min-w-[120px] text-center text-sm font-medium text-white">
              20 Th10, 2023
            </span>
            <button className="hover:bg-surface-hover rounded-lg p-1.5 text-slate-400 hover:text-white">
              <IonIcon name="chevron-forward-outline" size="sm" />
            </button>
          </div>
          <Button size="sm" iconLeft="add-outline">
            Đặt sân mới
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <VenueFilter
          venues={flatVenues}
          selected={selected}
          onToggle={handleToggle}
        />
        <GlassPanel card>
          <CalendarGrid
            courts={Array.from(selected)}
            bookings={mockCalendarBookings.map((b) => ({
              ...b,
              court: `${b.venue.includes('A') ? 'HITRI Center A' : 'HITRI Center B'} - ${b.court}`,
            }))}
          />
        </GlassPanel>
      </div>
    </>
  );
}
