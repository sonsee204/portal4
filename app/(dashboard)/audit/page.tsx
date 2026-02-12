'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { Pagination } from '@/components/organisms/Pagination';
import { FilterChips } from '@/components/molecules/FilterChips';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { IconButton } from '@/components/atoms/IconButton';
import { mockAuditLogs } from '@/lib/mock-data';
import type { AuditAction, AuditStatus } from '@/types/portal';

const actionVariant: Record<
  AuditAction,
  'danger' | 'info' | 'warning' | 'success' | 'neutral'
> = {
  lock_account: 'danger',
  auto_scale: 'info',
  delete_group: 'danger',
  update_profile: 'success',
  api_key_gen: 'warning',
  login: 'neutral',
  config_change: 'info',
};

const statusVariant: Record<AuditStatus, 'success' | 'danger'> = {
  success: 'success',
  failed: 'danger',
};

const eventFilters = [
  { label: 'Tất cả', value: 'all', count: 5 },
  { label: 'Lỗi', value: 'failed', count: 1 },
  { label: 'Bảo mật', value: 'security', count: 2 },
];

export default function AuditPage() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = mockAuditLogs.filter((l) => {
    if (filter === 'all') return true;
    if (filter === 'failed') return l.status === 'failed';
    if (filter === 'security')
      return ['lock_account', 'api_key_gen', 'login'].includes(l.action);
    return true;
  });

  return (
    <>
      <PageHeader
        title="Audit Logs"
        description="Theo dõi mọi hoạt động admin trong hệ thống."
      >
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" iconLeft="download-outline">
            Export CSV
          </Button>
          <Button variant="ghost" size="sm" iconLeft="refresh-outline">
            Làm mới
          </Button>
        </div>
      </PageHeader>

      <FilterChips
        chips={eventFilters}
        active={filter}
        onChange={setFilter}
        className="mt-6"
      />

      <div className="mt-4">
        <DataTable
          columns={[
            { key: 'check', label: '' },
            { key: 'admin', label: 'Admin' },
            { key: 'action', label: 'Hành động' },
            { key: 'target', label: 'Đối tượng' },
            { key: 'ip', label: 'IP' },
            { key: 'timestamp', label: 'Thời gian', sortable: true },
            { key: 'status', label: 'Trạng thái' },
            { key: 'actions', label: '' },
          ]}
          data={filtered}
          renderRow={(log) => (
            <tr
              key={log._id}
              className="border-surface-border hover:bg-surface-hover border-b transition-colors"
            >
              <td className="px-4 py-3">
                <Checkbox />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                    {log.adminInitials}
                  </div>
                  <span className="text-sm text-white">{log.adminName}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={actionVariant[log.action] ?? 'neutral'}>
                  {log.actionLabel}
                </Badge>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                {log.target}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-500">
                {log.ip}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-400">
                {log.timestamp}
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[log.status]}>{log.status}</Badge>
              </td>
              <td className="px-4 py-3">
                <IconButton icon="eye-outline" size="sm" tooltip="Chi tiết" />
              </td>
            </tr>
          )}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={8}
        totalItems={75}
        pageSize={10}
        onPageChange={setPage}
        className="mt-4"
      />
    </>
  );
}
