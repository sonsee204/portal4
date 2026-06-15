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
import { PermissionGate } from '@/components/atoms/PermissionGate';
import { AppearanceSettings } from './_components/AppearanceSettings';
import { OtpTestPhoneSettings } from './_components/OtpTestPhoneSettings';
import { OTP_TEST_PHONES } from '@/lib/strings';

const settingsTabs = [
  { label: 'Giao diện', value: 'appearance' },
  { label: OTP_TEST_PHONES.TAB_LABEL, value: 'otp-test' },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('appearance');

  return (
    <>
      <PageHeader
        title="Cài đặt hệ thống"
        description="Cấu hình giao diện và công cụ kiểm thử OTP."
      />

      <TabGroup
        tabs={settingsTabs}
        active={tab}
        onChange={setTab}
        className="mt-6"
      />

      <div className="mt-6">
        {tab === 'appearance' && <AppearanceSettings />}

        {tab === 'otp-test' && (
          <PermissionGate permission="system.settings">
            <OtpTestPhoneSettings />
          </PermissionGate>
        )}
      </div>
    </>
  );
}
