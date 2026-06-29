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
import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';

interface DisplayOptionsSectionProps {
  data: CreatePromotionPageData;
}

export function DisplayOptionsSection({ data }: DisplayOptionsSectionProps) {
  const { formValues, setField } = data;

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading flex items-center gap-2 text-base font-semibold">
        <IonIcon name="eye-outline" size="sm" className="text-purple-500" />
        Hiển thị
      </h2>

      <div className="space-y-3">
        <div>
          <Checkbox
            label="Hiện badge trên thẻ sân"
            checked={formValues.showOnVenueCard}
            onChange={(event) =>
              setField('showOnVenueCard', event.target.checked)
            }
          />
          <p className="text-muted mt-1 ml-6 text-xs">
            Hiển thị badge & thông tin giảm giá trên danh sách sân
          </p>
        </div>

        <div>
          <Checkbox
            label="Hiện trong trang chi tiết sân"
            checked={formValues.showAsBanner}
            onChange={(event) => setField('showAsBanner', event.target.checked)}
          />
          <p className="text-muted mt-1 ml-6 text-xs">
            Hiển thị khuyến mãi trong phần khuyến mãi ở trang chi tiết sân
          </p>
        </div>

        {!data.isEditing ? (
          <div>
            <Checkbox
              label="Cho phép cộng dồn"
              checked={formValues.isStackable}
              onChange={(event) =>
                setField('isStackable', event.target.checked)
              }
            />
            <p className="text-muted mt-1 ml-6 text-xs">
              Có thể kết hợp với khuyến mãi khác
            </p>
          </div>
        ) : null}
      </div>

      <Input
        label="Nội dung badge"
        placeholder="VD: -20% hoặc Flash Sale"
        value={formValues.badgeText}
        onChange={(event) => setField('badgeText', event.target.value)}
      />

      <Input
        label="Màu badge"
        placeholder="#8B5CF6"
        value={formValues.badgeColor}
        onChange={(event) => setField('badgeColor', event.target.value)}
      />
    </GlassPanel>
  );
}
