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

import { Checkbox } from '@/components/atoms/Checkbox';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { PROMOTION_SCOPE_META } from '@/lib/promotion/promotion-constants';
import { SPORT_TYPE_OPTIONS } from '@/app/(dashboard)/owner/venues/[venueId]/_hooks/owner-court.constants';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';
import { PromotionOptionCard } from '../_components/PromotionOptionCard';

interface ScopeSectionProps {
  data: CreatePromotionPageData;
}

export function ScopeSection({ data }: ScopeSectionProps) {
  const {
    formValues,
    setField,
    availableScopes,
    courts,
    courtsLoading,
    categories,
    categoriesLoading,
    formErrors,
  } = data;

  const scopeOptions = PROMOTION_SCOPE_META.filter((item) =>
    availableScopes.includes(item.id)
  );

  const toggleCourt = (courtId: string) => {
    const selected = formValues.selectedCourtIds;
    setField(
      'selectedCourtIds',
      selected.includes(courtId)
        ? selected.filter((id) => id !== courtId)
        : [...selected, courtId]
    );
  };

  const toggleSport = (sport: string) => {
    const selected = formValues.selectedSportTypes;
    setField(
      'selectedSportTypes',
      selected.includes(sport)
        ? selected.filter((id) => id !== sport)
        : [...selected, sport]
    );
  };

  const toggleCategory = (categoryId: string) => {
    const selected = formValues.selectedProductCategoryIds;
    setField(
      'selectedProductCategoryIds',
      selected.includes(categoryId)
        ? selected.filter((id) => id !== categoryId)
        : [...selected, categoryId]
    );
  };

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon name="layers-outline" size="sm" className="text-purple-500" />
        Phạm vi áp dụng
      </h2>

      {formValues.category === 'RECURRING' ? (
        <p className="text-muted text-xs">
          Loại Đặt cố định chỉ áp dụng cho đặt sân
        </p>
      ) : null}

      <div className="grid gap-3">
        {scopeOptions.map((item) => (
          <PromotionOptionCard
            key={item.id}
            label={item.label}
            description={item.description}
            icon={item.icon}
            selected={formValues.scope === item.id}
            onSelect={() => setField('scope', item.id)}
          />
        ))}
      </div>

      {formValues.scope === 'SPECIFIC_COURTS' ? (
        <div className="space-y-2">
          <p className="text-muted text-sm font-medium">Chọn sân áp dụng</p>
          <QueryState
            loading={courtsLoading}
            empty={courts.length === 0}
            emptyMessage="Chưa có sân."
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {courts.map((court) => (
                <label
                  key={court._id}
                  className="border-surface-border flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2"
                >
                  <Checkbox
                    checked={formValues.selectedCourtIds.includes(court._id)}
                    onChange={() => toggleCourt(court._id)}
                  />
                  <span className="text-body text-sm">{court.name}</span>
                </label>
              ))}
            </div>
          </QueryState>
          {formErrors.selectedCourtIds?.message ? (
            <p className="text-xs text-red-500">
              {formErrors.selectedCourtIds.message}
            </p>
          ) : null}
        </div>
      ) : null}

      {formValues.scope === 'SPECIFIC_SPORT' ? (
        <div className="space-y-2">
          <p className="text-muted text-sm font-medium">Chọn môn thể thao</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {SPORT_TYPE_OPTIONS.map((sport) => (
              <label
                key={sport.value}
                className="border-surface-border flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2"
              >
                <Checkbox
                  checked={formValues.selectedSportTypes.includes(sport.value)}
                  onChange={() => toggleSport(sport.value)}
                />
                <span className="text-body text-sm">{sport.label}</span>
              </label>
            ))}
          </div>
          {formErrors.selectedSportTypes?.message ? (
            <p className="text-xs text-red-500">
              {formErrors.selectedSportTypes.message}
            </p>
          ) : null}
        </div>
      ) : null}

      {formValues.scope === 'PRODUCTS' ? (
        <div className="space-y-2">
          <p className="text-muted text-sm font-medium">
            Chọn danh mục sản phẩm
          </p>
          <QueryState
            loading={categoriesLoading}
            empty={categories.length === 0}
            emptyMessage="Chưa có danh mục sản phẩm."
          >
            <div className="grid gap-2 sm:grid-cols-2">
              {categories.map((category) => (
                <label
                  key={category._id}
                  className="border-surface-border flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2"
                >
                  <Checkbox
                    checked={formValues.selectedProductCategoryIds.includes(
                      category._id
                    )}
                    onChange={() => toggleCategory(category._id)}
                  />
                  <span className="text-body text-sm">{category.name}</span>
                </label>
              ))}
            </div>
          </QueryState>
          {formErrors.selectedProductCategoryIds?.message ? (
            <p className="text-xs text-red-500">
              {formErrors.selectedProductCategoryIds.message}
            </p>
          ) : null}
        </div>
      ) : null}
    </GlassPanel>
  );
}
