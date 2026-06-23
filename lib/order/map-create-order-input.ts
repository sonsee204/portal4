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
 * Cross-ref: nalee-sports-mobile CreateOrder handleCreateOrder
 */

import type {
  CreateOrderInput,
  OrderType,
  PaymentMethod,
} from '@/graphql/generated';
import { OrderItemType } from '@/graphql/generated';
import type { CreateOrderFormValues } from './create-order.schema';

export interface MapCreateOrderInputOptions {
  venueId: string;
  values: CreateOrderFormValues;
  discountCode?: string | null;
}

function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function mapCreateOrderInput({
  venueId,
  values,
  discountCode,
}: MapCreateOrderInputOptions): CreateOrderInput {
  const {
    selectedOrderType,
    cartItems,
    customerName,
    customerPhone,
    courtNumber,
    tableNumber,
    note,
    paymentMethod,
    serviceDate,
    isManualPrice,
    manualPriceNote,
  } = values;

  return {
    venueId,
    orderType: selectedOrderType as OrderType,
    items: cartItems.map((item) => ({
      productId: item.productId,
      itemType: OrderItemType.Product,
      quantity: item.quantity,
      ...(isManualPrice && item.manualUnitPrice !== undefined
        ? { unitPrice: item.manualUnitPrice }
        : {}),
    })),
    ...(customerName.trim() ? { customerName: customerName.trim() } : {}),
    ...(customerPhone.trim() ? { customerPhone: customerPhone.trim() } : {}),
    ...(courtNumber.trim() ? { courtNumber: courtNumber.trim() } : {}),
    ...(tableNumber.trim() ? { tableNumber: tableNumber.trim() } : {}),
    ...(!isManualPrice && discountCode ? { discountCode } : {}),
    paymentMethod: paymentMethod as PaymentMethod,
    ...(note.trim() ? { note: note.trim() } : {}),
    serviceDate: formatDateForApi(serviceDate),
    ...(isManualPrice ? { isManualPrice: true } : {}),
    ...(isManualPrice && manualPriceNote.trim()
      ? { manualPriceNote: manualPriceNote.trim() }
      : {}),
  };
}
