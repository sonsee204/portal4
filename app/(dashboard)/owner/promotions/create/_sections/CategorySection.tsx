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

import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import {
  CATEGORY_COLOR_MAP,
  PROMOTION_CATEGORY_META,
} from '@/lib/promotion/promotion-constants';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';
import { PromotionOptionCard } from '../_components/PromotionOptionCard';

interface CategorySectionProps {
  data: CreatePromotionPageData;
}

export function CategorySection({ data }: CategorySectionProps) {
  const { formValues, setField } = data;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon name="grid-outline" size="sm" className="text-purple-500" />
        Phân loại
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {PROMOTION_CATEGORY_META.map((item) => (
          <PromotionOptionCard
            key={item.id}
            label={item.label}
            description={item.description}
            icon={item.icon}
            accent={CATEGORY_COLOR_MAP[item.id]}
            selected={formValues.category === item.id}
            onSelect={() => setField('category', item.id)}
          />
        ))}
      </div>
    </GlassPanel>
  );
}
