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

import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import type { OwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';
import { FinanceExportButton } from '../_components/FinanceExportButton';

interface OwnerFinanceHeaderSectionProps {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
}

export function OwnerFinanceHeaderSection({
  data,
  actions,
}: OwnerFinanceHeaderSectionProps) {
  const scopeLabel = data.allVenues
    ? 'Tất cả sân'
    : (data.selectedVenue?.name ?? 'Chọn sân');

  return (
    <PageHeader
      title="Tài chính sân"
      description={`Báo cáo P&L và dòng tiền cho ${scopeLabel}.`}
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
