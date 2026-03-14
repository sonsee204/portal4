'use client';

import { useState, useCallback } from 'react';
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
import { PermissionGate } from '@/components/atoms/PermissionGate';
import { QueryState } from '@/components/molecules/QueryState';
import { useAdminUsers } from '@/hooks/admin';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import type { UserRole, User } from '@/types';
import { CreateUserDialog } from './_components/CreateUserDialog';

const PAGE_SIZE = 20;

function getRoleBadgeVariant(
  role: UserRole
): 'info' | 'success' | 'warning' | 'neutral' | 'danger' {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'danger';
    case 'ADMIN':
      return 'info';
    case 'FACILITY_OWNER':
      return 'success';
    case 'PLAYER':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function getStatusBadge(user: User) {
  if (user.isSuspended)
    return { variant: 'danger' as const, label: 'Bị khóa', dot: true };
  if (user.isActive)
    return { variant: 'success' as const, label: 'Hoạt động', dot: true };
  return { variant: 'neutral' as const, label: 'Không hoạt động', dot: true };
}

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const router = useRouter();

  const { users, total, loading, error, refetch } = useAdminUsers({
    searchQuery,
    pagination: { page, limit: PAGE_SIZE },
  });
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleCreateSuccess = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <>
      <PageHeader
        title="Quản lý người dùng"
        description={`Tổng cộng ${total} người dùng trong hệ thống.`}
      >
        <div className="flex items-center gap-3">
          <SearchInput
            placeholder="Tìm người dùng..."
            wrapperClassName="w-56"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <PermissionGate
            features={['admin_creation', 'facility_owner_creation']}
          >
            <Button
              size="sm"
              iconLeft="person-add-outline"
              onClick={() => setShowCreateDialog(true)}
            >
              Tạo tài khoản
            </Button>
          </PermissionGate>
        </div>
      </PageHeader>

      <div className="mt-6">
        <QueryState
          loading={loading && users.length === 0}
          error={error}
          empty={!loading && users.length === 0}
          emptyMessage="Không có người dùng nào"
          emptyIcon="people-outline"
          onRetry={() => void refetch()}
        >
          <DataTable
            columns={[
              { key: 'name', label: 'Người dùng', sortable: true },
              { key: 'role', label: 'Vai trò' },
              { key: 'status', label: 'Trạng thái' },
              { key: 'origin', label: 'Nguồn gốc' },
              { key: 'lastLogin', label: 'Đăng nhập cuối' },
              { key: 'actions', label: '' },
            ]}
            data={users}
            renderRow={(u: User) => {
              const status = getStatusBadge(u);
              return (
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
                        name={u.fullName}
                        subtitle={u.email}
                        src={u.photoURL}
                      />
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getRoleBadgeVariant(u.role)}>
                      {ROLE_DISPLAY_NAMES[u.role] || u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={status.variant} dot={status.dot}>
                      {status.label}
                    </Badge>
                  </td>
                  <td className="text-muted px-4 py-3 text-sm">
                    {u.accountOrigin === 'ADMIN_CREATED'
                      ? 'Admin tạo'
                      : 'Tự đăng ký'}
                  </td>
                  <td className="text-muted px-4 py-3 text-sm">
                    {u.lastLoginAt
                      ? new Date(u.lastLoginAt).toLocaleDateString('vi-VN')
                      : 'Chưa đăng nhập'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <IconButton
                        icon="eye-outline"
                        size="sm"
                        tooltip="Xem chi tiết"
                        onClick={() => router.push(`/users/${u._id}`)}
                      />
                    </div>
                  </td>
                </tr>
              );
            }}
          />
        </QueryState>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
          className="mt-4"
        />
      )}

      {/* Create User Dialog */}
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
