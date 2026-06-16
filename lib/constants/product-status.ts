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

export const PRODUCT_STATUS_VARIANT: Record<
  string,
  'success' | 'warning' | 'danger' | 'info' | 'neutral'
> = {
  ACTIVE: 'success',
  DRAFT: 'neutral',
  INACTIVE: 'warning',
  OUT_OF_STOCK: 'danger',
};

export const PRODUCT_STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Đang bán',
  DRAFT: 'Nháp',
  INACTIVE: 'Ngừng bán',
  OUT_OF_STOCK: 'Hết hàng',
};
