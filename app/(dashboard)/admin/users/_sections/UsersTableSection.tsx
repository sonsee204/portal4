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

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { UserCell } from '@/components/molecules/UserCell';
import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import { QueryState } from '@/components/molecules/QueryState';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import type { User } from '@/types';
import {
  getRoleBadgeVariant,
  getStatusBadge,
} from '../_hooks/users-page.derived';
import type { UsersPageData } from '../_hooks/useUsersPageData';

interface UsersTableSectionProps {
  data: UsersPageData;
}

export function UsersTableSection({ data }: UsersTableSectionProps) {
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
  } = data;

  return (
    <>
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
    </>
  );
}
