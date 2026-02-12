'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import { Badge } from '@/components/atoms/Badge';
import { Toggle } from '@/components/atoms/Toggle';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { SportModule } from '@/types/portal';

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
  return (
    <GlassPanel card className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 text-primary flex h-12 w-12 items-center justify-center rounded-xl">
            <IonIcon name={module.icon} size="md" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{module.label}</h4>
            <Badge variant={statusVariant[module.status]} className="mt-1">
              {module.status}
            </Badge>
          </div>
        </div>
        <Toggle
          checked={module.enabled}
          onChange={() => onToggle(module.sport)}
        />
      </div>
      <div className="border-surface-border flex items-center justify-between border-t pt-3 text-xs text-slate-400">
        <span>Active Users</span>
        <span className="font-bold text-white">{module.activeUsers}</span>
      </div>
    </GlassPanel>
  );
}
