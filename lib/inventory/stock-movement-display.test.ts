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
import { StockMovementType } from '@/graphql/generated';
import {
  formatMovementQuantity,
  getStockMovementTypeLabel,
  isIncomingMovement,
  movementUnitCost,
} from './stock-movement-display';

describe('stock-movement-display', () => {
  it('labels movement types in Vietnamese', () => {
    expect(getStockMovementTypeLabel(StockMovementType.Import)).toBe(
      'Nhập hàng',
    );
    expect(getStockMovementTypeLabel(StockMovementType.Sale)).toBe('Bán hàng');
  });

  it('detects incoming vs outgoing movements', () => {
    expect(isIncomingMovement(StockMovementType.Import)).toBe(true);
    expect(isIncomingMovement(StockMovementType.Sale)).toBe(false);
  });

  it('formats signed quantity', () => {
    expect(formatMovementQuantity(StockMovementType.Import, 5)).toBe('+5');
    expect(formatMovementQuantity(StockMovementType.Sale, 3)).toBe('−3');
  });

  it('resolves unit cost from import or sale cost', () => {
    expect(movementUnitCost({ importPrice: 1000, costAtSale: 900 })).toBe(
      1000,
    );
    expect(movementUnitCost({ importPrice: null, costAtSale: 900 })).toBe(900);
    expect(movementUnitCost({ importPrice: null, costAtSale: null })).toBe(
      null,
    );
  });
});
