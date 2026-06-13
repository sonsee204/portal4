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
import { Badge } from '@/components/atoms/Badge';
import { Toggle } from '@/components/atoms/Toggle';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { SportModule } from '@/types/mock';

const statusVariant: Record<string, 'success' | 'warning' | 'danger'> = {
  online: 'success',
  maintenance: 'warning',
  offline: 'danger',
};

export function ModuleCard({
  module,
  onToggle,
}: {
  module: SportModule;
  onToggle: (sport: string) => void;
}) {
  const statusColor = {
    online: 'bg-emerald-500',
    maintenance: 'bg-orange-500',
    offline: 'bg-red-500',
  }[module.status];

  return (
    <GlassPanel card className="relative flex flex-col">
      {/* Status dot - absolute top-right */}
      <div className="absolute top-6 right-6">
        <div
          className={`h-3 w-3 rounded-full ${statusColor} shadow-[0_0_10px_currentColor] ${module.enabled ? 'animate-pulse' : ''}`}
        />
      </div>

      {/* Icon */}
      <div className="bg-primary/20 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
        <IonIcon name={module.icon} size="lg" />
      </div>

      {/* Title + Status */}
      <h3 className="mb-1 text-lg font-semibold text-heading">{module.label}</h3>
      <Badge variant={statusVariant[module.status]} className="mb-6 w-fit">
        {module.status}
      </Badge>

      {/* Footer: Active users + Toggle */}
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs tracking-wider text-muted uppercase">
            Active Users
          </p>
          <p className="text-2xl font-bold text-heading">{module.activeUsers}</p>
        </div>
        <Toggle
          checked={module.enabled}
          onChange={() => onToggle(module.sport)}
        />
      </div>
    </GlassPanel>
  );
}
