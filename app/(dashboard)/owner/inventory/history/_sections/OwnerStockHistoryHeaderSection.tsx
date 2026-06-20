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
import { VenueAction } from '@/graphql/generated';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import type { OwnerStockHistoryPageData } from '../_hooks/useOwnerStockHistoryPageData';
import type { OwnerStockHistoryPageActions } from '../_hooks/useOwnerStockHistoryPageActions';

interface OwnerStockHistoryHeaderSectionProps {
  data: OwnerStockHistoryPageData;
  actions: OwnerStockHistoryPageActions;
}

export function OwnerStockHistoryHeaderSection({
  data,
  actions,
}: OwnerStockHistoryHeaderSectionProps) {
  const router = useRouter();

  return (
    <PageHeader
      title="Lịch sử kho"
      description={`Sổ cái biến động tồn kho · ${data.scopeLabel} · ${data.totalCount.toLocaleString('vi-VN')} dòng`}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <VenueActionGate action={VenueAction.ManageProducts}>
            <Button
              variant="secondary"
              size="sm"
              iconLeft="download-outline"
              onClick={() => router.push('/owner/products')}
            >
              Nhập kho
            </Button>
          </VenueActionGate>
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
