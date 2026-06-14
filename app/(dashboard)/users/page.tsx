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

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
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
import { ProvisionPlayerDialog } from './_components/ProvisionPlayerDialog';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showProvisionDialog, setShowProvisionDialog] = useState(false);
  const router = useRouter();

  const {
    users,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  } = useAdminUsers({
    searchQuery,
    pagination: { limit: PAGE_SIZE },
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
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
          <PermissionGate feature="player_provision">
            <Button
              size="sm"
              variant="secondary"
              iconLeft="phone-portrait-outline"
              onClick={() => setShowProvisionDialog(true)}
            >
              Đăng ký hộ Player
            </Button>
          </PermissionGate>
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

      <ConnectionPager
        loadedCount={users.length}
        totalCount={totalCount ?? total}
        hasNextPage={hasNextPage}
        onNext={() => void loadMore()}
        loading={loading}
        className="mt-4"
      />

      {/* Create User Dialog */}
      <CreateUserDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={handleCreateSuccess}
      />

      <ProvisionPlayerDialog
        open={showProvisionDialog}
        onClose={() => setShowProvisionDialog(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
