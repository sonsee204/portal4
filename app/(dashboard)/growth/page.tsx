'use client';

import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PageHeader } from '@/components/organisms/PageHeader';
import {
  GrowthStatsCards,
  type GrowthKPI,
} from './_components/GrowthStatsCards';
import {
  TrafficSourceChart,
  type ChartDataPoint,
} from './_components/TrafficSourceChart';
import {
  PartnerLeaderboard,
  type PartnerRow,
} from './_components/PartnerLeaderboard';

/* ------------------------------------------------------------------ */
/* Mock data — mirrors the static HTML                                 */
/* ------------------------------------------------------------------ */

const GROWTH_KPIS: GrowthKPI[] = [
  {
    key: 'totalNewUsers',
    label: 'Tổng người dùng mới',
    value: '1.245',
    icon: 'people-outline',
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10',
    trend: { value: '+12,5%', direction: 'up' },
    subtitle: 'so tháng trước',
  },
  {
    key: 'partnerContribution',
    label: 'Đóng góp từ đối tác',
    value: '40%',
    icon: 'hand-left-outline',
    iconColor: 'text-purple-500',
    iconBg: 'bg-purple-500/10',
    progress: { value: 40, label: 'so 60% Hữu cơ' },
  },
  {
    key: 'activationRate',
    label: 'Tỷ lệ kích hoạt',
    value: '28,4%',
    icon: 'flash-outline',
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-500/10',
    subtitle: 'Trung bình toàn nguồn',
  },
  {
    key: 'totalRevenue',
    label: 'Tổng doanh thu quy đổi',
    value: '125M VND',
    icon: 'wallet-outline',
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-500/10',
    trend: { value: '+8,2%', direction: 'up' },
    subtitle: 'so tháng trước',
  },
];

const CHART_DATA: ChartDataPoint[] = [
  { organic: 30, partner: 10 },
  { organic: 35, partner: 15 },
  { organic: 32, partner: 18 },
  { organic: 40, partner: 25 },
  { organic: 45, partner: 35 },
  { organic: 42, partner: 42 },
  { organic: 50, partner: 48 },
  { organic: 55, partner: 55 },
  { organic: 48, partner: 62 },
  { organic: 52, partner: 70 },
  { organic: 58, partner: 68 },
  { organic: 60, partner: 75 },
  { organic: 55, partner: 80 },
  { organic: 62, partner: 82 },
  { organic: 65, partner: 78 },
  { organic: 60, partner: 85 },
  { organic: 58, partner: 80 },
  { organic: 50, partner: 75 },
  { organic: 45, partner: 72 },
  { organic: 48, partner: 68 },
  { organic: 52, partner: 65 },
  { organic: 55, partner: 60 },
];

const CHART_LABELS = [
  '20/01',
  '25/01',
  '30/01',
  '05/02',
  '10/02',
  '15/02',
  '20/02',
];

const PARTNER_DATA: PartnerRow[] = [
  {
    id: 'system',
    name: 'Hữu cơ / Thương hiệu',
    email: 'Trực tiếp & Tìm kiếm',
    role: 'Hệ thống',
    roleBadgeVariant: 'neutral',
    referralCode: 'SYSTEM',
    signups: 1892,
    activationRate: 45,
    revenue: '-',
    trend: 'flat',
    isSystem: true,
  },
  {
    id: 'partner-1',
    name: 'Nguyen Van A',
    email: 'nguyenvana@aotrinh.com',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDv2ReSvuZE97yN8MdOljozF_mGIo7hX5s4Ojdv7iteUZOW6J3cU-Lm5zZA9RiJSyIqqgytgWOk5r5Wc5MQsFqpULTrxO9kC2c5RWNEpDLwZU6esXb2jHXcYusIDzfpeVNwaHJ6rSWoCZkgx48i_N1Pe_QHL5-KrsU_6mNUSw7wK9NNBMYEzgv2e4MX0IMLCWorVVhn9ptEUgNNA6nTUwc5BSi320bPfSE4HbLi1oEbYGeApN_dJFOuaVfBx_Vr4NeePzsFnc4gK2LT',
    role: 'Đồng sáng lập CEO',
    roleBadgeVariant: 'warning',
    referralCode: 'CEOVIP',
    signups: 850,
    activationRate: 35,
    revenue: '85,200,000',
    trend: 'up',
    isTopPerformer: true,
  },
  {
    id: 'partner-2',
    name: 'Le Thi C',
    email: 'lethic@partner.com',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBjJhx1n8yELxFiwP1aXDRigk9V-WvA-G4SqsorMYvysEsRvQQwfCQxRfB1rrPQh75PVkONUJAnJKqIaGMumhZnpYDONqa58YnsoymowfiIt7mx_sVND6At9QNEMbpsEDNGM6H5qY2UKHaPbQhAWP0JyPUbk0PXBB1GZc5YTEfrD62c-Fl346jOj_uyfybouI1ZBuURR_ggulZUs1aEuZFFYXQCYwIGUsYTFxOsQfvfMDt843FOw6oHOUe8CCi1SHI30SdW_1s30SEV',
    role: 'Đối tác',
    roleBadgeVariant: 'purple',
    referralCode: 'LTC88',
    signups: 620,
    activationRate: 30,
    revenue: '24,500,000',
    trend: 'up',
  },
  {
    id: 'partner-3',
    name: 'Tran Van B',
    email: 'tranvanb@aotrinh.com',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6YogpVirTKh8vm5Z2VteoLNVmJu_l5zSnpAKgtgyueEKe3qOiSJ0facmq1TPbcCVAxSCLTH0fpH4XQusqq9BkYMc5K3Kwr7ewP76ssMoEpSZQcx_3t2hVzVjuiLcU7Ugdmq7tEBcu_aF6QDyn4rkNzrG2vacFNVDIdih5ep5cN9pDv-M-wcLIDzRbWqEIw-Yz-Kw1dYXv6_qzj4GCEy1xuifMtKIzj86QKt9e2aynztslzzcx8Q7QU6PIql9PdbX9IeWCsvnedsgU',
    role: 'CGO',
    roleBadgeVariant: 'info',
    referralCode: 'CGOPRO',
    signups: 580,
    activationRate: 12,
    revenue: '15,300,000',
    trend: 'down',
  },
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function GrowthPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Theo dõi Tăng trưởng & Đối tác"
        description="Theo dõi hiệu suất đối tác, nguồn giới thiệu và tăng trưởng hữu cơ."
      >
        <div className="bg-surface border-surface-border flex items-center gap-3 rounded-lg border p-1.5 shadow-sm">
          {/* Date range picker mock */}
          <div className="border-surface-border text-muted hover:bg-surface-hover flex cursor-pointer items-center border-r px-3 py-2 text-sm transition-colors">
            <IonIcon name="calendar-outline" className="mr-2 text-lg" />
            <span>20/01/2023 - 20/02/2023</span>
          </div>

          {/* Export button */}
          <Button variant="primary" size="sm" iconLeft="download-outline">
            Xuất báo cáo
          </Button>
        </div>
      </PageHeader>

      {/* KPI Cards */}
      <GrowthStatsCards cards={GROWTH_KPIS} />

      {/* Traffic Source Chart */}
      <TrafficSourceChart
        data={CHART_DATA}
        labels={CHART_LABELS}
        tooltip={{
          label: '12/02/2023',
          partner: 420,
          organic: 310,
          anchorIndex: 13,
        }}
      />

      {/* Partner Leaderboard */}
      <PartnerLeaderboard data={PARTNER_DATA} totalPartners={24} />
    </div>
  );
}
