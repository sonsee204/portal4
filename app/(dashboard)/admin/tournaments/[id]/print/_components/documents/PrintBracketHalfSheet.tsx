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

import type { PrintBracketHalf } from '@/lib/tournament/print/types';

const ROW_H = 28;
const COL_ENTRY = 220;
const COL_ROUND = 72;

interface PrintBracketHalfSheetProps {
  half: PrintBracketHalf;
  /** Hide redundant title when category has a single half sheet. */
  showTitle?: boolean;
}

function BracketConnectors({ half }: { half: PrintBracketHalf }) {
  const entryCount = half.entries.length;
  if (entryCount === 0 || half.rounds.length < 2) return null;

  const width = half.rounds.length * COL_ROUND;
  const height = entryCount * ROW_H;

  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  for (const round of half.rounds) {
    const colIndex = half.rounds.indexOf(round);
    if (colIndex >= half.rounds.length - 1) continue;

    for (const m of round.matches) {
      const yMid = ((m.rowIndexFrom + m.rowIndexTo) / 2 + 0.5) * ROW_H;
      const x1 = colIndex * COL_ROUND + COL_ROUND * 0.2;
      const x2 = (colIndex + 1) * COL_ROUND + COL_ROUND * 0.1;
      lines.push({ x1, y1: yMid, x2, y2: yMid });
    }
  }

  return (
    <svg
      width={width}
      height={height}
      className="pointer-events-none absolute top-0 left-0"
      aria-hidden
    >
      {lines.map((l, i) => (
        <line
          key={i}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="#333"
          strokeWidth={1}
        />
      ))}
    </svg>
  );
}

export function PrintBracketHalfSheet({
  half,
  showTitle = true,
}: PrintBracketHalfSheetProps) {
  return (
    <div className="print-bracket-half">
      {showTitle ? (
        <h3 className="mb-2 text-center text-sm font-bold uppercase">
          {half.title}
        </h3>
      ) : null}
      <div className="flex gap-0">
        <table style={{ width: COL_ENTRY, flexShrink: 0 }}>
          <thead>
            <tr>
              <th style={{ width: 32 }}>STT</th>
              <th>Đơn vị</th>
              <th>VĐV</th>
            </tr>
          </thead>
          <tbody>
            {half.entries.map((e) => (
              <tr key={e.index} style={{ height: ROW_H }}>
                <td className="text-center">{e.index}</td>
                <td>{e.club ?? '—'}</td>
                <td>{e.athleteLabel}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          className="relative flex"
          style={{ minHeight: half.entries.length * ROW_H }}
        >
          <BracketConnectors half={half} />
          {half.rounds.map((round) => (
            <div
              key={round.label}
              style={{ width: COL_ROUND }}
              className="relative shrink-0"
            >
              <div className="border-b border-gray-400 py-1 text-center text-[10px] font-bold">
                {round.shortLabel}
              </div>
              <div
                style={{ height: half.entries.length * ROW_H }}
                className="relative"
              >
                {round.matches.map((m) => {
                  const top =
                    ((m.rowIndexFrom + m.rowIndexTo) / 2) * ROW_H +
                    ROW_H * 0.25;
                  return (
                    <div
                      key={m.matchId}
                      className="absolute right-1 left-1 rounded border border-gray-500 bg-white px-1 text-[9px]"
                      style={{ top }}
                    >
                      <div className="font-semibold">#{m.matchNumber}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
