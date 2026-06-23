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

import { describe, expect, it } from 'vitest';
import {
  buildTransferProductsInput,
  getDefaultTransferQuantity,
  getMaxTransferQuantity,
  isProductTransferable,
  UNLIMITED_STOCK_QUANTITY,
  validateTransferQuantity,
} from './product-transfer';

describe('product-transfer', () => {
  it('detects transferable products', () => {
    expect(isProductTransferable({ stockQuantity: 5 })).toBe(true);
    expect(isProductTransferable({ stockQuantity: 0 })).toBe(false);
    expect(isProductTransferable({ stockQuantity: UNLIMITED_STOCK_QUANTITY })).toBe(
      true,
    );
  });

  it('defaults quantity to full stock or 1 for unlimited', () => {
    expect(getDefaultTransferQuantity({ stockQuantity: 12 })).toBe(12);
    expect(getDefaultTransferQuantity({ stockQuantity: UNLIMITED_STOCK_QUANTITY })).toBe(
      1,
    );
  });

  it('caps max quantity for unlimited stock in UI', () => {
    expect(getMaxTransferQuantity({ stockQuantity: 8 })).toBe(8);
    expect(getMaxTransferQuantity({ stockQuantity: UNLIMITED_STOCK_QUANTITY })).toBe(
      9999,
    );
  });

  it('validates transfer quantity', () => {
    expect(validateTransferQuantity({ stockQuantity: 10 }, 5).valid).toBe(true);
    expect(validateTransferQuantity({ stockQuantity: 10 }, 0).valid).toBe(false);
    expect(validateTransferQuantity({ stockQuantity: 10 }, 11).valid).toBe(false);
    expect(
      validateTransferQuantity({ stockQuantity: UNLIMITED_STOCK_QUANTITY }, 100).valid,
    ).toBe(true);
  });

  it('builds transfer input payload', () => {
    expect(
      buildTransferProductsInput({
        sourceVenueId: 'src',
        destinationVenueId: 'dest',
        items: [{ productId: 'p1', quantity: 3 }],
      }),
    ).toEqual({
      sourceVenueId: 'src',
      destinationVenueId: 'dest',
      products: [{ productId: 'p1', quantity: 3 }],
    });
  });
});
