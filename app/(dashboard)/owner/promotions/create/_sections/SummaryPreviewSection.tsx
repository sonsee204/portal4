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

import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { VenueAction } from '@/graphql/generated';
import {
  PROMOTION_CATEGORY_META,
  PROMOTION_DISCOUNT_TYPE_CONFIG,
  PROMOTION_SCOPE_META,
  PROMOTION_TRIGGERS,
} from '@/lib/promotion/promotion-constants';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { CreatePromotionPageActions } from '../_hooks/useCreatePromotionPageActions';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';

interface SummaryPreviewSectionProps {
  data: CreatePromotionPageData;
  actions: CreatePromotionPageActions;
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-muted shrink-0">{label}</span>
      <span className="text-body text-right font-medium">{value}</span>
    </div>
  );
}

export function SummaryPreviewSection({
  data,
  actions,
}: SummaryPreviewSectionProps) {
  const { formValues, isEditing, loadingPromotion } = data;
  const { handleSubmit, isSubmitting } = actions;

  const categoryLabel = PROMOTION_CATEGORY_META.find(
    (item) => item.id === formValues.category
  )?.label;
  const scopeLabel = PROMOTION_SCOPE_META.find(
    (item) => item.id === formValues.scope
  )?.label;
  const triggerLabel = PROMOTION_TRIGGERS.find(
    (item) => item.id === formValues.trigger
  )?.label;
  const discountLabel = formValues.value
    ? PROMOTION_DISCOUNT_TYPE_CONFIG[formValues.type].format(
        Number(formValues.value)
      )
    : null;

  return (
    <GlassPanel
      card
      className="xl:sticky xl:top-4 xl:max-h-[calc(100dvh-6rem)] xl:overflow-y-auto"
    >
      <h2 className="text-heading mb-4 text-base font-semibold">Tóm tắt</h2>

      <QueryState loading={loadingPromotion} empty={false} emptyMessage="">
        <div className="space-y-3">
          <SummaryRow label="Tên" value={formValues.name || '—'} />
          <SummaryRow label="Loại" value={categoryLabel} />
          <SummaryRow label="Giảm giá" value={discountLabel} />
          <SummaryRow label="Phạm vi" value={scopeLabel} />
          <SummaryRow label="Áp dụng" value={triggerLabel} />
          {formValues.code ? (
            <SummaryRow label="Mã" value={formValues.code} />
          ) : null}
          <SummaryRow
            label="Thời gian"
            value={`${formatDate(formValues.startDate)} – ${formatDate(formValues.endDate)}`}
          />
          {formValues.minBookingAmount ? (
            <SummaryRow
              label="Đơn tối thiểu"
              value={formatCurrency(Number(formValues.minBookingAmount))}
            />
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {formValues.showOnVenueCard ? (
            <Badge variant="info">Badge thẻ sân</Badge>
          ) : null}
          {formValues.showAsBanner ? (
            <Badge variant="info">Chi tiết sân</Badge>
          ) : null}
          {formValues.isStackable && !isEditing ? (
            <Badge variant="neutral">Cộng dồn</Badge>
          ) : null}
          {formValues.submitForApproval && !isEditing ? (
            <Badge variant="warning">Gửi duyệt</Badge>
          ) : null}
        </div>
      </QueryState>

      <VenueActionGate action={VenueAction.ManagePromotions}>
        <Button
          type="button"
          className="mt-6 w-full"
          onClick={handleSubmit}
          disabled={isSubmitting || loadingPromotion}
        >
          {isSubmitting
            ? 'Đang lưu...'
            : isEditing
              ? 'Cập nhật khuyến mãi'
              : 'Tạo khuyến mãi'}
        </Button>
      </VenueActionGate>
    </GlassPanel>
  );
}
