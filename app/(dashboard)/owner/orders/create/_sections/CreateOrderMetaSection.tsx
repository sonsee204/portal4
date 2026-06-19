/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Input } from '@/components/atoms/Input';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { DatePicker } from '@/components/molecules/DatePicker';
import { QueryState } from '@/components/molecules/QueryState';
import { OrderTypeOptionCard } from '../_components/OrderTypeOptionCard';
import type { CreateOrderPageData } from '../_hooks/useCreateOrderPageData';

interface CreateOrderMetaSectionProps {
  data: CreateOrderPageData;
}

export function CreateOrderMetaSection({ data }: CreateOrderMetaSectionProps) {
  const {
    formValues,
    setValue,
    orderTypes,
    orderTypesLoading,
    hasOrderService,
    showCourtField,
    showTableField,
    minServiceDate,
    maxServiceDate,
  } = data;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading text-base font-semibold">
        Loại đơn & ngày dịch vụ
      </h2>

      <QueryState
        loading={orderTypesLoading}
        empty={!orderTypesLoading && orderTypes.length === 0}
        emptyMessage={
          hasOrderService
            ? 'Chưa có loại đơn nào được bật cho POS. Bật ít nhất một loại đơn (trừ đặt sân) trong cài đặt cơ sở.'
            : 'Cơ sở chưa bật dịch vụ đơn hàng hoặc chưa cấu hình loại đơn.'
        }
      >
        <div className="flex gap-2 overflow-x-auto pb-1">
          {orderTypes.map((config) => (
            <OrderTypeOptionCard
              key={config.orderType}
              config={config}
              selected={formValues.selectedOrderType === config.orderType}
              onSelect={() =>
                setValue('selectedOrderType', config.orderType, {
                  shouldValidate: true,
                })
              }
            />
          ))}
        </div>
      </QueryState>

      <DatePicker
        label="Ngày dịch vụ"
        value={formValues.serviceDate}
        onChange={(date) =>
          setValue('serviceDate', date, { shouldValidate: true })
        }
        minDate={minServiceDate}
        maxDate={maxServiceDate}
      />

      {showCourtField ? (
        <Input
          label="Số sân giao hàng"
          placeholder="VD: Sân 3"
          value={formValues.courtNumber}
          onChange={(e) =>
            setValue('courtNumber', e.target.value, { shouldValidate: true })
          }
        />
      ) : null}

      {showTableField ? (
        <Input
          label="Số bàn"
          placeholder="VD: Bàn 12"
          value={formValues.tableNumber}
          onChange={(e) => setValue('tableNumber', e.target.value)}
        />
      ) : null}
    </GlassPanel>
  );
}
