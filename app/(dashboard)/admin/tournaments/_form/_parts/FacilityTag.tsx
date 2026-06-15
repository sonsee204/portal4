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

interface FacilityTagProps {
  icon: string;
  label: string;
  onRemove: () => void;
}

export function FacilityTag({ icon, label, onRemove }: FacilityTagProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-border bg-surface px-3 py-1.5 text-xs font-medium text-heading transition-colors hover:border-primary/30">
      <IonIcon name={icon} size="xs" className="text-primary" />
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 rounded-full p-0.5 text-faint transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <IonIcon name="close-outline" size="xs" />
      </button>
    </span>
  );
}
