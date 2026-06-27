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
import { IonIcon } from '@/components/atoms/IonIcon';
import { Input } from '@/components/atoms/Input';
import { FilterChips } from '@/components/molecules/FilterChips';
import { ScoringSystem, type ScoringConfigInput } from '@/graphql/generated';
import { useScoringTemplates } from '@/hooks/scoring/useScoringTemplates';
import {
  CUSTOM_SCORING_TEMPLATE_ID,
  FALLBACK_SCORING_BY_SPORT,
  formatScoringSummary,
} from '@/lib/scoring/scoring-form-defaults';
import type { SportType } from '@/types/tournament-form';

export interface ScoringConfigEditorProps {
  sport: SportType;
  templateId: string;
  config: ScoringConfigInput;
  onTemplateIdChange: (templateId: string) => void;
  onConfigChange: (config: ScoringConfigInput) => void;
}

export function ScoringConfigEditor({
  sport,
  templateId,
  config,
  onTemplateIdChange,
  onConfigChange,
}: ScoringConfigEditorProps) {
  const { templates, loading } = useScoringTemplates(sport);

  const availableTemplates = useMemo(() => {
    if (templates.length > 0) return templates;
    const fallback = FALLBACK_SCORING_BY_SPORT[sport];
    return [
      {
        id: fallback.templateId,
        label: 'Mặc định',
        description: formatScoringSummary(fallback.config),
        config: fallback.config,
      },
    ];
  }, [templates, sport]);

  const isCustom = templateId === CUSTOM_SCORING_TEMPLATE_ID;
  const isSetsAndPoints = config.scoringSystem === ScoringSystem.SetsAndPoints;
  const isTimed =
    config.scoringSystem === ScoringSystem.TimedGoals ||
    config.scoringSystem === ScoringSystem.TimedPoints;
  const isFrames = config.scoringSystem === ScoringSystem.Frames;

  const chips = useMemo(
    () => [
      ...availableTemplates.map((t) => ({ label: t.label, value: t.id })),
      { label: 'Tùy chỉnh', value: CUSTOM_SCORING_TEMPLATE_ID },
    ],
    [availableTemplates]
  );

  const activeTemplate = availableTemplates.find((t) => t.id === templateId);

  const handleTemplateChange = (value: string) => {
    if (value === CUSTOM_SCORING_TEMPLATE_ID) {
      onTemplateIdChange(CUSTOM_SCORING_TEMPLATE_ID);
      return;
    }
    const selected = availableTemplates.find((t) => t.id === value);
    if (selected) {
      onTemplateIdChange(selected.id);
      onConfigChange({ ...selected.config });
    }
  };

  const patchConfig = (partial: Partial<ScoringConfigInput>) => {
    onTemplateIdChange(CUSTOM_SCORING_TEMPLATE_ID);
    onConfigChange({ ...config, ...partial });
  };

  return (
    <div className="border-surface-border space-y-4 border-t pt-4">
      <div>
        <h4 className="text-heading mb-1 flex items-center gap-2 text-xs font-semibold">
          <IonIcon
            name="stats-chart-outline"
            size="sm"
            className="text-primary"
          />
          Thể thức tính điểm
        </h4>
        <p className="text-muted mb-3 text-xs">
          Chọn mẫu luật chấm điểm cho nội dung này hoặc tùy chỉnh chi tiết.
        </p>
        {loading && templates.length === 0 ? (
          <p className="text-muted text-xs">Đang tải mẫu luật...</p>
        ) : (
          <FilterChips
            chips={chips}
            active={templateId}
            onChange={handleTemplateChange}
          />
        )}
        {!isCustom && activeTemplate && (
          <p className="text-muted mt-2 text-xs">
            {activeTemplate.description}
          </p>
        )}
        <p className="text-primary mt-2 text-xs font-medium">
          {formatScoringSummary(config)}
        </p>
      </div>

      {(isCustom || isSetsAndPoints) && isSetsAndPoints && (
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
                patchConfig({
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
                patchConfig({ setsToWin: parseInt(e.target.value, 10) || 1 })
              }
            />
            <Input
              label="Điểm chạm / set"
              type="number"
              min={1}
              value={String(config.pointsPerSet)}
              onChange={(e) => {
                const pointsPerSet = parseInt(e.target.value, 10) || 1;
                patchConfig({
                  pointsPerSet,
                  deuceAt: config.deuceEnabled
                    ? pointsPerSet - 1
                    : config.deuceAt,
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
                patchConfig({ deuceAt: parseInt(e.target.value, 10) || 0 })
              }
            />
            <Input
              label="Điểm trần (0 = không)"
              type="number"
              min={0}
              value={String(config.maxPoints)}
              onChange={(e) =>
                patchConfig({ maxPoints: parseInt(e.target.value, 10) || 0 })
              }
            />
            <Input
              label="Thắng cách (điểm)"
              type="number"
              min={1}
              value={String(config.winByMargin)}
              onChange={(e) =>
                patchConfig({ winByMargin: parseInt(e.target.value, 10) || 2 })
              }
            />
            <Input
              label="Nghỉ giữa hiệp tại"
              type="number"
              min={0}
              value={String(config.midGameIntervalAt ?? 0)}
              onChange={(e) =>
                patchConfig({
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
                patchConfig({
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
            <span className="text-heading text-sm">
              Bật luật deuce (cân cứ)
            </span>
          </label>
        </div>
      )}

      {(isCustom || isTimed) && isTimed && (
        <div className="bg-surface/60 border-surface-border space-y-3 rounded-xl border p-4">
          <p className="text-heading text-xs font-semibold">
            Thi đấu theo hiệp
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Số hiệp"
              type="number"
              min={1}
              value={String(config.periodsCount)}
              onChange={(e) =>
                patchConfig({ periodsCount: parseInt(e.target.value, 10) || 1 })
              }
            />
            <Input
              label="Phút / hiệp"
              type="number"
              min={1}
              value={String(config.periodDurationMinutes)}
              onChange={(e) =>
                patchConfig({
                  periodDurationMinutes: parseInt(e.target.value, 10) || 1,
                })
              }
            />
          </div>
        </div>
      )}

      {(isCustom || isFrames) && isFrames && (
        <div className="bg-surface/60 border-surface-border space-y-3 rounded-xl border p-4">
          <Input
            label="Frames cần thắng"
            type="number"
            min={1}
            value={String(config.framesToWin ?? 5)}
            onChange={(e) =>
              patchConfig({ framesToWin: parseInt(e.target.value, 10) || 5 })
            }
          />
        </div>
      )}
    </div>
  );
}
