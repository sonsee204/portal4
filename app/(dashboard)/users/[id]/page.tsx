'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { StatCard } from '@/components/molecules/StatCard';
import { TabGroup } from '@/components/molecules/TabGroup';
import { FilterChips } from '@/components/molecules/FilterChips';
import { Pagination } from '@/components/organisms/Pagination';
import { Button } from '@/components/atoms/Button';
import { ProfileCard } from './_components/ProfileCard';
import { BookingCard } from './_components/BookingCard';
import { mockUsers, mockBookings } from '@/lib/mock-data';

const detailTabs = [
  { label: 'Lịch sử đặt sân', value: 'bookings' },
  { label: 'Giải đấu', value: 'tournaments' },
  { label: 'Giao dịch', value: 'transactions' },
];

const bookingFilters = [
  { label: 'Tất cả', value: 'all', count: 4 },
  { label: 'Hoàn thành', value: 'completed', count: 2 },
  { label: 'Đã hủy', value: 'cancelled', count: 1 },
  { label: 'Chờ xử lý', value: 'pending', count: 1 },
];

export default function UserDetailPage() {
  const [tab, setTab] = useState('bookings');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const user = mockUsers[0]; // Demo user

  return (
    <>
      <PageHeader title="Chi tiết người dùng" description={user.name}>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          href="/users"
        >
          Quay lại
        </Button>
      </PageHeader>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left panel */}
        <div className="lg:col-span-3">
          <ProfileCard user={user} />
        </div>

        {/* Right panel */}
        <div className="space-y-6 lg:col-span-9">
          {/* Stats row */}
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon="calendar-outline"
              iconColor="text-primary"
              label="Tổng đặt sân"
              value="47"
              trend={{ value: '+5', direction: 'up' }}
            />
            <StatCard
              icon="trophy-outline"
              iconColor="text-blue-400"
              label="Giải đấu"
              value="12"
            />
            <StatCard
              icon="wallet-outline"
              iconColor="text-emerald-400"
              label="Ví điện tử"
              value="2,450,000 ₫"
            />
          </div>

          {/* Tabs */}
          <TabGroup tabs={detailTabs} active={tab} onChange={setTab} />

          {/* Tab content */}
          {tab === 'bookings' && (
            <div className="space-y-4">
              <FilterChips
                chips={bookingFilters}
                active={filter}
                onChange={setFilter}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {mockBookings
                  .filter((b) => filter === 'all' || b.status === filter)
                  .map((b) => (
                    <BookingCard key={b._id} booking={b} />
                  ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={3}
                totalItems={47}
                pageSize={6}
                onPageChange={setPage}
              />
            </div>
          )}

          {tab === 'tournaments' && (
            <div className="border-surface-border flex items-center justify-center rounded-xl border border-dashed py-16">
              <p className="text-sm text-slate-500">
                Sẽ được cập nhật khi có dữ liệu giải đấu.
              </p>
            </div>
          )}

          {tab === 'transactions' && (
            <div className="border-surface-border flex items-center justify-center rounded-xl border border-dashed py-16">
              <p className="text-sm text-slate-500">
                Sẽ được cập nhật khi có dữ liệu giao dịch.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
