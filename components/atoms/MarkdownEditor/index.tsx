'use client';

import '@uiw/react-md-editor/markdown-editor.css';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
  label?: string;
  placeholder?: string;
  minHeight?: number;
  className?: string;
  error?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  label,
  placeholder = 'Viết nội dung với **in đậm**, *nghiêng*, danh sách, tiêu đề...',
  minHeight = 200,
  className,
  error,
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const colorMode = resolvedTheme === 'dark' ? 'dark' : 'light';

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="text-body mb-1.5 block text-sm font-medium">
          {label}
        </label>
      )}
      <div
        data-color-mode={colorMode}
        className="[&_.w-md-editor]:border-surface-border [&_.w-md-editor]:min-h-[var(--min-height)] [&_.w-md-editor]:rounded-lg [&_.w-md-editor-content]:rounded-b-lg [&_.w-md-editor-toolbar]:rounded-t-lg"
        style={{ ['--min-height' as string]: `${minHeight}px` }}
      >
        <MDEditor
          value={value}
          onChange={(v) => onChange(v ?? '')}
          preview="live"
          hideToolbar={false}
          visibleDragbar={true}
          height={minHeight}
          textareaProps={{
            placeholder,
            'aria-label': label ?? 'Markdown editor',
          }}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
