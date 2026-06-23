/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Badge } from '@/components/atoms/Badge';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface BookingPriceSummaryProps {
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  isManualPrice: boolean;
  className?: string;
}

export function BookingPriceSummary({
  subtotal,
  discountAmount,
  finalAmount,
  isManualPrice,
  className,
}: BookingPriceSummaryProps) {
  return (
    <div className={cn('space-y-2 text-sm', className)}>
      <div className="flex items-center justify-between">
        <span className="text-muted">Tạm tính</span>
        <span
          className={cn(
            'font-medium',
            isManualPrice ? 'text-faint line-through' : 'text-heading',
          )}
        >
          {formatCurrency(subtotal)}
        </span>
      </div>
      {!isManualPrice && discountAmount > 0 ? (
        <div className="flex items-center justify-between">
          <span className="text-muted">Giảm giá</span>
          <span className="font-medium text-emerald-400">
            −{formatCurrency(discountAmount)}
          </span>
        </div>
      ) : null}
      <div className="border-surface-border flex items-center justify-between border-t pt-2">
        <span className="text-body font-medium">Thành tiền</span>
        <div className="flex items-center gap-2">
          {isManualPrice ? (
            <Badge variant="warning">Giá thủ công</Badge>
          ) : null}
          <span className="text-primary text-base font-semibold">
            {formatCurrency(finalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
