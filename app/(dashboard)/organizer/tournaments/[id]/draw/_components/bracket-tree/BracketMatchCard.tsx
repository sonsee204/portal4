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

import { cn } from '@/lib/utils';
import type { BracketMatch } from '@/lib/tournament/draw/types';
import { BRACKET_CARD_HEIGHT, BRACKET_CARD_WIDTH } from './bracket-tree.layout';

interface BracketMatchCardProps {
  match: BracketMatch;
  isFinal?: boolean;
  isGhost?: boolean;
}

export function BracketMatchCard({
  match,
  isFinal,
  isGhost = false,
}: BracketMatchCardProps) {
  const [p1, p2] = match.players;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border',
        isGhost && 'border-dashed opacity-60',
        isFinal ? 'border-primary/30 bg-primary/5' : 'border-surface-border bg-surface-elevated',
      )}
      style={{ height: BRACKET_CARD_HEIGHT, width: BRACKET_CARD_WIDTH }}
    >
      <div className="border-surface-border flex items-center justify-between border-b px-3 py-1.5">
        <span className={cn('text-[10px] font-medium', isFinal ? 'text-primary' : 'text-muted')}>
          Trận #{match.matchNumber}
          {match.isBye ? ' · BYE' : ''}
        </span>
        {match.scheduledAt && (
          <span className="text-muted text-[10px]">{match.scheduledAt}</span>
        )}
      </div>
      {[p1, p2].map((player, idx) => (
        <div
          key={idx}
          className={cn(
            'flex items-center justify-between px-3 py-2.5 text-sm',
            idx === 0 && 'border-surface-border border-b',
          )}
        >
          {player?.isPlaceholder ? (
            <span className="text-muted italic">{player.name}</span>
          ) : player ? (
            <span className={cn('truncate', player.winner && 'text-primary font-semibold')}>
              {player.name}
            </span>
          ) : (
            <span className="text-faint text-xs italic">Chưa xác định</span>
          )}
          {player?.score != null && (
            <span className="font-mono text-xs tabular-nums">{player.score}</span>
          )}
        </div>
      ))}
      {match.court && (
        <div className="text-faint mt-auto px-3 py-1 text-[10px]">{match.court}</div>
      )}
    </div>
  );
}
