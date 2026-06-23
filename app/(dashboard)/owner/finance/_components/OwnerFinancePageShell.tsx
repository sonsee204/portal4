/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { VenueAction } from '@/graphql/generated';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { EmptyState } from '@/components/molecules/EmptyState';
import type { OwnerFinancePageTab } from '../_hooks/owner-finance-page.constants';
import { OwnerFinancePageView } from './OwnerFinancePageView';

interface OwnerFinancePageShellProps {
  pageTab: OwnerFinancePageTab;
}

export function OwnerFinancePageShell({ pageTab }: OwnerFinancePageShellProps) {
  return (
    <VenueActionGate
      action={VenueAction.ViewAnalytics}
      fallback={
        <div className="py-16">
          <EmptyState
            title="Không có quyền xem tài chính"
            description="Quyền xem thống kê cho phép truy cập báo cáo tài chính và biểu đồ. Liên hệ chủ sân để được cấp quyền."
            icon="lock-closed-outline"
          />
        </div>
      }
    >
      <OwnerFinancePageView pageTab={pageTab} />
    </VenueActionGate>
  );
}
