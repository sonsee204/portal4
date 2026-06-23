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

import { Fragment } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { BracketCategoryData, BracketMatch } from '@/lib/tournament/draw/types';
import { BracketMatchCard } from './BracketMatchCard';
import {
  BASE_GAP,
  BRACKET_CARD_HEIGHT,
  BRACKET_CARD_WIDTH,
  CONNECTOR_W,
  LABEL_H,
  computeGap,
  computeTopPad,
} from './bracket-tree.layout';

function ConnectorColumn({
  roundIndex,
  matches,
  bracketHeight,
}: {
  roundIndex: number;
  matches: BracketMatch[];
  bracketHeight: number;
}) {
  const pairs = Math.floor(matches.length / 2);
  const gap = computeGap(roundIndex);
  const top = computeTopPad(roundIndex);
  const hw = CONNECTOR_W / 2;

  return (
    <div className="flex shrink-0 flex-col">
      <div style={{ height: LABEL_H }} aria-hidden />
      <div className="relative" style={{ width: CONNECTOR_W, minHeight: bracketHeight }}>
        {Array.from({ length: pairs }).map((_, i) => {
          const yTop = top + 2 * i * (BRACKET_CARD_HEIGHT + gap) + BRACKET_CARD_HEIGHT / 2;
          const yBot = top + (2 * i + 1) * (BRACKET_CARD_HEIGHT + gap) + BRACKET_CARD_HEIGHT / 2;
          const yMid = (yTop + yBot) / 2;

          return (
            <Fragment key={i}>
              <div className="bg-primary/30 absolute" style={{ top: yTop - 1, left: 0, width: hw, height: 2 }} />
              <div className="bg-primary/30 absolute" style={{ top: yTop, left: hw - 1, width: 2, height: yBot - yTop }} />
              <div className="bg-primary/30 absolute" style={{ top: yBot - 1, left: 0, width: hw, height: 2 }} />
              <div className="bg-primary/30 absolute" style={{ top: yMid - 1, left: hw - 1, width: hw + 1, height: 2 }} />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

interface BracketTreeProps {
  data: BracketCategoryData;
}

export function BracketTree({ data }: BracketTreeProps) {
  const { rounds } = data;
  const total = rounds.length;
  const firstCount = rounds[0]?.matches.length ?? 0;
  const bracketHeight =
    firstCount * BRACKET_CARD_HEIGHT + Math.max(0, firstCount - 1) * BASE_GAP;

  return (
    <div className="no-scrollbar overflow-x-auto rounded-2xl pb-4">
      <div
        className="inline-flex items-start"
        style={{
          minWidth: total * (BRACKET_CARD_WIDTH + 16) + (total - 1) * CONNECTOR_W,
        }}
      >
        {rounds.map((round, ri) => {
          const isFinal = ri === total - 1;
          const gap = computeGap(ri);
          const topPad = computeTopPad(ri);

          return (
            <Fragment key={round.label}>
              <div className="flex shrink-0 flex-col items-center">
                <div
                  className={cn(
                    'mb-4 flex h-6 items-center gap-1.5',
                    isFinal && 'bg-primary/10 rounded-full px-4 py-4',
                  )}
                >
                  {isFinal && <IonIcon name="trophy" size="sm" className="text-primary" />}
                  <span className={cn('text-xs font-bold tracking-wider uppercase', isFinal ? 'text-primary' : 'text-muted')}>
                    {round.label}
                  </span>
                </div>
                <div className="flex flex-col" style={{ gap: `${gap}px`, paddingTop: `${topPad}px` }}>
                  {round.matches.map((m) => (
                    <BracketMatchCard key={m.id} match={m} isFinal={isFinal} />
                  ))}
                </div>
              </div>
              {ri < total - 1 && (
                <ConnectorColumn roundIndex={ri} matches={round.matches} bracketHeight={bracketHeight} />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
