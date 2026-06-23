/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useOwnerStockHistoryPageActions } from '../_hooks/useOwnerStockHistoryPageActions';
import { useOwnerStockHistoryPageData } from '../_hooks/useOwnerStockHistoryPageData';
import { OwnerStockHistoryHeaderSection } from '../_sections/OwnerStockHistoryHeaderSection';
import { OwnerStockHistoryFiltersSection } from '../_sections/OwnerStockHistoryFiltersSection';
import { OwnerStockHistoryTableSection } from '../_sections/OwnerStockHistoryTableSection';
import { ProductDetailModal } from '@/app/(dashboard)/owner/stats/products/_components/ProductDetailModal';

export function OwnerStockHistoryPageView() {
  const data = useOwnerStockHistoryPageData();
  const actions = useOwnerStockHistoryPageActions(data);

  return (
    <>
      <OwnerStockHistoryHeaderSection data={data} actions={actions} />
      <div className="mt-6 space-y-6">
        <OwnerStockHistoryFiltersSection data={data} />
        <OwnerStockHistoryTableSection data={data} actions={actions} />
      </div>
      <ProductDetailModal
        productId={actions.detailProductId}
        open={Boolean(actions.detailProductId)}
        onClose={actions.closeProductDetail}
        filter={data.reportFilter}
        initialTab={actions.detailInitialTab}
      />
    </>
  );
}
