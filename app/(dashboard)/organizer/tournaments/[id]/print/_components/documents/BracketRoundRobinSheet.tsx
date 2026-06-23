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

import type { PrintRoundRobinRow } from '@/lib/tournament/print/types';

interface BracketRoundRobinSheetProps {
  title: string;
  rows: PrintRoundRobinRow[];
}

export function BracketRoundRobinSheet({
  title,
  rows,
}: BracketRoundRobinSheetProps) {
  return (
    <div className="print-round-robin-sheet">
      <h3 className="mb-2 text-center text-sm font-bold uppercase">{title}</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Vòng</th>
            <th>VĐV / Đội 1</th>
            <th>VĐV / Đội 2</th>
            <th>Lịch</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.matchNumber}>
              <td className="text-center">{r.matchNumber}</td>
              <td>{r.roundLabel}</td>
              <td>{r.player1}</td>
              <td>{r.player2}</td>
              <td>{r.scheduledLabel ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
