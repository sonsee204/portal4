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

export const ORDER_ITEM_TYPE_LABEL: Record<string, string> = {
  COURT: 'Đặt sân',
  FOOD: 'Đồ ăn',
  BEVERAGE: 'Đồ uống',
  PRODUCT: 'Sản phẩm',
  SERVICE: 'Dịch vụ',
  TRAINING: 'Huấn luyện',
};

export const ORDER_ITEM_TYPE_VARIANT: Record<
  string,
  'success' | 'warning' | 'danger' | 'info' | 'neutral'
> = {
  COURT: 'info',
  FOOD: 'warning',
  BEVERAGE: 'info',
  PRODUCT: 'neutral',
  SERVICE: 'success',
  TRAINING: 'success',
};

export const ORDER_ITEM_TYPE_SORT = [
  'COURT',
  'FOOD',
  'BEVERAGE',
  'PRODUCT',
  'SERVICE',
  'TRAINING',
] as const;
