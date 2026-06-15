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

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { StatCard } from '@/components/molecules/StatCard';
import { TabGroup } from '@/components/molecules/TabGroup';
import { FilterChips } from '@/components/molecules/FilterChips';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { Button } from '@/components/atoms/Button';
import { ProfileCard } from './_components/ProfileCard';
import { PortalAccessSection } from './_sections/PortalAccessSection';
import { BookingCard } from './_components/BookingCard';
import { QueryState } from '@/components/molecules/QueryState';
import { COMMON } from '@/lib/strings';
import { useAdminUserBookings, type AdminBooking } from '@/hooks/admin';
import { useUserProfile } from '@/hooks/user';

const detailTabs = [{ label: 'Lịch sử đặt sân', value: 'bookings' }];

const BOOKING_PAGE_SIZE = 6;

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string | undefined;
  const [tab, setTab] = useState('bookings');
  const [filter, setFilter] = useState('all');

  const { user, loading, error, refetch } = useUserProfile(userId);

  const {
    bookings: userBookings,
    total: bookingTotal,
    totalCount: bookingTotalCount,
    hasNextPage: bookingsHasNextPage,
    loadMore: loadMoreBookings,
    loading: bookingsLoading,
  } = useAdminUserBookings(
    userId ?? '',
    {
      statuses: filter === 'all' ? undefined : [filter],
      pagination: { limit: BOOKING_PAGE_SIZE },
    },
    { skip: !userId || tab !== 'bookings' }
  );

  if (!userId) {
    return (
      <PageHeader title="Chi tiết người dùng" description="ID không hợp lệ">
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/admin/users')}
        >
          Quay lại
        </Button>
      </PageHeader>
    );
  }

  return (
    <>
      <QueryState
        loading={loading && !user}
        error={error}
        empty={!loading && !error && !user}
        emptyMessage="Không tìm thấy người dùng"
        onRetry={() => void refetch()}
      >
        {user && (
          <>
            <PageHeader
              title="Chi tiết người dùng"
              description={user.displayName || user.fullName}
            >
              <Button
                variant="ghost"
                size="sm"
                iconLeft="arrow-back-outline"
                onClick={() => router.push('/admin/users')}
              >
                Quay lại
              </Button>
            </PageHeader>

            <div className="mt-6 grid gap-6 lg:grid-cols-12">
              {/* Left panel */}
              <div className="space-y-6 lg:col-span-3">
                <ProfileCard user={user} />
                <PortalAccessSection
                  userId={user._id}
                  userDisplayName={user.displayName || user.fullName}
                  activeCapabilities={user.portalCapabilities}
                />
              </div>

              {/* Right panel */}
              <div className="space-y-6 lg:col-span-9">
                {/* Stats row */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <StatCard
                    icon="calendar-outline"
                    iconColor="text-primary"
                    label="Tổng đặt sân"
                    value={String(bookingTotal)}
                  />
                  <StatCard
                    icon="trophy-outline"
                    iconColor="text-blue-400"
                    label="Giải đấu"
                    value="—"
                  />
                  <StatCard
                    icon="wallet-outline"
                    iconColor="text-emerald-400"
                    label="Ví điện tử"
                    value="—"
                  />
                </div>

                {/* Tabs */}
                <TabGroup tabs={detailTabs} active={tab} onChange={setTab} />

                {/* Tab content */}
                {tab === 'bookings' && (
                  <div className="space-y-4">
                    <FilterChips
                      chips={[
                        { label: 'Tất cả', value: 'all' },
                        { label: 'Hoàn thành', value: 'COMPLETED' },
                        { label: 'Đã hủy', value: 'CANCELLED' },
                        { label: 'Chờ xử lý', value: 'PENDING' },
                        { label: 'Đã xác nhận', value: 'CONFIRMED' },
                      ]}
                      active={filter}
                      onChange={(v) => {
                        setFilter(v);
                      }}
                    />
                    {bookingsLoading && userBookings.length === 0 ? (
                      <div className="flex justify-center py-12">
                        <p className="text-faint text-sm">{COMMON.LOADING}</p>
                      </div>
                    ) : userBookings.length > 0 ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {userBookings.map((b: AdminBooking) => (
                          <BookingCard
                            key={b._id}
                            booking={{
                              _id: b._id,
                              venue: b.venueName,
                              location: b.venueAddress,
                              date: b.date,
                              time: b.timeSlots,
                              status: b.status,
                              courtName: b.courtName,
                            }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="border-surface-border flex items-center justify-center rounded-xl border border-dashed py-16">
                        <p className="text-faint text-sm">
                          Chưa có lịch sử đặt sân.
                        </p>
                      </div>
                    )}
                    <ConnectionPager
                      loadedCount={userBookings.length}
                      totalCount={bookingTotalCount ?? bookingTotal}
                      hasNextPage={bookingsHasNextPage}
                      onNext={() => void loadMoreBookings()}
                      loading={bookingsLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </QueryState>
    </>
  );
}
