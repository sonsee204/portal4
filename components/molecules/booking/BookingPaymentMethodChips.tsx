/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { FilterChips } from '@/components/molecules/FilterChips';
import { PaymentMethod } from '@/graphql/generated';

const PAYMENT_OPTIONS = [
  { value: PaymentMethod.Cash, label: 'Tiền mặt' },
  { value: PaymentMethod.BankTransfer, label: 'Chuyển khoản' },
];

interface BookingPaymentMethodChipsProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
}

export function BookingPaymentMethodChips({
  value,
  onChange,
}: BookingPaymentMethodChipsProps) {
  return (
    <div>
      <p className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">
        Phương thức thanh toán
      </p>
      <FilterChips
        chips={PAYMENT_OPTIONS}
        active={value}
        onChange={(next) => onChange(next as PaymentMethod)}
      />
    </div>
  );
}
