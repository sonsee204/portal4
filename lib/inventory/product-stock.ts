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

import { ProductStatus } from '@/graphql/generated';

type StockTrackedProduct = {
  status: ProductStatus;
  stockQuantity?: number | null;
  lowStockThreshold?: number | null;
};

export function isProductOutOfStock(product: StockTrackedProduct): boolean {
  return (
    product.status === ProductStatus.OutOfStock ||
    (product.stockQuantity ?? 0) <= 0
  );
}

export function isProductLowStock(product: StockTrackedProduct): boolean {
  return (
    product.stockQuantity != null &&
    product.lowStockThreshold != null &&
    product.stockQuantity > 0 &&
    product.stockQuantity <= product.lowStockThreshold
  );
}

export function productNeedsRestock(product: StockTrackedProduct): boolean {
  return isProductOutOfStock(product) || isProductLowStock(product);
}
