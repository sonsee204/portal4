/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useOwnerProductStatsPageActions } from '../_hooks/useOwnerProductStatsPageActions';
import { useOwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';
import { OwnerProductStatsHeaderSection } from '../_sections/OwnerProductStatsHeaderSection';
import { OwnerProductStatsFiltersSection } from '../_sections/OwnerProductStatsFiltersSection';
import { OwnerProductStatsKpiSection } from '../_sections/OwnerProductStatsKpiSection';
import { OwnerProductStatsChartsSection } from '../_sections/OwnerProductStatsChartsSection';
import { OwnerProductStatsAlertsSection } from '../_sections/OwnerProductStatsAlertsSection';
import { OwnerProductStatsTableSection } from '../_sections/OwnerProductStatsTableSection';
import { ProductDetailModal } from './ProductDetailModal';

export function OwnerProductStatsPageView() {
  const data = useOwnerProductStatsPageData();
  const actions = useOwnerProductStatsPageActions(data);

  return (
    <>
      <OwnerProductStatsHeaderSection data={data} actions={actions} />
      <div className="mt-6 space-y-6">
        <OwnerProductStatsFiltersSection data={data} />
        <OwnerProductStatsKpiSection data={data} />
        <OwnerProductStatsChartsSection data={data} />
        <OwnerProductStatsAlertsSection data={data} actions={actions} />
        <OwnerProductStatsTableSection data={data} actions={actions} />
      </div>
      <ProductDetailModal
        productId={actions.detailProductId}
        open={Boolean(actions.detailProductId)}
        onClose={actions.closeProductDetail}
        filter={data.baseFilter}
      />
    </>
  );
}
