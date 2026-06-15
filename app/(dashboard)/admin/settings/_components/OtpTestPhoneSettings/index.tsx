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

import { PermissionGate } from '@/components/atoms/PermissionGate';
import { TabGroup } from '@/components/molecules/TabGroup';
import { OTP_TEST_PHONES } from '@/lib/strings';
import { OTP_TEST_USER_GRANTS } from '@/lib/strings/otp-test-user-grants';

import { OtpTestPhoneRegistrySettings } from './OtpTestPhoneRegistrySettings';
import { OtpTestUserGrantSettings } from './OtpTestUserGrantSettings';

const otpTestSubTabs = [
  { label: OTP_TEST_PHONES.SECTION_TITLE, value: 'registry' },
  { label: OTP_TEST_USER_GRANTS.SUB_TAB_LABEL, value: 'grants' },
];

export function OtpTestPhoneSettings() {
  const [subTab, setSubTab] = useState('registry');

  return (
    <PermissionGate roles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <TabGroup tabs={otpTestSubTabs} active={subTab} onChange={setSubTab} />
        {subTab === 'registry' && <OtpTestPhoneRegistrySettings />}
        {subTab === 'grants' && <OtpTestUserGrantSettings />}
      </div>
    </PermissionGate>
  );
}
