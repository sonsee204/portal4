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
const COL_ROUND = 88;
const ENTRY_GAP = 36;

interface PrintBracketHalfSheetProps {
  half: PrintBracketHalf;
  /** Hide redundant title when category has a single half sheet. */
  showTitle?: boolean;
}

function rowCenterY(rowIndexFrom: number, rowIndexTo: number): number {
  return ((rowIndexFrom + rowIndexTo) / 2 + 0.5) * ROW_H;
}

function formatMatchNumber(n: number): string {
  return String(n).padStart(2, '0');
}

function roundColumnLeft(roundIndex: number): number {
  return ENTRY_GAP + roundIndex * COL_ROUND;
}

function BracketConnectors({ half }: { half: PrintBracketHalf }) {
  const entryCount = half.entries.length;
  if (entryCount === 0 || half.rounds.length === 0) return null;

  const roundColCount = half.rounds.length;
  const width = ENTRY_GAP + roundColCount * COL_ROUND;
  const height = entryCount * ROW_H;
  const hw = ENTRY_GAP / 2;

  const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> =
    [];

  const pushH = (x1: number, y: number, x2: number) => {
    segments.push({ x1, y1: y, x2, y2: y });
  };
  const pushV = (x: number, y1: number, y2: number) => {
    segments.push({ x1: x, y1, x2: x, y2 });
  };

  const firstRound = half.rounds[0];
  if (firstRound) {
    const r1Left = roundColumnLeft(0);
    for (const m of firstRound.matches) {
      const yTop = m.rowIndexFrom * ROW_H + ROW_H / 2;
      const yBot = m.rowIndexTo * ROW_H + ROW_H / 2;
      const yMid = (yTop + yBot) / 2;
      pushH(0, yTop, hw);
      pushV(hw, yTop, yBot);
      pushH(hw, yMid, r1Left + COL_ROUND * 0.12);
    }
  }

  for (let ri = 0; ri < half.rounds.length - 1; ri += 1) {
    const current = half.rounds[ri]!;
    const next = half.rounds[ri + 1]!;
    const colLeft = roundColumnLeft(ri) + COL_ROUND * 0.55;
    const colMid = roundColumnLeft(ri) + COL_ROUND + ENTRY_GAP * 0.35;
    const colRight = roundColumnLeft(ri + 1) + COL_ROUND * 0.12;

    for (let ki = 0; ki < next.matches.length; ki += 1) {
      const parent = next.matches[ki];
      if (!parent) continue;
      const yParent = rowCenterY(parent.rowIndexFrom, parent.rowIndexTo);

      const topChild = current.matches[ki * 2];
      const botChild = current.matches[ki * 2 + 1];
      if (!topChild || !botChild) continue;

      const yTop = rowCenterY(topChild.rowIndexFrom, topChild.rowIndexTo);
      const yBot = rowCenterY(botChild.rowIndexFrom, botChild.rowIndexTo);

      pushH(colLeft, yTop, colMid);
      pushV(colMid, yTop, yBot);
      pushH(colMid, yParent, colRight);
    }
  }

  return (
    <svg
      width={width}
      height={height}
      className="pointer-events-none absolute top-0 left-0"
      aria-hidden
    >
      {segments.map((l, i) => (
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
  const bracketWidth = ENTRY_GAP + half.rounds.length * COL_ROUND;

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
          style={{
            width: bracketWidth,
            minHeight: half.entries.length * ROW_H,
          }}
        >
          <BracketConnectors half={half} />
          <div style={{ width: ENTRY_GAP, flexShrink: 0 }} aria-hidden />
          {half.rounds.map((round, roundIndex) => (
            <div
              key={`${round.label}-${roundIndex}`}
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
                  const hasSchedule = Boolean(m.scheduledLabel);
                  const boxHeight = hasSchedule ? 26 : 16;
                  const top =
                    rowCenterY(m.rowIndexFrom, m.rowIndexTo) - boxHeight / 2;
                  return (
                    <div
                      key={m.matchId}
                      className="absolute right-0.5 left-0.5 rounded border border-gray-500 bg-white px-0.5 text-center leading-tight"
                      style={{ top, fontSize: hasSchedule ? 8 : 9 }}
                    >
                      <div className="font-semibold">
                        {formatMatchNumber(m.matchNumber)}
                      </div>
                      {m.scheduledLabel ? (
                        <div className="text-[7px] text-gray-700">
                          {m.scheduledLabel}
                        </div>
                      ) : null}
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
