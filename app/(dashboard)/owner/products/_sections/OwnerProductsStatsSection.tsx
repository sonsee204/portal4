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
import { StatCard } from '@/components/molecules/StatCard';
import { Badge } from '@/components/atoms/Badge';
import { ProductStatus } from '@/graphql/generated';
import type { VenueProductNode } from '@/hooks/owner';
import type { OwnerProductsPageData } from '../_hooks/useOwnerProductsPageData';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';

interface OwnerProductsStatsSectionProps {
  data: OwnerProductsPageData;
  actions: OwnerProductsPageActions;
}

export function OwnerProductsStatsSection({
  data,
  actions,
}: OwnerProductsStatsSectionProps) {
  const {
    stats,
    statsLoading,
    lowStockProducts,
    lowStockLoading,
    venueId,
    products,
  } = data;
  const { openImportStock } = actions;

  if (!venueId) return null;

  return (
    <div className="mt-6 space-y-4">
      {stats && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon="cube-outline"
            iconColor="text-blue-400"
            label="Tổng sản phẩm"
            value={statsLoading ? '…' : String(stats.totalProducts)}
          />
          <StatCard
            icon="checkmark-circle-outline"
            iconColor="text-emerald-400"
            label="Đang bán"
            value={statsLoading ? '…' : String(stats.activeProducts)}
          />
          <StatCard
            icon="alert-circle-outline"
            iconColor="text-amber-400"
            label="Sắp hết hàng"
            value={statsLoading ? '…' : String(stats.lowStockProducts)}
          />
          <StatCard
            icon="close-circle-outline"
            iconColor="text-red-400"
            label="Hết hàng"
            value={statsLoading ? '…' : String(stats.outOfStockProducts)}
          />
        </div>
      )}

      {!lowStockLoading && lowStockProducts.length > 0 && (
        <GlassPanel card className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">
            Sản phẩm sắp hết hàng
          </h3>
          <div className="flex flex-wrap gap-2">
            {lowStockProducts.map((product) => {
              const fullProduct = products.find(
                (item) => item._id === product._id
              );
              const importTarget: VenueProductNode =
                fullProduct ??
                ({
                  _id: product._id,
                  name: product.name,
                  price: 0,
                  status: ProductStatus.Active,
                  stockQuantity: product.stockQuantity,
                  lowStockThreshold: product.lowStockThreshold,
                } as VenueProductNode);

              return (
                <button
                  key={product._id}
                  type="button"
                  className="focus-visible:ring-primary/50 rounded-full focus:outline-none focus-visible:ring-2"
                  onClick={() => openImportStock(importTarget)}
                  title="Nhập kho"
                >
                  <Badge variant="warning">
                    {product.name}: {product.stockQuantity}/
                    {product.lowStockThreshold ?? 0}
                  </Badge>
                </button>
              );
            })}
          </div>
        </GlassPanel>
      )}
    </div>
  );
}
