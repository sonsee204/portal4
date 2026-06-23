/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import type { OwnerFinancePageTab } from '../_hooks/owner-finance-page.constants';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import type { OwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';
import { FinanceExportButton } from '../_components/FinanceExportButton';

const PAGE_META: Record<
  OwnerFinancePageTab,
  { title: string; description: string }
> = {
  portfolio: {
    title: 'Tổng quan',
    description: 'KPI, insight và xu hướng theo sân đang chọn.',
  },
  finance: {
    title: 'Thống kê tài chính',
    description:
      'Báo cáo P&L, giao dịch và chi phí. Chọn sân hoặc Tất cả sân trên thanh header. Doanh thu ghi nhận khi đơn hoàn thành.',
  },
  operations: {
    title: 'Thống kê sân',
    description:
      'Báo cáo vận hành sân theo sân đang chọn trên thanh chọn sân. Doanh thu ghi nhận khi đơn hoàn thành.',
  },
};

interface OwnerFinanceHeaderSectionProps {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
}

export function OwnerFinanceHeaderSection({
  data,
  actions,
}: OwnerFinanceHeaderSectionProps) {
  const meta = PAGE_META[data.pageTab];
  const scopeLabel =
    data.pageTab === 'operations'
      ? (data.selectedVenue?.name ?? 'Chọn sân')
      : data.allVenues
        ? 'Tất cả sân'
        : (data.selectedVenue?.name ?? 'Chọn sân');

  const description =
    data.pageTab === 'portfolio'
      ? data.allVenues
        ? 'So sánh danh mục · Tất cả sân'
        : scopeLabel
      : `${meta.description} · ${scopeLabel}`;

  return (
    <PageHeader
      title={meta.title}
      description={description}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <FinanceExportButton data={data} />
          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            onClick={actions.handleRetryAll}
          >
            Làm mới
          </Button>
        </div>
      }
    />
  );
}
