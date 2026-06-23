/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import type { OwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';
import type { OwnerProductStatsPageActions } from '../_hooks/useOwnerProductStatsPageActions';
import { ProductStatsExportButton } from '../_components/ProductStatsExportButton';

interface OwnerProductStatsHeaderSectionProps {
  data: OwnerProductStatsPageData;
  actions: OwnerProductStatsPageActions;
}

export function OwnerProductStatsHeaderSection({
  data,
  actions,
}: OwnerProductStatsHeaderSectionProps) {
  const router = useRouter();

  return (
    <PageHeader
      title="Thống kê sản phẩm"
      description={`Doanh thu ghi nhận khi đơn hoàn thành — đồng bộ Thống kê tài chính · ${data.scopeLabel}`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            iconLeft="swap-vertical-outline"
            onClick={() => router.push('/owner/inventory/history')}
          >
            Xem sổ cái kho
          </Button>
          <ProductStatsExportButton data={data} />
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
