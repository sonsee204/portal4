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
 *
 * Cross-ref: nalee-sports-mobile/src/forms/schemas/createOrder.ts
 */

import { z } from 'zod';
import { OrderType } from '@/graphql/generated';

const cartItemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  manualUnitPrice: z.number().nonnegative().optional(),
});

export const createOrderSchema = z
  .object({
    selectedOrderType: z.string().nullable(),
    cartItems: z.array(cartItemSchema),
    customerName: z.string(),
    customerPhone: z.string(),
    courtNumber: z.string(),
    tableNumber: z.string(),
    note: z.string(),
    paymentMethod: z.string().min(1),
    serviceDate: z.date(),
    isManualPrice: z.boolean(),
    manualAmount: z.string(),
    manualPriceNote: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.cartItems.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['cartItems'],
        message: 'Vui lòng thêm ít nhất 1 sản phẩm',
      });
    }

    if (!data.selectedOrderType) {
      ctx.addIssue({
        code: 'custom',
        path: ['selectedOrderType'],
        message: 'Vui lòng chọn loại đơn hàng',
      });
    }

    if (
      data.selectedOrderType === OrderType.DeliveryToCourt &&
      !data.courtNumber.trim()
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['courtNumber'],
        message: 'Vui lòng nhập số sân để giao hàng',
      });
    }

    const today = startOfDay(new Date());
    const minDate = addDays(today, -90);
    const serviceDay = startOfDay(data.serviceDate);
    if (serviceDay < minDate || serviceDay > today) {
      ctx.addIssue({
        code: 'custom',
        path: ['serviceDate'],
        message: 'Ngày dịch vụ phải trong vòng 90 ngày gần nhất',
      });
    }
  });

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;

export type CreateOrderCartItem = CreateOrderFormValues['cartItems'][number];

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getDefaultCreateOrderFormValues(): CreateOrderFormValues {
  const today = startOfDay(new Date());
  return {
    selectedOrderType: null,
    cartItems: [],
    customerName: '',
    customerPhone: '',
    courtNumber: '',
    tableNumber: '',
    note: '',
    paymentMethod: 'BANK_TRANSFER',
    serviceDate: today,
    isManualPrice: false,
    manualAmount: '',
    manualPriceNote: '',
  };
}
