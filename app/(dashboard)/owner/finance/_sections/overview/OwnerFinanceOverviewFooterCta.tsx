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

import { useRouter } from 'next/navigation';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { FINANCE_PAGE_TAB_ROUTES } from '../../_hooks/owner-finance-page.constants';

export function OwnerFinanceOverviewFooterCta() {
  const router = useRouter();

  return (
    <GlassPanel
      card
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <div>
        <p className="text-heading text-sm font-semibold">Xem thêm chi tiết</p>
        <p className="text-muted mt-1 text-sm">
          Chuyển sang tab Tài chính hoặc Vận hành với cùng phạm vi và kỳ đang
          chọn.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          iconRight="arrow-forward-outline"
          onClick={() => router.push(FINANCE_PAGE_TAB_ROUTES.finance)}
        >
          Xem chi tiết tài chính
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconRight="arrow-forward-outline"
          onClick={() => router.push(FINANCE_PAGE_TAB_ROUTES.operations)}
        >
          Xem vận hành sân
        </Button>
      </div>
    </GlassPanel>
  );
}
