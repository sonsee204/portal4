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
import { PageHeader } from '@/components/organisms/PageHeader';
import { TabGroup } from '@/components/molecules/TabGroup';
import { useAccessControlData } from './_hooks/useAccessControlData';
import { useAccessControlActions } from './_hooks/useAccessControlActions';
import { RoleManagementSection } from './_sections/RoleManagementSection';
import { CapabilityGrantsSection } from './_sections/CapabilityGrantsSection';
import { ChangeRoleDialog } from './_components/ChangeRoleDialog';

const tabs = [
  { label: 'Vai trò & Super Admin', value: 'roles' },
  { label: 'Quyền Portal (Organizer)', value: 'capabilities' },
];

export default function AccessControlPage() {
  const [tab, setTab] = useState('roles');
  const data = useAccessControlData();
  const actions = useAccessControlActions(data);

  return (
    <>
      <PageHeader
        title="Phân quyền hệ thống"
        description="Quản lý vai trò, Super Admin và quyền portal — chỉ Owner."
      />

      <TabGroup tabs={tabs} active={tab} onChange={setTab} className="mt-6" />

      <div className="mt-6">
        {tab === 'roles' && (
          <RoleManagementSection data={data} actions={actions} />
        )}
        {tab === 'capabilities' && <CapabilityGrantsSection />}
      </div>

      <ChangeRoleDialog
        open={data.changeRoleUser !== null}
        user={data.changeRoleUser}
        onClose={() => data.setChangeRoleUser(null)}
        onSuccess={actions.handleRoleChangeSuccess}
      />
    </>
  );
}
