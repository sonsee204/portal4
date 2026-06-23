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

import { OrderType, PaymentMethod } from '@/graphql/generated';

export const CREATE_ORDER_PAGE_SIZE = 50;

export const SERVICE_DATE_MAX_DAYS_AGO = 90;

export const PAYMENT_METHOD_OPTIONS: Array<{
  label: string;
  value: PaymentMethod;
  icon: string;
}> = [
  {
    label: 'Chuyển khoản',
    value: PaymentMethod.BankTransfer,
    icon: 'card-outline',
  },
  {
    label: 'Tiền mặt',
    value: PaymentMethod.Cash,
    icon: 'cash-outline',
  },
];

export const ORDER_TYPE_FIELD_RULES: Partial<
  Record<OrderType, { court?: boolean; table?: boolean }>
> = {
  [OrderType.DeliveryToCourt]: { court: true },
  [OrderType.DineIn]: { table: true },
};
