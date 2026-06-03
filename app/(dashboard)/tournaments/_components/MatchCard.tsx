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

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { BracketMatch, MatchPlayer, MatchStatus } from '@/types/mock';

/* ------------------------------------------------------------------ */
/* Status indicator config                                             */
/* ------------------------------------------------------------------ */

interface StatusConfig {
  label: string;
  className: string;
  pulse?: boolean;
}

const statusConfig: Record<MatchStatus, StatusConfig> = {
  live: { label: 'LIVE', className: 'text-emerald-400', pulse: true },
  finished: { label: 'FINISHED', className: 'text-faint' },
  scheduled: { label: 'Scheduled', className: 'text-faint' },
  upcoming: { label: 'Upcoming', className: 'text-faint' },
};

/* ------------------------------------------------------------------ */
/* Player avatar                                                       */
/* ------------------------------------------------------------------ */

function PlayerAvatar({
  player,
  isLoser,
}: {
  player: MatchPlayer;
  isLoser: boolean;
}) {
  const isTBD =
    !player.avatar &&
    (player.name === 'TBD' || player.name.startsWith('Winner'));

  if (isTBD) {
    return (
      <div className="bg-surface-hover text-muted flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px]">
        ?
      </div>
    );
  }

  if (player.avatar) {
    return (
      <span className="relative block h-6 w-6 shrink-0 overflow-hidden rounded-full">
        <Image
          src={player.avatar}
          alt={player.name}
          fill
          sizes="24px"
          className={cn('object-cover', isLoser && 'opacity-70 grayscale')}
          unoptimized
        />
      </span>
    );
  }

  /* Fallback initials circle */
  const initials = player.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        'text-heading flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-400 text-[10px] font-bold',
        isLoser && 'opacity-70 grayscale'
      )}
    >
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Semifinal player avatar (larger)                                    */
/* ------------------------------------------------------------------ */

function SemifinalAvatar({ player }: { player: MatchPlayer }) {
  const isPlaceholder =
    !player.avatar &&
    (player.name === 'TBD' || player.name.startsWith('Winner'));

  if (isPlaceholder) {
    const tag = player.name.startsWith('Winner')
      ? player.name.replace('Winner ', '')
      : '?';
    return (
      <div className="bg-surface text-faint flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs">
        {tag}
      </div>
    );
  }

  if (player.avatar) {
    return (
      <span className="relative block h-8 w-8 shrink-0 overflow-hidden rounded-full">
        <Image
          src={player.avatar}
          alt={player.name}
          fill
          sizes="32px"
          className="object-cover"
          unoptimized
        />
      </span>
    );
  }

  const initials = player.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="text-heading flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-400 text-xs font-bold">
      {initials}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MatchCard                                                           */
/* ------------------------------------------------------------------ */

export interface MatchCardProps {
  match: BracketMatch;
  variant?: 'default' | 'semifinal';
  /** Show right-side horizontal connector */
  showConnector?: boolean;
  /** Show left-side horizontal connector */
  showConnectorIn?: boolean;
}

export function MatchCard({
  match,
  variant = 'default',
  showConnector,
  showConnectorIn,
}: MatchCardProps) {
  const status = statusConfig[match.status];
  const isSemifinal = variant === 'semifinal';
  const isFinished = match.status === 'finished';

  return (
    <div
      className={cn(
        'glass-card relative rounded-xl',
        isSemifinal ? 'border-l-primary/60 border-l-4 p-4' : 'p-3',
        isFinished && 'opacity-60 transition-opacity hover:opacity-100',
        match.status === 'scheduled' &&
          match.time?.startsWith('TODAY') &&
          'border-primary/40 shadow-[0_0_15px_-5px_rgba(124,58,237,0.2)]'
      )}
    >
      {/* Connector in */}
      {showConnectorIn && (
        <div className="absolute top-1/2 -left-8 h-[2px] w-8 bg-white/10" />
      )}

      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between',
          isSemifinal ? 'mb-3' : 'mb-2'
        )}
      >
        <span
          className={cn(
            'font-mono text-[10px]',
            match.status === 'scheduled' && match.time?.startsWith('TODAY')
              ? 'text-primary font-bold'
              : 'text-faint'
          )}
        >
          MATCH #{match.matchNumber}
        </span>
        {isSemifinal && match.time ? (
          <div className="border-surface-border bg-surface text-body rounded border px-2 py-0.5 text-[10px]">
            {match.time}
          </div>
        ) : match.status === 'scheduled' && match.time ? (
          <span className="text-muted text-[10px]">{match.time}</span>
        ) : (
          <span
            className={cn(
              'flex items-center gap-1 text-[10px]',
              status.className
            )}
          >
            {status.pulse && (
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            )}
            {status.label}
          </span>
        )}
      </div>

      {/* Players */}
      <div className={isSemifinal ? 'space-y-3' : 'space-y-2'}>
        {match.players.map((player, i) => {
          const otherPlayer = match.players[1 - i];
          const isWinner = !!player.winner;
          const isLoser = !player.winner && !!otherPlayer?.winner;
          const isTBD =
            player.name === 'TBD' || player.name.startsWith('Winner');

          if (isSemifinal) {
            return (
              <div
                key={i}
                className={cn(
                  'flex items-center gap-3 rounded p-2',
                  isTBD
                    ? 'border-surface-border bg-overlay-faint border border-dashed opacity-50'
                    : 'bg-white/5'
                )}
              >
                <SemifinalAvatar player={player} />
                <span
                  className={cn(
                    'text-sm',
                    isTBD ? 'text-muted' : 'text-heading'
                  )}
                >
                  {player.name}
                </span>
              </div>
            );
          }

          return (
            <div
              key={i}
              className={cn(
                'flex items-center justify-between rounded p-1',
                isWinner
                  ? 'border-primary/30 bg-primary/20 border'
                  : isFinished && !isWinner
                    ? 'bg-white/10'
                    : 'bg-white/5'
              )}
            >
              <div className="flex items-center gap-2">
                <PlayerAvatar player={player} isLoser={isLoser} />
                <span
                  className={cn(
                    'text-sm',
                    isWinner ? 'text-heading font-medium' : 'text-body'
                  )}
                >
                  {player.name}
                </span>
              </div>
              <span
                className={cn(
                  'font-mono text-sm font-bold',
                  isWinner
                    ? 'text-emerald-400'
                    : player.score != null
                      ? 'text-muted'
                      : 'text-muted'
                )}
              >
                {player.score != null ? player.score : '-'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connector out */}
      {showConnector && (
        <div className="absolute top-1/2 -right-8 h-[2px] w-8 bg-white/10" />
      )}
    </div>
  );
}
