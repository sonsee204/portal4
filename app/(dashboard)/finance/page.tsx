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
import { mockTransactions } from '@/lib/mock-data';
import type { TransactionStatus } from '@/types/portal';

const statusVariant: Record<
  TransactionStatus,
  'success' | 'warning' | 'danger'
> = {
  success: 'success',
  pending: 'warning',
  failed: 'danger',
};

const typeTabs = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Nạp tiền', value: 'deposit' },
  { label: 'Rút tiền', value: 'withdrawal' },
];

export default function FinancePage() {
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = mockTransactions.filter(
    (t) => typeFilter === 'all' || t.type === typeFilter
  );

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
          <Button size="sm" iconLeft="add-outline">
            Nạp tiền thủ công
          </Button>
        </div>
      </PageHeader>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon="trending-up-outline"
          iconColor="text-emerald-400"
          label="Doanh thu tháng"
          value="142,500,000 ₫"
          trend={{ value: '+5.2%', direction: 'up' }}
        />
        <StatCard
          icon="hourglass-outline"
          iconColor="text-amber-400"
          label="Đang chờ xử lý"
          value="12,300,000 ₫"
          trend={{ value: '3 giao dịch', direction: 'neutral' }}
        />
        <StatCard
          icon="wallet-outline"
          iconColor="text-blue-400"
          label="Lợi nhuận ròng"
          value="98,200,000 ₫"
          trend={{ value: '+8.1%', direction: 'up' }}
        />
      </div>

      {/* Transaction table */}
      <GlassPanel card className="mt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabGroup
            tabs={typeTabs}
            active={typeFilter}
            onChange={setTypeFilter}
          />
          <Button variant="ghost" size="sm" iconLeft="download-outline">
            Export CSV
          </Button>
        </div>

        <div className="mt-4">
          <DataTable
            columns={[
              { key: 'id', label: 'Mã GD', sortable: true },
              { key: 'user', label: 'Người dùng' },
              { key: 'amount', label: 'Số tiền', sortable: true },
              { key: 'datetime', label: 'Thời gian' },
              { key: 'status', label: 'Trạng thái' },
              { key: 'actions', label: '' },
            ]}
            data={filtered}
            renderRow={(t) => (
              <tr
                key={t._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-400">
                  {t._id}
                </td>
                <td className="px-4 py-3">
                  <UserCell name={t.userName} subtitle={t.memberType} />
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      t.type === 'deposit'
                        ? 'font-medium text-emerald-400'
                        : 'font-medium text-red-400'
                    }
                  >
                    {t.type === 'deposit' ? '+' : '-'}
                    {new Intl.NumberFormat('vi-VN').format(
                      Math.abs(t.amount)
                    )}{' '}
                    ₫
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  <div>{t.date}</div>
                  <div className="text-slate-500">{t.time}</div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
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
        </div>
      </GlassPanel>

      <Pagination
        currentPage={page}
        totalPages={10}
        totalItems={98}
        pageSize={10}
        onPageChange={setPage}
        className="mt-4"
      />
    </>
  );
}
