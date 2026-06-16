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
import type { VenueAction } from '@/graphql/generated';
import {
  CONFIGURABLE_VENUE_ACTIONS,
  getVenueActionLabel,
} from '@/lib/venue/venue-action-labels';

interface StaffPermissionsFormProps {
  selected: VenueAction[];
  onChange: (permissions: VenueAction[]) => void;
  disabled?: boolean;
}

export function StaffPermissionsForm({
  selected,
  onChange,
  disabled,
}: StaffPermissionsFormProps) {
  const toggle = (action: VenueAction) => {
    if (disabled) return;
    onChange(
      selected.includes(action)
        ? selected.filter((item) => item !== action)
        : [...selected, action]
    );
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {CONFIGURABLE_VENUE_ACTIONS.map((action) => (
        <Checkbox
          key={action}
          id={`perm-${action}`}
          label={getVenueActionLabel(action)}
          checked={selected.includes(action)}
          disabled={disabled}
          onChange={() => toggle(action)}
        />
      ))}
    </div>
  );
}
