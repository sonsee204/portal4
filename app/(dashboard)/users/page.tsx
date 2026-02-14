'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { Pagination } from '@/components/organisms/Pagination';
import { UserCell } from '@/components/molecules/UserCell';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { SearchInput } from '@/components/molecules/SearchInput';
import { mockUsers } from '@/lib/mock-data';
import type { UserStatus, UserRole } from '@/types/portal';

const statusVariant: Record<
  UserStatus,
  'success' | 'warning' | 'danger' | 'neutral'
> = {
  active: 'success',
  inactive: 'neutral',
  pending: 'warning',
  banned: 'danger',
};

const roleVariant: Record<
  UserRole,
  'info' | 'success' | 'warning' | 'neutral' | 'danger'
> = {
  admin: 'danger',
  partner: 'info',
  user: 'neutral',
  coach: 'success',
  moderator: 'warning',
};

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Quản lý người dùng"
        description="Danh sách tất cả người dùng trong hệ thống."
      >
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Tìm người dùng..."
            wrapperClassName="w-56"
          />
          <Button variant="ghost" size="sm" iconLeft="funnel-outline">
            Bộ lọc
          </Button>
          <Button size="sm" iconLeft="add-outline">
            Thêm mới
          </Button>
        </div>
      </PageHeader>

      <div className="mt-6">
        <DataTable
          columns={[
            { key: 'name', label: 'Người dùng', sortable: true },
            { key: 'role', label: 'Vai trò' },
            { key: 'status', label: 'Trạng thái' },
            { key: 'lastLogin', label: 'Lần đăng nhập cuối' },
            { key: 'actions', label: '' },
          ]}
          data={mockUsers}
          renderRow={(u) => (
            <tr
              key={u._id}
              className="border-surface-border hover:bg-surface-hover border-b transition-colors"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/users/${u._id}`}
                  className="block cursor-pointer hover:opacity-90"
                >
                  <UserCell
                    name={u.name}
                    subtitle={u.email}
                    status={u.online ? 'online' : undefined}
                  />
                </Link>
              </td>
              <td className="px-4 py-3">
                <Badge variant={roleVariant[u.role]}>{u.role}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={statusVariant[u.status]} dot>
                  {u.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-slate-400">
                {u.lastLogin}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <IconButton
                    icon="eye-outline"
                    size="sm"
                    tooltip="Xem chi tiết"
                    onClick={() => router.push(`/users/${u._id}`)}
                  />
                  <IconButton
                    icon="create-outline"
                    size="sm"
                    tooltip="Chỉnh sửa"
                  />
                  <IconButton icon="ellipsis-vertical-outline" size="sm" />
                </div>
              </td>
            </tr>
          )}
        />
      </div>

      <Pagination
        currentPage={page}
        totalPages={5}
        totalItems={mockUsers.length}
        pageSize={10}
        onPageChange={setPage}
        className="mt-4"
      />
    </>
  );
}
