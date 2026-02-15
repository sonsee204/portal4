'use client';

import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { AuthProvider } from '@/components/providers/AuthProvider';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  /* Build breadcrumbs from pathname segments */
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...segments.map((seg, i) => ({
      label: seg.charAt(0).toUpperCase() + seg.slice(1),
      href:
        i < segments.length - 1
          ? '/' + segments.slice(0, i + 1).join('/')
          : undefined,
    })),
  ];

  return (
    <AuthProvider>
      <DashboardLayout breadcrumbs={breadcrumbs}>{children}</DashboardLayout>
    </AuthProvider>
  );
}
