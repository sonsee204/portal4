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

'use client';

import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { TransferProductSnapshot } from '@/lib/inventory/product-transfer';
import { TransferProductLineItem } from './TransferProductLineItem';

interface TransferProductsListSectionProps {
  products: TransferProductSnapshot[];
  quantities: Record<string, number>;
  onQuantityChange: (productId: string, value: string) => void;
}

export function TransferProductsListSection({
  products,
  quantities,
  onQuantityChange,
}: TransferProductsListSectionProps) {
  return (
    <GlassPanel card className="overflow-hidden p-0">
      <div className="border-surface-border border-b px-4 py-3">
        <h3 className="text-heading text-sm font-semibold">
          Sản phẩm ({products.length})
        </h3>
      </div>
      <div className="max-h-[40vh] overflow-y-auto">
        {products.map((product) => (
          <TransferProductLineItem
            key={product._id}
            product={product}
            quantity={quantities[product._id] ?? 0}
            onQuantityChange={(value) => onQuantityChange(product._id, value)}
          />
        ))}
      </div>
    </GlassPanel>
  );
}
