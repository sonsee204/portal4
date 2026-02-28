'use client';

import { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { TournamentFormData } from '@/types/tournament-form';

interface RuleEditorProps {
  index: number;
  control: Control<TournamentFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export function RuleEditor({ index, control, onRemove, canRemove }: RuleEditorProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-surface-border bg-surface/50 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="shrink-0 text-muted transition-colors hover:text-heading"
        >
          <IonIcon
            name={expanded ? 'chevron-down-outline' : 'chevron-forward-outline'}
            size="sm"
          />
        </button>

        <div className="flex-1">
          <Controller
            name={`rules.${index}.title`}
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder={`Tiêu đề thể lệ ${index + 1}`}
                leftIcon="document-text-outline"
              />
            )}
          />
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-lg p-1 text-faint transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <IonIcon name="trash-outline" size="sm" />
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t border-surface-border px-4 pb-4 pt-3">
          <Controller
            name={`rules.${index}.content`}
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Nội dung chi tiết..."
                rows={3}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}
