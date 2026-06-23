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

import { Badge } from '@/components/atoms/Badge';
import type { PromotionType, SportType } from '@/graphql/generated';
import type { PromotionDetailNode } from '@/hooks/owner';
import {
  PROMOTION_CATEGORY_META,
  PROMOTION_DISCOUNT_TYPE_CONFIG,
  PROMOTION_SCOPE_META,
  PROMOTION_TRIGGERS,
} from '@/lib/promotion/promotion-constants';
import { cn, formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { SPORT_TYPE_LABEL } from '@/app/(dashboard)/owner/venues/[venueId]/_hooks/owner-court.constants';
import { PromotionStatusBadge } from './PromotionStatusBadge';

function DetailRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value?: string | null;
  valueClassName?: string;
}) {
  if (!value) return null;

  return (
    <div className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4">
      <dt className="text-muted text-sm">{label}</dt>
      <dd className={cn('text-sm', valueClassName ?? 'text-body')}>{value}</dd>
    </div>
  );
}

export function PromotionDetailContent({
  promotion,
}: {
  promotion: PromotionDetailNode;
}) {
  const categoryMeta = PROMOTION_CATEGORY_META.find(
    (item) => item.id === promotion.category
  );
  const scopeMeta = PROMOTION_SCOPE_META.find(
    (item) => item.id === promotion.scope
  );
  const triggerMeta = PROMOTION_TRIGGERS.find(
    (item) => item.id === promotion.trigger
  );
  const discountLabel = PROMOTION_DISCOUNT_TYPE_CONFIG[
    promotion.type as PromotionType
  ].format(promotion.value);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <PromotionStatusBadge status={promotion.status} />
        {categoryMeta ? (
          <Badge variant="neutral">{categoryMeta.label}</Badge>
        ) : null}
        {promotion.code ? (
          <span className="text-muted font-mono text-xs">{promotion.code}</span>
        ) : null}
      </div>

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Thông tin</h3>
        <dl className="space-y-2">
          <DetailRow label="Tên" value={promotion.name} />
          <DetailRow label="Mô tả" value={promotion.description} />
          <DetailRow label="Giảm giá" value={discountLabel} />
          {promotion.maxDiscountAmount != null &&
          promotion.maxDiscountAmount > 0 ? (
            <DetailRow
              label="Giảm tối đa"
              value={formatCurrency(promotion.maxDiscountAmount)}
            />
          ) : null}
          <DetailRow
            label="Cách áp dụng"
            value={triggerMeta?.label ?? promotion.trigger}
          />
          <DetailRow
            label="Phạm vi"
            value={scopeMeta?.label ?? promotion.scope}
          />
          <DetailRow
            label="Cách tính"
            value={
              promotion.applyLevel === 'PER_HOUR'
                ? 'Theo giờ đặt'
                : 'Trên tổng đơn'
            }
          />
        </dl>
      </section>

      {(promotion.courtIds?.length ||
        promotion.sportTypes?.length ||
        promotion.productCategoryIds?.length) && (
        <section className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">Áp dụng cụ thể</h3>
          <dl className="space-y-2">
            {promotion.courtIds?.length ? (
              <DetailRow
                label="Sân"
                value={`${promotion.courtIds.length} sân đã chọn`}
              />
            ) : null}
            {promotion.sportTypes?.length ? (
              <DetailRow
                label="Môn thể thao"
                value={promotion.sportTypes
                  .map((sport: SportType) => SPORT_TYPE_LABEL[sport] ?? sport)
                  .join(', ')}
              />
            ) : null}
            {promotion.productCategoryIds?.length ? (
              <DetailRow
                label="Danh mục SP"
                value={`${promotion.productCategoryIds.length} danh mục`}
              />
            ) : null}
          </dl>
        </section>
      )}

      {promotion.applicableTimeRanges?.length ? (
        <section className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">Khung giờ</h3>
          <div className="flex flex-wrap gap-2">
            {promotion.applicableTimeRanges.map(
              (
                range: { startTime: string; endTime: string },
                index: number
              ) => (
                <Badge key={`${range.startTime}-${index}`} variant="info">
                  {range.startTime} – {range.endTime}
                </Badge>
              )
            )}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">
          Thời gian & giới hạn
        </h3>
        <dl className="space-y-2">
          <DetailRow label="Bắt đầu" value={formatDate(promotion.startDate)} />
          <DetailRow label="Kết thúc" value={formatDate(promotion.endDate)} />
          {promotion.minBookingAmount != null &&
          promotion.minBookingAmount > 0 ? (
            <DetailRow
              label="Đơn tối thiểu"
              value={formatCurrency(promotion.minBookingAmount)}
            />
          ) : null}
          {promotion.totalUsageLimit != null ? (
            <DetailRow
              label="Tổng lượt dùng"
              value={`${promotion.usageCount ?? 0}/${promotion.totalUsageLimit}`}
            />
          ) : (
            <DetailRow
              label="Đã dùng"
              value={String(promotion.usageCount ?? 0)}
            />
          )}
          {promotion.perUserLimit != null ? (
            <DetailRow
              label="Mỗi người"
              value={String(promotion.perUserLimit)}
            />
          ) : null}
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Hiển thị</h3>
        <dl className="space-y-2">
          <DetailRow
            label="Badge thẻ sân"
            value={promotion.showOnVenueCard ? 'Có' : 'Không'}
          />
          <DetailRow
            label="Trang chi tiết sân"
            value={promotion.showAsBanner ? 'Có' : 'Không'}
          />
          <DetailRow
            label="Cộng dồn"
            value={promotion.isStackable ? 'Có' : 'Không'}
          />
          <DetailRow label="Nội dung badge" value={promotion.badgeText} />
        </dl>
      </section>

      {promotion.rejectionReason ? (
        <section className="space-y-3">
          <h3 className="text-heading text-sm font-semibold">Từ chối</h3>
          <DetailRow
            label="Lý do"
            value={promotion.rejectionReason}
            valueClassName="text-red-400"
          />
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-heading text-sm font-semibold">Hệ thống</h3>
        <dl className="space-y-2">
          <DetailRow
            label="Tạo bởi"
            value={
              promotion.createdByUser?.displayName ??
              promotion.createdByUser?.fullName
            }
          />
          <DetailRow
            label="Tạo lúc"
            value={formatDateTime(promotion.createdAt)}
          />
          {promotion.reviewedByUser ? (
            <DetailRow
              label="Duyệt bởi"
              value={
                promotion.reviewedByUser.displayName ??
                promotion.reviewedByUser.fullName
              }
            />
          ) : null}
          {promotion.reviewedAt ? (
            <DetailRow
              label="Duyệt lúc"
              value={formatDateTime(promotion.reviewedAt)}
            />
          ) : null}
        </dl>
      </section>
    </div>
  );
}
