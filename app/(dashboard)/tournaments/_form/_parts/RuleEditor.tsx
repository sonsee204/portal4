'use client';

import { useState } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Input } from '@/components/atoms/Input';
import { MarkdownEditor } from '@/components/atoms/MarkdownEditor';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { TournamentFormData } from '@/types/tournament-form';

interface RuleEditorProps {
  index: number;
  control: Control<TournamentFormData>;
  onRemove: () => void;
  canRemove: boolean;
}

export function RuleEditor({
  index,
  control,
  onRemove,
  canRemove,
}: RuleEditorProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border-surface-border bg-surface/50 rounded-xl border transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3 p-4">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-muted hover:text-heading shrink-0 transition-colors"
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
            className="text-faint hover:bg-danger/10 hover:text-danger shrink-0 rounded-lg p-1 transition-colors"
          >
            <IonIcon name="trash-outline" size="sm" />
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-surface-border border-t px-4 pt-3 pb-4">
          <Controller
            name={`rules.${index}.content`}
            control={control}
            render={({ field }) => (
              <MarkdownEditor
                value={field.value}
                onChange={field.onChange}
                label="Nội dung chi tiết"
                placeholder="Nội dung thể lệ. Hỗ trợ **in đậm**, *nghiêng*, danh sách..."
                minHeight={120}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}
