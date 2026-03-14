'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { Pagination } from '@/components/organisms/Pagination';
import { StatCard } from '@/components/molecules/StatCard';
import { UserCell } from '@/components/molecules/UserCell';
import { TabGroup } from '@/components/molecules/TabGroup';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { EmptyState } from '@/components/molecules/EmptyState';
import { QueryState } from '@/components/molecules/QueryState';
import { formatCurrency } from '@/lib/utils';
import { COMMON } from '@/lib/strings';
import {
  BOOKING_STATUS_VARIANT,
  BOOKING_STATUS_LABEL,
} from '@/lib/constants/booking-status';
import {
  useSystemStats,
  useAdminAllBookings,
  type AdminBooking,
} from '@/hooks/admin';

const statusTabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hoàn thành', value: 'COMPLETED' },
  { label: 'Đã xác nhận', value: 'CONFIRMED' },
  { label: 'Chờ xử lý', value: 'PENDING' },
  { label: 'Đã hủy', value: 'CANCELLED' },
];

const PAGE_SIZE = 10;

export default function FinancePage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { stats } = useSystemStats();
  const { bookings, customerNames, total, loading, error, refetch } =
    useAdminAllBookings({
      statuses: statusFilter === 'all' ? undefined : [statusFilter],
      pagination: { page, limit: PAGE_SIZE },
    });

  return (
    <>
      <PageHeader
        title="Quản lý Tài chính"
        description="Theo dõi doanh thu, giao dịch và báo cáo tài chính."
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" iconLeft="calendar-outline">
            Bộ lọc ngày
          </Button>
        </div>
      </PageHeader>

      <QueryState
        loading={loading && bookings.length === 0}
        error={error}
        onRetry={() => void refetch()}
      >
        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon="trending-up-outline"
            iconColor="text-emerald-400"
            label="Tổng doanh thu"
            value={formatCurrency(stats?.totalRevenue ?? 0)}
          />
          <StatCard
            icon="receipt-outline"
            iconColor="text-amber-400"
            label="Tổng đặt sân"
            value={String(stats?.totalBookings ?? 0)}
          />
          <StatCard
            icon="business-outline"
            iconColor="text-blue-400"
            label="Sân hoạt động"
            value={String(stats?.activeVenues ?? 0)}
          />
        </div>

        {/* Transaction table */}
        <GlassPanel card className="mt-6">
          <TabGroup
            tabs={statusTabs}
            active={statusFilter}
            onChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          />

          <div className="mt-4">
            {loading && bookings.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="text-muted text-sm">{COMMON.LOADING}</div>
              </div>
            ) : bookings.length === 0 ? (
              <EmptyState
                icon="receipt-outline"
                title="Chưa có giao dịch"
                description="Không tìm thấy giao dịch nào phù hợp với bộ lọc."
              />
            ) : (
              <DataTable
                columns={[
                  { key: 'id', label: 'Mã GD', sortable: true },
                  { key: 'user', label: 'Khách hàng' },
                  { key: 'venue', label: 'Cụm sân' },
                  { key: 'amount', label: 'Số tiền', sortable: true },
                  { key: 'date', label: 'Ngày' },
                  { key: 'status', label: 'Trạng thái' },
                  { key: 'actions', label: '' },
                ]}
                data={bookings}
                renderRow={(b: AdminBooking) => (
                  <tr
                    key={b._id}
                    className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                  >
                    <td className="text-muted px-4 py-3 font-mono text-xs">
                      {b._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <UserCell
                        name={customerNames[b._id] || 'N/A'}
                        subtitle={b.courtName}
                      />
                    </td>
                    <td className="text-body px-4 py-3 text-sm">
                      {b.venueName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-emerald-400">
                        {formatCurrency(b.totalPrice)}
                      </span>
                    </td>
                    <td className="text-muted px-4 py-3 text-xs">
                      <div>{b.date}</div>
                      <div className="text-faint">{b.timeSlots}</div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={BOOKING_STATUS_VARIANT[b.status] ?? 'neutral'}
                      >
                        {BOOKING_STATUS_LABEL[b.status] ?? b.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <IconButton
                        icon="eye-outline"
                        size="sm"
                        tooltip="Xem chi tiết"
                      />
                    </td>
                  </tr>
                )}
              />
            )}
          </div>
        </GlassPanel>

        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            className="mt-4"
          />
        )}
      </QueryState>
    </>
  );
}
