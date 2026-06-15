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

import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { SearchInput } from '@/components/molecules/SearchInput';
import { PermissionGate } from '@/components/atoms/PermissionGate';
import type { UsersPageActions } from '../_hooks/useUsersPageActions';
import type { UsersPageData } from '../_hooks/useUsersPageData';

interface UsersHeaderSectionProps {
  data: UsersPageData;
  actions: UsersPageActions;
}

export function UsersHeaderSection({ data, actions }: UsersHeaderSectionProps) {
  const { total, setShowCreateDialog, setShowProvisionDialog } = data;

  return (
    <PageHeader
      title="Quản lý người dùng"
      description={`Tổng cộng ${total} người dùng trong hệ thống.`}
    >
      <div className="flex items-center gap-3">
        <SearchInput
          placeholder="Tìm người dùng..."
          wrapperClassName="w-56"
          onChange={(e) => actions.handleSearch(e.target.value)}
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
        <PermissionGate features={['admin_creation', 'facility_owner_creation']}>
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
  );
}
