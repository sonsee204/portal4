/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { formatCurrency } from '@/lib/utils';

interface AppliedPromotionPreview {
  name: string;
  discountAmount: number;
  category?: string | null;
}

interface BookingPromoBreakdownListProps {
  promotions: AppliedPromotionPreview[];
}

export function BookingPromoBreakdownList({
  promotions,
}: BookingPromoBreakdownListProps) {
  if (promotions.length === 0) {
    return null;
  }

  return (
    <GlassPanel card className="space-y-2 p-3">
      <p className="text-muted text-xs font-medium tracking-wide uppercase">
        Chi tiết khuyến mãi
      </p>
      <ul className="space-y-1.5">
        {promotions.map((promo) => (
          <li
            key={`${promo.name}-${promo.discountAmount}`}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="text-heading truncate">{promo.name}</span>
            <span className="shrink-0 font-medium text-emerald-400">
              -{formatCurrency(promo.discountAmount)}
            </span>
          </li>
        ))}
      </ul>
    </GlassPanel>
  );
}
