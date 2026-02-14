'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { BracketMatch } from '@/types/portal';

/* ------------------------------------------------------------------ */
/* FinalMatchCard — Grand Final with championship layout               */
/* ------------------------------------------------------------------ */

export interface FinalMatchCardProps {
  match: BracketMatch;
  /** Show left-side horizontal connector */
  showConnectorIn?: boolean;
}

export function FinalMatchCard({
  match,
  showConnectorIn,
}: FinalMatchCardProps) {
  const [playerA, playerB] = match.players;

  return (
    <div className="glass-card border-primary/50 from-primary/20 via-bg-dark to-primary/5 neon-glow relative w-72 rounded-xl border bg-gradient-to-br p-1">
      {/* Connector in */}
      {showConnectorIn && (
        <div className="absolute top-1/2 -left-8 h-[2px] w-8 bg-white/10" />
      )}

      {/* Championship badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div className="bg-primary flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-bold text-white shadow-lg">
          <IonIcon name="trophy-outline" size="xs" />
          CHAMPIONSHIP
        </div>
      </div>

      {/* Inner content */}
      <div className="mt-2 p-5 text-center">
        {/* VS layout */}
        <div className="mb-4 flex items-center justify-center gap-6">
          <FinalPlayerSlot name={playerA.name} avatar={playerA.avatar} />
          <span className="text-xl font-bold text-slate-600 italic">VS</span>
          <FinalPlayerSlot name={playerB.name} avatar={playerB.avatar} />
        </div>

        {/* Date / venue info */}
        {match.time && (
          <div className="text-center">
            <p className="mb-1 text-xs text-slate-400">{match.time}</p>
            <p className="text-[10px] text-slate-500">Center Court</p>
          </div>
        )}

        {/* Manage button */}
        <Button
          variant="ghost"
          size="sm"
          className="mt-4 w-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
        >
          Manage Final Details
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Final player slot                                                   */
/* ------------------------------------------------------------------ */

function FinalPlayerSlot({ name, avatar }: { name: string; avatar?: string }) {
  const isTBD = name === 'TBD' || name.startsWith('Winner');

  return (
    <div className="flex flex-col items-center gap-2">
      {avatar && !isTBD ? (
        <img
          src={avatar}
          alt={name}
          className="border-primary/30 h-16 w-16 rounded-full border-2 object-cover"
        />
      ) : (
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-slate-600 bg-white/5">
          <IonIcon name="person-outline" size="lg" className="text-slate-600" />
        </div>
      )}
      <span className="text-xs text-slate-500">{name}</span>
    </div>
  );
}
