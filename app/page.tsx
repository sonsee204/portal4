'use client';

import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { PageHeader } from '@/components/organisms/PageHeader';

export default function Home() {
  return (
    <DashboardLayout
      activePath="/"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Dashboard' }]}
    >
      <PageHeader
        title="Dashboard"
        description="Xin chào! Chào mừng đến với HITRI TECH Portal."
      />

      <div className="border-surface-border mt-8 flex items-center justify-center rounded-xl border border-dashed py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Hello World</h2>
          <p className="mt-2 text-slate-400">
            NALee Sports Portal — Design System Ready
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
