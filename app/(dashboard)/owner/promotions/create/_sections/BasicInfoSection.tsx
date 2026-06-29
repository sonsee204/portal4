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

import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';

interface BasicInfoSectionProps {
  data: CreatePromotionPageData;
}

export function BasicInfoSection({ data }: BasicInfoSectionProps) {
  const { formValues, setField, formErrors } = data;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon
          name="information-circle-outline"
          size="sm"
          className="text-purple-500"
        />
        Thông tin cơ bản
      </h2>
      <Input
        label="Tên khuyến mãi *"
        placeholder="VD: Giảm 20% cuối tuần"
        value={formValues.name}
        onChange={(event) => setField('name', event.target.value)}
        error={formErrors.name?.message}
      />
      <Input
        label="Mô tả"
        placeholder="Mô tả chi tiết về khuyến mãi..."
        value={formValues.description}
        onChange={(event) => setField('description', event.target.value)}
        error={formErrors.description?.message}
      />
    </GlassPanel>
  );
}
