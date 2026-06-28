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
import { ScoringConfigSetsAndPointsFields } from './ScoringConfigSetsAndPointsFields';

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
        <ScoringConfigSetsAndPointsFields config={config} onPatch={patchConfig} />
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
