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

import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { UserCell } from '@/components/molecules/UserCell';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { SearchInput } from '@/components/molecules/SearchInput';
import { FilterChips } from '@/components/molecules/FilterChips';
import { QueryState } from '@/components/molecules/QueryState';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import type { User } from '@/types';
import type { AccessControlData } from '../_hooks/useAccessControlData';
import type { AccessControlActions } from '../_hooks/useAccessControlActions';

interface RoleManagementSectionProps {
  data: AccessControlData;
  actions: AccessControlActions;
}

function getRoleBadgeVariant(role: string) {
  if (role === 'SUPER_ADMIN') return 'danger' as const;
  if (role === 'ADMIN') return 'info' as const;
  if (role === 'FACILITY_OWNER') return 'warning' as const;
  return 'neutral' as const;
}

export function RoleManagementSection({ data }: RoleManagementSectionProps) {
  const {
    users,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    setChangeRoleUser,
  } = data;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm theo tên, email, SĐT..."
          className="max-w-md"
        />
        <FilterChips
          chips={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Super Admin', value: 'SUPER_ADMIN' },
            { label: 'Admin', value: 'ADMIN' },
            { label: 'Chủ sân', value: 'FACILITY_OWNER' },
            { label: 'Player', value: 'PLAYER' },
          ]}
          active={roleFilter}
          onChange={setRoleFilter}
        />
      </div>

      <QueryState
        loading={loading && users.length === 0}
        error={error}
        empty={!loading && users.length === 0}
        emptyMessage="Không có người dùng phù hợp"
        onRetry={() => void refetch()}
      >
        <DataTable
          columns={[
            { key: 'name', label: 'Người dùng' },
            { key: 'role', label: 'Vai trò' },
            { key: 'phone', label: 'Số điện thoại' },
            { key: 'actions', label: '', align: 'right' },
          ]}
          data={users}
          renderRow={(u: User & { isOwner?: boolean }) => {
            const isOwnerAccount = u.isOwner === true;
            return (
              <tr
                key={u._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="px-4 py-3">
                  <UserCell
                    name={u.fullName}
                    subtitle={u.email}
                    src={u.photoURL}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getRoleBadgeVariant(u.role)}>
                      {ROLE_DISPLAY_NAMES[u.role] ?? u.role}
                    </Badge>
                    {isOwnerAccount && <Badge variant="danger">OWNER</Badge>}
                  </div>
                </td>
                <td className="text-muted px-4 py-3 text-sm">
                  {u.phone ?? '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={isOwnerAccount}
                    onClick={() =>
                      setChangeRoleUser({
                        _id: u._id,
                        fullName: u.fullName,
                        role: u.role,
                        isOwner: u.isOwner,
                      })
                    }
                  >
                    Đổi vai trò
                  </Button>
                </td>
              </tr>
            );
          }}
        />
        <ConnectionPager
          loadedCount={users.length}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          onNext={() => void loadMore()}
          loading={loading}
        />
      </QueryState>
    </div>
  );
}
