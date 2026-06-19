/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { formatCurrency } from '@/lib/utils';

interface CreateOrderSummaryProps {
  subtotal: number;
  promoDiscount: number;
  total: number;
}

export function CreateOrderSummary({
  subtotal,
  promoDiscount,
  total,
}: CreateOrderSummaryProps) {
  return (
    <div className="space-y-2 text-sm">
      <div className="text-muted flex justify-between">
        <span>Tạm tính</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      {promoDiscount > 0 ? (
        <div className="flex justify-between text-emerald-500">
          <span>Giảm giá</span>
          <span>−{formatCurrency(promoDiscount)}</span>
        </div>
      ) : null}
      <div className="border-surface-border text-heading flex justify-between border-t pt-2 text-base font-semibold">
        <span>Tổng cộng</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>
    </div>
  );
}
