'use client';

import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { ApiKey } from '@/types/mock';

export function ApiKeyCard({ apiKey }: { apiKey: ApiKey }) {
  return (
    <GlassPanel card className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-heading">{apiKey.name}</h4>
          <Badge variant={apiKey.status === 'active' ? 'success' : 'warning'}>
            {apiKey.status}
          </Badge>
        </div>
        <div className="mt-2 space-y-1 text-xs text-muted">
          <p>
            <span className="text-faint">Client ID:</span>{' '}
            <code className="bg-surface rounded px-1.5 py-0.5 font-mono text-body">
              {apiKey.clientId}
            </code>
          </p>
          <p>
            <span className="text-faint">Secret:</span>{' '}
            <code className="bg-surface rounded px-1.5 py-0.5 font-mono text-body">
              {apiKey.secret}
            </code>
          </p>
          <p className="text-faint">Tạo ngày: {apiKey.createdAt}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <IconButton icon="copy-outline" size="sm" tooltip="Sao chép" />
        <IconButton icon="eye-outline" size="sm" tooltip="Hiện secret" />
        <IconButton
          icon="trash-outline"
          size="sm"
          tooltip="Thu hồi"
          className="text-red-400 hover:bg-red-500/10"
        />
      </div>
    </GlassPanel>
  );
}
