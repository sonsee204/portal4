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
import { ProfileSettings } from '@/app/(dashboard)/admin/settings/_components/ProfileSettings';
import { ChangePasswordForm } from './_components/ChangePasswordForm';
import { AUTH } from '@/lib/strings';

const profileTabs = [
  { label: 'Thông tin', value: 'profile' },
  { label: AUTH.CHANGE_PASSWORD.TAB_LABEL, value: 'security' },
];

export default function ProfilePage() {
  const [tab, setTab] = useState('profile');

  return (
    <>
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Chỉnh sửa thông tin cá nhân và bảo mật tài khoản của bạn."
      />

      <TabGroup
        tabs={profileTabs}
        active={tab}
        onChange={setTab}
        className="mt-6"
      />

      <div className="mt-6">
        {tab === 'profile' && <ProfileSettings />}
        {tab === 'security' && <ChangePasswordForm />}
      </div>
    </>
  );
}
