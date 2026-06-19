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
import { Input } from '@/components/atoms/Input';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { CreateOrderPageData } from '../_hooks/useCreateOrderPageData';

interface CreateOrderCustomerSectionProps {
  data: CreateOrderPageData;
}

export function CreateOrderCustomerSection({
  data,
}: CreateOrderCustomerSectionProps) {
  const { formValues, setValue, foundCustomer, customerLoading } = data;

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-heading text-base font-semibold">Khách hàng</h2>
        {customerLoading ? (
          <span className="text-faint text-xs">Đang tra cứu...</span>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Số điện thoại"
          placeholder="0901234567"
          value={formValues.customerPhone}
          onChange={(e) => setValue('customerPhone', e.target.value)}
          leftIcon="call-outline"
        />
        <Input
          label="Tên khách"
          placeholder="Tên khách walk-in"
          value={formValues.customerName}
          onChange={(e) => setValue('customerName', e.target.value)}
          leftIcon="person-outline"
        />
      </div>

      {foundCustomer?._id ? (
        <Badge variant="info">Khách đã có tài khoản hệ thống</Badge>
      ) : null}
    </GlassPanel>
  );
}
