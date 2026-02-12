'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/atoms/Badge';
import type { BracketMatch, MatchStatus } from '@/types/portal';

const statusBadge: Record<
  MatchStatus,
  { variant: 'success' | 'neutral' | 'info' | 'warning'; label: string }
> = {
  live: { variant: 'success', label: 'LIVE' },
  finished: { variant: 'neutral', label: 'KT' },
  scheduled: { variant: 'info', label: 'Sắp diễn ra' },
  upcoming: { variant: 'warning', label: 'TBD' },
};

export function MatchCard({ match }: { match: BracketMatch }) {
  const badge = statusBadge[match.status];

  return (
    <div className="border-surface-border bg-surface-dark/80 w-56 rounded-xl border p-3 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] text-slate-500">
          Match #{match.matchNumber}
        </span>
        <Badge variant={badge.variant} className="text-[10px]">
          {badge.label}
        </Badge>
      </div>
      {match.players.map((p, i) => (
        <div
          key={i}
          className={cn(
            'flex items-center justify-between rounded-lg px-2 py-1.5 text-sm',
            p.winner && 'bg-primary/10',
            i === 0 && 'mb-1'
          )}
        >
          <span
            className={cn('text-slate-300', p.winner && 'font-bold text-white')}
          >
            {p.name}
          </span>
          {p.score != null && (
            <span
              className={cn(
                'font-mono text-sm',
                p.winner ? 'text-primary font-bold' : 'text-slate-500'
              )}
            >
              {p.score}
            </span>
          )}
        </div>
      ))}
      {match.time && (
        <p className="mt-1 text-center text-[10px] text-slate-500">
          {match.time}
        </p>
      )}
    </div>
  );
}
