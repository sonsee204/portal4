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

import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { VenueAction } from '@/graphql/generated';
import { useCreatePromotionPageActions } from './_hooks/useCreatePromotionPageActions';
import { useCreatePromotionPageData } from './_hooks/useCreatePromotionPageData';
import { ApplyLevelSection } from './_sections/ApplyLevelSection';
import { BasicInfoSection } from './_sections/BasicInfoSection';
import { CategorySection } from './_sections/CategorySection';
import { CreatePromotionHeaderSection } from './_sections/CreatePromotionHeaderSection';
import { DateRangeSection } from './_sections/DateRangeSection';
import { DiscountTypeSection } from './_sections/DiscountTypeSection';
import { DisplayOptionsSection } from './_sections/DisplayOptionsSection';
import { ScopeSection } from './_sections/ScopeSection';
import { SubmitOptionsSection } from './_sections/SubmitOptionsSection';
import { SummaryPreviewSection } from './_sections/SummaryPreviewSection';
import { TriggerSection } from './_sections/TriggerSection';
import { UsageLimitsSection } from './_sections/UsageLimitsSection';

export default function CreatePromotionPage() {
  const data = useCreatePromotionPageData();
  const actions = useCreatePromotionPageActions(data);

  return (
    <VenueActionGate
      action={VenueAction.ManagePromotions}
      fallback={
        <GlassPanel card className="mt-6">
          <p className="text-muted text-sm">
            Bạn không có quyền tạo khuyến mãi tại cơ sở này.
          </p>
        </GlassPanel>
      }
    >
      <CreatePromotionHeaderSection data={data} actions={actions} />
      <QueryState loading={data.loadingPromotion} empty={false} emptyMessage="">
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="space-y-6">
            <BasicInfoSection data={data} />
            <CategorySection data={data} />
            <DiscountTypeSection data={data} />
            <ApplyLevelSection data={data} />
            <ScopeSection data={data} />
            <TriggerSection data={data} />
            <DateRangeSection data={data} />
            <UsageLimitsSection data={data} />
            <DisplayOptionsSection data={data} />
            <SubmitOptionsSection data={data} />
          </div>
          <SummaryPreviewSection data={data} actions={actions} />
        </div>
      </QueryState>
    </VenueActionGate>
  );
}
