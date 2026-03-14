'use client';

import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { NotificationProvider } from '@/components/providers/NotificationProvider';

/** Map path segment to Vietnamese breadcrumb label */
const SEGMENT_LABELS: Record<string, string> = {
  users: 'Quản lý người dùng',
  audit: 'Nhật ký hệ thống',
  growth: 'Tăng trưởng & Đối tác',
  profile: 'Hồ sơ cá nhân',
  settings: 'Cài đặt',
  ecosystem: 'Hệ sinh thái',
  tournaments: 'Giải đấu',
  finance: 'Tài chính',
  calendar: 'Lịch sân',
  moderation: 'Kiểm duyệt',
  support: 'Hỗ trợ',
  cms: 'Nội dung & Banner',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* Build breadcrumbs from pathname segments */
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    ...segments.map((seg, i) => ({
      label: SEGMENT_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1),
      href:
        i < segments.length - 1
          ? '/' + segments.slice(0, i + 1).join('/')
          : undefined,
    })),
  ];

  return (
    <AuthProvider>
      <NotificationProvider>
        <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>
      </NotificationProvider>
    </AuthProvider>
  );
}
