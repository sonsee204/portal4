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

import type { CSSProperties, ReactNode } from 'react';
import type { PrintBracketHalf } from '@/lib/tournament/print/types';

/**
 * ROW_H is the single source of truth for bracket row height (px).
 *
 * The entry rows, the SVG connectors AND the match boxes all share ONE
 * coordinate system whose origin (y = 0) is the top of the first entry row.
 * Column headers live in a separate fixed-height strip ABOVE that system, so
 * nothing inside the coordinate system is pushed down by a header.
 *
 * Every entry row uses `box-sizing: border-box` so its 1px grid border is
 * drawn *inside* ROW_H – otherwise borders would accumulate ~1px per row and
 * drift the table out of alignment with the connectors.
 */
const ROW_H = 28;
const COL_ENTRY = 224;
const COL_ROUND = 96;
const ENTRY_GAP = 36;

/** Fixed height of the header strip (entry column titles + round labels). */
const HEADER_H = 22;

/** STT column width */
const W_STT = 28;
/** Club column width */
const W_CLUB = 64;

const GRID_BORDER = '1px solid #333';

/** Match box heights – centered exactly on rowCenterY. */
const BOX_H_WITH_SCHEDULE = 28;
const BOX_H_PLAIN = 18;

interface PrintBracketHalfSheetProps {
  half: PrintBracketHalf;
  /** Hide redundant title when category has a single half sheet. */
  showTitle?: boolean;
}

function rowCenterY(rowIndexFrom: number, rowIndexTo: number): number {
  return ((rowIndexFrom + rowIndexTo) / 2 + 0.5) * ROW_H;
}

function roundColumnLeft(roundIndex: number): number {
  return ENTRY_GAP + roundIndex * COL_ROUND;
}

function BracketConnectors({ half }: { half: PrintBracketHalf }) {
  const entryCount = half.entries.length;
  if (entryCount === 0 || half.rounds.length === 0) return null;

  const width = ENTRY_GAP + half.rounds.length * COL_ROUND;
  const height = entryCount * ROW_H;
  const hw = ENTRY_GAP / 2;

  const segments: Array<{ x1: number; y1: number; x2: number; y2: number }> =
    [];

  const pushH = (x1: number, y: number, x2: number) => {
    if (Math.abs(x2 - x1) < 0.5) return;
    segments.push({ x1, y1: y, x2, y2: y });
  };
  const pushV = (x: number, y1: number, y2: number) => {
    if (Math.abs(y2 - y1) < 0.5) return;
    segments.push({ x1: x, y1, x2: x, y2 });
  };

  // ── Entry stubs: connect each round-1 match to the two player rows ───────
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

  // ── Inter-round connections ───────────────────────────────────────────────
  for (let ri = 0; ri < half.rounds.length - 1; ri += 1) {
    const current = half.rounds[ri]!;
    const next = half.rounds[ri + 1]!;
    const colExit = roundColumnLeft(ri) + COL_ROUND * 0.55;
    const colMid = roundColumnLeft(ri) + COL_ROUND + ENTRY_GAP * 0.35;
    const colEntry = roundColumnLeft(ri + 1) + COL_ROUND * 0.12;

    if (next.matches.length === 0) {
      // Next round has no data yet → draw individual exit stubs so the bracket
      // structure is still visually communicated.
      for (const m of current.matches) {
        const yMid = rowCenterY(m.rowIndexFrom, m.rowIndexTo);
        pushH(colExit, yMid, colMid);
      }
    } else {
      // Normal H-V-H connection pairing two children to one parent match.
      for (let ki = 0; ki < next.matches.length; ki += 1) {
        const parent = next.matches[ki];
        if (!parent) continue;
        const yParent = rowCenterY(parent.rowIndexFrom, parent.rowIndexTo);

        const topChild = current.matches[ki * 2];
        const botChild = current.matches[ki * 2 + 1];
        if (!topChild || !botChild) continue;

        const yTop = rowCenterY(topChild.rowIndexFrom, topChild.rowIndexTo);
        const yBot = rowCenterY(botChild.rowIndexFrom, botChild.rowIndexTo);

        pushH(colExit, yTop, colMid);
        pushV(colMid, yTop, yBot);
        pushH(colMid, yParent, colEntry);
      }
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

/**
 * A single grid cell used for both the header strip and the entry rows.
 *
 * The cell fills the full height of its row and uses `box-sizing: border-box`
 * so the right-hand grid border never adds to the row height.
 */
function GridCell({
  children,
  width,
  flex = false,
  center = false,
  header = false,
}: {
  children: ReactNode;
  width?: number;
  flex?: boolean;
  center?: boolean;
  header?: boolean;
}) {
  const style: CSSProperties = {
    width: flex ? undefined : width,
    flex: flex ? '1 1 0' : '0 0 auto',
    height: '100%',
    boxSizing: 'border-box',
    borderRight: GRID_BORDER,
    display: 'flex',
    alignItems: 'center',
    justifyContent: center ? 'center' : 'flex-start',
    overflow: 'hidden',
    padding: '0 3px',
    fontSize: header ? 9 : 8,
    fontWeight: header ? 700 : undefined,
    lineHeight: 1.2,
    whiteSpace: header ? 'nowrap' : undefined,
  };
  return <div style={style}>{children}</div>;
}

export function PrintBracketHalfSheet({
  half,
  showTitle = true,
}: PrintBracketHalfSheetProps) {
  const entryCount = half.entries.length;
  const bracketWidth = ENTRY_GAP + half.rounds.length * COL_ROUND;
  const contentHeight = entryCount * ROW_H;

  return (
    <div className="print-bracket-half">
      {showTitle ? (
        <h3 className="mb-2 text-center text-sm font-bold uppercase">
          {half.title}
        </h3>
      ) : null}

      {/*
       * HEADER STRIP – fixed height, sits ABOVE the shared coordinate system so
       * neither the entry rows nor the match boxes are offset by a header.
       */}
      <div className="flex gap-0">
        <div style={{ width: COL_ENTRY, flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              height: HEADER_H,
              boxSizing: 'border-box',
              borderTop: GRID_BORDER,
              borderLeft: GRID_BORDER,
              borderBottom: GRID_BORDER,
              background: '#f3f4f6',
            }}
          >
            <GridCell width={W_STT} center header>
              STT
            </GridCell>
            <GridCell width={W_CLUB} header>
              Đơn vị
            </GridCell>
            <GridCell flex header>
              VĐV
            </GridCell>
          </div>
        </div>

        <div style={{ display: 'flex', width: bracketWidth, flexShrink: 0 }}>
          <div style={{ width: ENTRY_GAP, flexShrink: 0 }} aria-hidden />
          {half.rounds.map((round, roundIndex) => (
            <div
              key={`h-${round.label}-${roundIndex}`}
              style={{
                width: COL_ROUND,
                height: HEADER_H,
                boxSizing: 'border-box',
                borderBottom: GRID_BORDER,
              }}
              className="flex items-center justify-center text-[10px] font-bold"
            >
              {round.shortLabel}
            </div>
          ))}
        </div>
      </div>

      {/*
       * CONTENT AREA – entry rows, SVG connectors and match boxes all share the
       * same y origin (top of the first row), so connectors line up exactly.
       */}
      <div className="flex gap-0">
        {/* Entry rows */}
        <div style={{ width: COL_ENTRY, flexShrink: 0 }}>
          {half.entries.map((e) => (
            <div
              key={e.index}
              style={{
                display: 'flex',
                height: ROW_H,
                boxSizing: 'border-box',
                borderLeft: GRID_BORDER,
                borderBottom: GRID_BORDER,
              }}
            >
              <GridCell width={W_STT} center>
                {e.index}
              </GridCell>
              <GridCell width={W_CLUB}>{e.club ?? '—'}</GridCell>
              <GridCell flex>{e.athleteLabel}</GridCell>
            </div>
          ))}
        </div>

        {/* Bracket column area */}
        <div
          className="relative"
          style={{ width: bracketWidth, flexShrink: 0 }}
        >
          <BracketConnectors half={half} />
          <div className="flex" style={{ height: contentHeight }}>
            <div style={{ width: ENTRY_GAP, flexShrink: 0 }} aria-hidden />
            {half.rounds.map((round, roundIndex) => (
              <div
                key={`${round.label}-${roundIndex}`}
                style={{ width: COL_ROUND, height: contentHeight }}
                className="relative shrink-0"
              >
                {round.matches.map((m) => {
                  const boxH = m.scheduledLabel
                    ? BOX_H_WITH_SCHEDULE
                    : BOX_H_PLAIN;
                  const top =
                    rowCenterY(m.rowIndexFrom, m.rowIndexTo) - boxH / 2;
                  return (
                    <div
                      key={m.matchId}
                      className="absolute right-0 left-0 flex flex-col items-center justify-center overflow-hidden rounded border border-gray-500 bg-white text-center"
                      style={{ top, height: boxH }}
                    >
                      {m.matchNumber != null ? (
                        <div className="text-[9px] leading-none font-semibold">
                          {m.matchNumber}
                        </div>
                      ) : null}
                      {m.scheduledLabel ? (
                        <div
                          className="mt-0.5 w-full truncate px-0.5 text-center text-[7px] leading-tight text-gray-700"
                          title={m.scheduledLabel}
                        >
                          {m.scheduledLabel}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
