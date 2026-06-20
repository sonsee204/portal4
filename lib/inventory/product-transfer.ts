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

import type { TransferProductsInput } from '@/graphql/generated';

export const UNLIMITED_STOCK_QUANTITY = -1;
export const UNLIMITED_TRANSFER_UI_CAP = 9999;

export type TransferProductSnapshot = {
  _id: string;
  name: string;
  stockQuantity?: number | null;
  sku?: string | null;
  price?: number | null;
  category?: { _id: string; name: string } | null;
};

export function isUnlimitedStock(stockQuantity?: number | null): boolean {
  return stockQuantity === UNLIMITED_STOCK_QUANTITY;
}

export function isProductTransferable(
  product: Pick<TransferProductSnapshot, 'stockQuantity'>,
): boolean {
  if (isUnlimitedStock(product.stockQuantity)) {
    return true;
  }
  return (product.stockQuantity ?? 0) > 0;
}

export function getDefaultTransferQuantity(
  product: Pick<TransferProductSnapshot, 'stockQuantity'>,
): number {
  if (isUnlimitedStock(product.stockQuantity)) {
    return 1;
  }
  return product.stockQuantity ?? 1;
}

export function getMaxTransferQuantity(
  product: Pick<TransferProductSnapshot, 'stockQuantity'>,
): number {
  if (isUnlimitedStock(product.stockQuantity)) {
    return UNLIMITED_TRANSFER_UI_CAP;
  }
  return product.stockQuantity ?? 0;
}

export function validateTransferQuantity(
  product: Pick<TransferProductSnapshot, 'stockQuantity'>,
  quantity: number,
): { valid: boolean; error?: string } {
  if (!Number.isFinite(quantity) || quantity < 1) {
    return { valid: false, error: 'Số lượng phải lớn hơn 0' };
  }

  if (isUnlimitedStock(product.stockQuantity)) {
    return { valid: true };
  }

  const max = product.stockQuantity ?? 0;
  if (quantity > max) {
    return {
      valid: false,
      error: `Vượt quá tồn kho (${max})`,
    };
  }

  return { valid: true };
}

export function buildTransferProductsInput(params: {
  sourceVenueId: string;
  destinationVenueId: string;
  items: Array<{ productId: string; quantity: number }>;
}): TransferProductsInput {
  return {
    sourceVenueId: params.sourceVenueId,
    destinationVenueId: params.destinationVenueId,
    products: params.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  };
}

export function formatTransferStockLabel(stockQuantity?: number | null): string {
  if (isUnlimitedStock(stockQuantity)) {
    return '∞';
  }
  return String(stockQuantity ?? 0);
}
