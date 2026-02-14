'use client';

import { cn } from '@/lib/utils';
import { MatchCard } from './MatchCard';
import { FinalMatchCard } from './FinalMatchCard';
import type { BracketMatch } from '@/types/portal';

/* ------------------------------------------------------------------ */
/* Round config                                                        */
/* ------------------------------------------------------------------ */

const roundLabels = [
  'Round of 16',
  'Quarter-finals',
  'Semi-finals',
  'Grand Final',
];

/** Per-round gap between match cards (Tailwind) */
const roundGapClasses: Record<number, string> = {
  0: 'gap-10', // 40px
  1: 'gap-28', // 112px
};

/** Same gaps in px — used for connector calc */
const roundGapPx: Record<number, number> = {
  0: 40,
  1: 112,
};

function getVariant(roundIdx: number, totalRounds: number) {
  if (roundIdx === totalRounds - 2) return 'semifinal' as const;
  return 'default' as const;
}

/* ------------------------------------------------------------------ */
/* VerticalConnector                                                   */
/*                                                                     */
/* Draws from the card's center towards the midpoint between it and    */
/* its pair partner.  Height uses calc() so it adapts to the real      */
/* card height — no pixel estimation required.                         */
/*                                                                     */
/*   Even card:  center ──▼── (down half card + half gap)              */
/*   Odd  card:  (up half card + half gap) ──▲── center                */
/*                                                                     */
/* They meet at the exact midpoint between the two cards.              */
/* ------------------------------------------------------------------ */

function VerticalConnector({
  direction,
  halfGapPx,
}: {
  direction: 'down' | 'up';
  halfGapPx: number;
}) {
  const style =
    direction === 'down'
      ? { top: '50%', height: `calc(50% + ${halfGapPx}px)` }
      : { bottom: '50%', height: `calc(50% + ${halfGapPx}px)` };

  return (
    <div
      className="pointer-events-none absolute -right-8 w-[2px] bg-white/10"
      style={style}
    />
  );
}

/* ------------------------------------------------------------------ */
/* BracketView                                                         */
/* ------------------------------------------------------------------ */

export function BracketView({ rounds }: { rounds: BracketMatch[][] }) {
  const totalRounds = rounds.length;

  return (
    <div className="flex min-w-[1200px] items-center justify-center py-10">
      <div className="relative flex gap-16">
        {rounds.map((matches, roundIdx) => {
          const isFinalRound = roundIdx === totalRounds - 1;
          const isSemifinal = roundIdx === totalRounds - 2;
          const isLastColumn = roundIdx === totalRounds - 1;
          const label = roundLabels[roundIdx] ?? `Round ${roundIdx + 1}`;
          const gapClass = roundGapClasses[roundIdx] ?? 'gap-10';
          const gapPx = roundGapPx[roundIdx] ?? 40;
          const variant = getVariant(roundIdx, totalRounds);

          return (
            <div
              key={roundIdx}
              className={cn(
                'relative flex flex-col',
                isFinalRound ? 'w-72' : 'w-64',
                roundIdx > 0 && 'pt-8'
              )}
            >
              {/* Round label */}
              <h4
                className={cn(
                  'mb-4 text-center text-xs font-bold tracking-widest uppercase',
                  isFinalRound ? 'text-primary neon-text' : 'text-slate-500'
                )}
              >
                {label}
              </h4>

              {/* Matches */}
              <div
                className={cn(
                  'flex flex-1 flex-col justify-center',
                  isFinalRound ? 'items-center' : gapClass
                )}
              >
                {matches.map((match, matchIdx) => {
                  if (isFinalRound) {
                    return (
                      <FinalMatchCard
                        key={match._id}
                        match={match}
                        showConnectorIn
                      />
                    );
                  }

                  /*
                   * Vertical connector for each card in a pair:
                   *  - even index → goes DOWN
                   *  - odd  index → goes UP
                   * Only drawn when there are ≥ 2 matches in the round
                   * and it's not the last column.
                   */
                  const needsVertical = !isLastColumn && matches.length > 1;
                  const verticalDir: 'down' | 'up' =
                    matchIdx % 2 === 0 ? 'down' : 'up';

                  return (
                    <div key={match._id} className="relative">
                      <MatchCard
                        match={match}
                        variant={variant}
                        showConnector={!isLastColumn}
                        showConnectorIn={roundIdx > 0}
                      />
                      {needsVertical && (
                        <VerticalConnector
                          direction={verticalDir}
                          halfGapPx={gapPx / 2}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
