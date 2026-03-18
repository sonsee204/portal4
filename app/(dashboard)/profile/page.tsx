'use client';

import { PageHeader } from '@/components/organisms/PageHeader';
import { ProfileSettings } from '../settings/_components/ProfileSettings';

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        title="Hồ sơ cá nhân"
        description="Chỉnh sửa thông tin cá nhân của bạn."
      />
      <div className="mt-6">
        <ProfileSettings />
      </div>
    </>
  );
}
