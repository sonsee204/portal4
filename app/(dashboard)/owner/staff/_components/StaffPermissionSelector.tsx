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

import { useMemo } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Checkbox } from '@/components/atoms/Checkbox';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { cn } from '@/lib/utils';
import type { VenueAction } from '@/graphql/generated';
import {
  getImpliedPermissionHint,
  isDefaultPermission,
  isPresetFullySelected,
  PERMISSION_GROUPS,
  PERMISSION_PRESETS,
  togglePresetPermissions,
  type PermissionPresetKey,
} from '@/lib/venue/permission-groups';
import {
  getVenueActionDescription,
  getVenueActionLabel,
} from '@/lib/venue/venue-action-labels';

function getAssignablePermissions(): VenueAction[] {
  return PERMISSION_GROUPS.flatMap((group) =>
    group.permissions.filter((action) => !isDefaultPermission(action))
  );
}

interface StaffPermissionSelectorProps {
  selected: VenueAction[];
  onChange: (permissions: VenueAction[]) => void;
  disabled?: boolean;
}

function toggleable(
  selected: VenueAction[],
  action: VenueAction
): VenueAction[] {
  return selected.includes(action)
    ? selected.filter((item) => item !== action)
    : [...selected, action];
}

export function StaffPermissionSelector({
  selected,
  onChange,
  disabled,
}: StaffPermissionSelectorProps) {
  const presetKeys = useMemo(
    () => Object.keys(PERMISSION_PRESETS) as PermissionPresetKey[],
    []
  );

  const togglePreset = (key: PermissionPresetKey) => {
    if (disabled) return;
    onChange(togglePresetPermissions(selected, key));
  };

  const toggleGroup = (groupPermissions: VenueAction[]) => {
    if (disabled) return;
    const toggleablePerms = groupPermissions.filter(
      (action) => !isDefaultPermission(action)
    );
    if (toggleablePerms.length === 0) return;

    const allSelected = toggleablePerms.every((action) =>
      selected.includes(action)
    );
    if (allSelected) {
      onChange(selected.filter((action) => !toggleablePerms.includes(action)));
      return;
    }
    onChange([...new Set([...selected, ...toggleablePerms])]);
  };

  const assignable = getAssignablePermissions();
  const allAssignableSelected = assignable.every((action) =>
    selected.includes(action)
  );

  const toggleAll = () => {
    if (disabled) return;
    if (allAssignableSelected) {
      onChange(selected.filter((action) => !assignable.includes(action)));
      return;
    }
    onChange([...new Set([...selected, ...assignable])]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-muted text-xs font-semibold tracking-wide uppercase">
          Mẫu quyền nhanh
        </p>
        <button
          type="button"
          disabled={disabled}
          onClick={toggleAll}
          className="text-primary text-xs font-medium hover:underline disabled:opacity-50"
        >
          {allAssignableSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
        </button>
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          {presetKeys.map((key) => {
            const preset = PERMISSION_PRESETS[key];
            const isSelected = isPresetFullySelected(selected, key);
            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                aria-pressed={isSelected}
                onClick={() => togglePreset(key)}
                className={cn(
                  'border-surface-border hover:border-primary/40 hover:bg-primary/5 rounded-xl border px-3 py-2 text-left transition-colors',
                  isSelected &&
                    'border-primary/50 bg-primary/10 ring-primary/20 ring-1',
                  disabled && 'pointer-events-none opacity-50'
                )}
              >
                <span className="text-heading block text-sm font-medium">
                  {preset.label}
                </span>
                <span className="text-faint block text-xs">
                  {preset.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        {PERMISSION_GROUPS.map((group) => {
          const toggleablePerms = group.permissions.filter(
            (action) => !isDefaultPermission(action)
          );
          const selectedInGroup = toggleablePerms.filter((action) =>
            selected.includes(action)
          ).length;

          return (
            <GlassPanel key={group.id} card className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <IonIcon
                    name={group.icon}
                    size="sm"
                    className="text-primary"
                  />
                  <h4 className="text-heading text-sm font-semibold">
                    {group.title}
                  </h4>
                  {toggleablePerms.length > 0 ? (
                    <Badge variant="neutral">
                      {selectedInGroup}/{toggleablePerms.length}
                    </Badge>
                  ) : null}
                </div>
                {toggleablePerms.length > 0 ? (
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleGroup(group.permissions)}
                    className="text-primary text-xs font-medium hover:underline disabled:opacity-50"
                  >
                    Chọn nhóm
                  </button>
                ) : null}
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {group.permissions.map((action) => {
                  const isLocked = isDefaultPermission(action);
                  const impliedHint = getImpliedPermissionHint(action);
                  const description = getVenueActionDescription(action);

                  return (
                    <div
                      key={action}
                      className={cn(
                        'border-surface-border rounded-lg border p-3',
                        isLocked && 'bg-surface/40'
                      )}
                    >
                      <Checkbox
                        id={`perm-${action}`}
                        label={getVenueActionLabel(action)}
                        checked={isLocked || selected.includes(action)}
                        disabled={disabled || isLocked}
                        onChange={() => onChange(toggleable(selected, action))}
                      />
                      {description ? (
                        <p className="text-faint mt-1 pl-7 text-xs leading-relaxed">
                          {description}
                        </p>
                      ) : null}
                      {impliedHint && selected.includes(action) ? (
                        <p className="text-primary mt-1 pl-7 text-xs">
                          {impliedHint}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
}
