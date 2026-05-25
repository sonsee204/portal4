'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { TabGroup } from '@/components/molecules/TabGroup';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Toggle } from '@/components/atoms/Toggle';
import { Button } from '@/components/atoms/Button';
import { AppearanceSettings } from './_components/AppearanceSettings';
import { PermissionMatrix } from './_components/PermissionMatrix';
import { ApiKeyCard } from './_components/ApiKeyCard';
import { ProfileSettings } from './_components/ProfileSettings';
import { OtpTestPhoneSettings } from './_components/OtpTestPhoneSettings';
import { OTP_TEST_PHONES } from '@/lib/strings';

const settingsTabs = [
  { label: 'Hồ sơ cá nhân', value: 'profile' },
  { label: 'Cài đặt chung', value: 'general' },
  { label: 'Giao diện', value: 'appearance' },
  { label: 'Vai trò & Quyền', value: 'rbac' },
  { label: 'API Keys', value: 'api' },
  { label: OTP_TEST_PHONES.TAB_LABEL, value: 'otp-test' },
];

const API_KEYS = [
  {
    _id: 'ak1',
    name: 'Mobile App (Production)',
    clientId: 'cli_prod_8f3a2b1c',
    secret: 'sk_live_••••••••••••••••',
    status: 'active' as const,
    createdAt: '15/08/2023',
  },
  {
    _id: 'ak2',
    name: 'Web Dashboard (Staging)',
    clientId: 'cli_stg_4d7e9f0a',
    secret: 'sk_test_••••••••••••••••',
    status: 'test' as const,
    createdAt: '01/10/2023',
  },
];

export default function SettingsPage() {
  const [tab, setTab] = useState('general');

  return (
    <>
      <PageHeader
        title="Cài đặt hệ thống"
        description="Cấu hình, phân quyền và quản lý API keys."
      >
        <Button size="sm" iconLeft="save-outline">
          Lưu thay đổi
        </Button>
      </PageHeader>

      <TabGroup
        tabs={settingsTabs}
        active={tab}
        onChange={setTab}
        className="mt-6"
      />

      <div className="mt-6">
        {tab === 'profile' && <ProfileSettings />}

        {tab === 'general' && (
          <GlassPanel card className="max-w-2xl space-y-5">
            <Input
              label="Tên hệ thống"
              defaultValue="NALee Sports Portal"
              leftIcon="business-outline"
            />
            <Input
              label="URL hệ thống"
              defaultValue="https://portal.naleesports.com"
              leftIcon="globe-outline"
            />
            <Select
              label="Ngôn ngữ mặc định"
              options={[
                { label: 'Tiếng Việt', value: 'vi' },
                { label: 'English', value: 'en' },
              ]}
            />
            <Select
              label="Múi giờ"
              options={[
                { label: 'Asia/Ho_Chi_Minh (GMT+7)', value: 'asia_hcm' },
                { label: 'UTC', value: 'utc' },
              ]}
            />
            <div className="border-surface-border flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-heading text-sm font-medium">
                  Chế độ bảo trì
                </p>
                <p className="text-faint text-xs">
                  Tạm ngưng truy cập cho người dùng.
                </p>
              </div>
              <Toggle />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-heading text-sm font-medium">
                  Thông báo email
                </p>
                <p className="text-faint text-xs">
                  Gửi email khi có sự kiện quan trọng.
                </p>
              </div>
              <Toggle checked />
            </div>
          </GlassPanel>
        )}

        {tab === 'appearance' && <AppearanceSettings />}

        {tab === 'rbac' && <PermissionMatrix />}

        {tab === 'api' && (
          <div className="max-w-2xl space-y-4">
            {API_KEYS.map((k) => (
              <ApiKeyCard key={k._id} apiKey={k} />
            ))}
            <Button
              variant="ghost"
              iconLeft="add-outline"
              className="border-surface-border w-full border border-dashed"
            >
              Tạo API Key mới
            </Button>
          </div>
        )}

        {tab === 'otp-test' && <OtpTestPhoneSettings />}
      </div>
    </>
  );
}
