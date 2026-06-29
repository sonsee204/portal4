/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { VenueEnabledOrderTypeConfig } from '@/hooks/owner';
import { resolveOrderTypeIonIcon } from '@/lib/order/resolve-order-type-icon';

interface OrderTypeOptionCardProps {
  config: VenueEnabledOrderTypeConfig;
  selected: boolean;
  onSelect: () => void;
}

export function OrderTypeOptionCard({
  config,
  selected,
  onSelect,
}: OrderTypeOptionCardProps) {
  const accent = config.color ?? '#8b5cf6';
  const iconName = resolveOrderTypeIonIcon(config.icon, config.orderType);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex min-w-[132px] flex-col items-start gap-2 rounded-xl border px-3 py-3 text-left transition-all',
        selected
          ? 'border-primary/40 bg-primary/10 shadow-sm'
          : 'border-surface-border bg-surface hover:bg-surface-hover'
      )}
    >
      <span
        className="flex size-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}22`, color: accent }}
      >
        <IonIcon name={iconName} size="sm" />
      </span>
      <span className="text-heading text-sm font-semibold">
        {config.label ?? config.orderType}
      </span>
    </button>
  );
}
