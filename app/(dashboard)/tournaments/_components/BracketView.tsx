'use client';

import { MatchCard } from './MatchCard';
import type { BracketMatch } from '@/types/portal';

const roundLabels = ['Vòng 16', 'Tứ kết', 'Bán kết', 'Chung kết'];

export function BracketView({ rounds }: { rounds: BracketMatch[][] }) {
  return (
    <div className="no-scrollbar overflow-x-auto pb-4">
      <div className="flex min-w-max gap-8">
        {rounds.map((matches, roundIdx) => (
          <div key={roundIdx} className="flex flex-col">
            <h4 className="mb-4 text-center text-xs font-bold tracking-wider text-slate-500 uppercase">
              {roundLabels[roundIdx] ?? `Round ${roundIdx + 1}`}
            </h4>
            <div className="flex flex-1 flex-col justify-around gap-4">
              {matches.map((match) => (
                <div key={match._id} className="flex items-center">
                  <MatchCard match={match} />
                  {roundIdx < rounds.length - 1 && (
                    <div className="bg-surface-border ml-2 h-px w-8" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
