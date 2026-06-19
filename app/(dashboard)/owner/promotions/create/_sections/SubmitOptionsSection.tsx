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
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';

interface SubmitOptionsSectionProps {
  data: CreatePromotionPageData;
}

export function SubmitOptionsSection({ data }: SubmitOptionsSectionProps) {
  const { formValues, setField, isEditing } = data;

  if (isEditing) return null;

  return (
    <GlassPanel card className="space-y-3">
      <Checkbox
        label="Gửi duyệt ngay"
        checked={formValues.submitForApproval}
        onChange={(event) =>
          setField('submitForApproval', event.target.checked)
        }
      />
      <p className="text-muted ml-6 text-xs">
        Gửi cho chủ sân duyệt sau khi tạo
      </p>
    </GlassPanel>
  );
}
