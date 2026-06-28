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
import type { ScoringConfigInput } from '@/graphql/generated';

export interface ScoringConfigSetsAndPointsFieldsProps {
  config: ScoringConfigInput;
  onPatch: (partial: Partial<ScoringConfigInput>) => void;
}

export function ScoringConfigSetsAndPointsFields({
  config,
  onPatch,
}: ScoringConfigSetsAndPointsFieldsProps) {
  return (
    <div className="bg-surface/60 border-surface-border space-y-3 rounded-xl border p-4">
      <p className="text-heading text-xs font-semibold">Tùy chỉnh điểm</p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="Số ván (best of)"
          type="number"
          min={1}
          value={String(config.bestOf)}
          onChange={(e) => {
            const bestOf = parseInt(e.target.value, 10) || 1;
            onPatch({
              bestOf,
              setsToWin: Math.ceil(bestOf / 2),
            });
          }}
        />
        <Input
          label="Set cần thắng"
          type="number"
          min={1}
          value={String(config.setsToWin)}
          onChange={(e) =>
            onPatch({ setsToWin: parseInt(e.target.value, 10) || 1 })
          }
        />
        <Input
          label="Điểm chạm / set"
          type="number"
          min={1}
          value={String(config.pointsPerSet)}
          onChange={(e) => {
            const pointsPerSet = parseInt(e.target.value, 10) || 1;
            onPatch({
              pointsPerSet,
              deuceAt: config.deuceEnabled ? pointsPerSet - 1 : config.deuceAt,
              midGameIntervalAt: Math.ceil(pointsPerSet / 2),
            });
          }}
        />
        <Input
          label="Điểm deuce"
          type="number"
          min={0}
          value={String(config.deuceAt)}
          disabled={!config.deuceEnabled}
          onChange={(e) =>
            onPatch({ deuceAt: parseInt(e.target.value, 10) || 0 })
          }
        />
        <Input
          label="Điểm trần (0 = không)"
          type="number"
          min={0}
          value={String(config.maxPoints)}
          onChange={(e) =>
            onPatch({ maxPoints: parseInt(e.target.value, 10) || 0 })
          }
        />
        <Input
          label="Thắng cách (điểm)"
          type="number"
          min={1}
          value={String(config.winByMargin)}
          onChange={(e) =>
            onPatch({ winByMargin: parseInt(e.target.value, 10) || 2 })
          }
        />
        <Input
          label="Nghỉ giữa hiệp tại"
          type="number"
          min={0}
          value={String(config.midGameIntervalAt ?? 0)}
          onChange={(e) =>
            onPatch({
              midGameIntervalAt: parseInt(e.target.value, 10) || 0,
            })
          }
        />
      </div>
      <label className="flex cursor-pointer items-center gap-2.5">
        <button
          type="button"
          role="switch"
          aria-checked={config.deuceEnabled}
          onClick={() =>
            onPatch({
              deuceEnabled: !config.deuceEnabled,
              deuceAt: !config.deuceEnabled
                ? Math.max(config.pointsPerSet - 1, 1)
                : config.deuceAt,
            })
          }
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
            config.deuceEnabled ? 'bg-primary' : 'bg-surface-border'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
              config.deuceEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className="text-heading text-sm">Bật luật deuce (cân cứ)</span>
      </label>
    </div>
  );
}
