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

import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { DrawPageData } from '../_hooks/useDrawData';

interface DrawStandardFormatSectionProps {
  data: DrawPageData;
}

export function DrawStandardFormatSection({ data }: DrawStandardFormatSectionProps) {
  const { isRoundRobin, roundsMap, standings } = data;

  return (
    <>
      <div className="space-y-4">
        {roundsMap.map(([roundNum, roundMatches]) => (
          <GlassPanel key={roundNum} card>
            <h3 className="text-heading mb-3 text-sm font-bold">
              {isRoundRobin
                ? (roundMatches[0]?.roundLabel ?? `Lượt ${roundNum}`)
                : (roundMatches[0]?.roundLabel ?? `Vòng ${roundNum}`)}
            </h3>
            <div className="space-y-2">
              {roundMatches.map((m) => (
                <div
                  key={m._id}
                  className="bg-bg-secondary flex items-center justify-between rounded-lg px-4 py-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-secondary font-mono text-xs">
                      #{m.matchNumber}
                    </span>
                    <span className="text-heading text-sm font-medium">
                      {m.player1?.name ?? 'TBD'}
                    </span>
                    <span className="text-secondary text-xs">vs</span>
                    <span className="text-heading text-sm font-medium">
                      {m.player2?.name ?? 'TBD'}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium ${m.isBye ? 'text-yellow-400' : 'text-secondary'}`}
                  >
                    {m.isBye ? 'BYE' : m.status}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>
        ))}
      </div>

      {isRoundRobin && standings.length > 0 && (
        <GlassPanel card>
          <h3 className="text-heading mb-3 flex items-center gap-2 text-sm font-bold">
            <IonIcon name="podium-outline" size="sm" className="text-primary" />
            Bảng xếp hạng tạm thời
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-surface-border border-b">
                  <th className="text-secondary py-2 pr-3 text-left font-medium">#</th>
                  <th className="text-secondary py-2 pr-3 text-left font-medium">VĐV</th>
                  <th className="text-secondary py-2 pr-3 text-center font-medium">ĐT</th>
                  <th className="text-secondary py-2 pr-3 text-center font-medium">T</th>
                  <th className="text-secondary py-2 pr-3 text-center font-medium">B</th>
                  <th className="text-secondary py-2 pr-3 text-center font-medium">Điểm</th>
                  <th className="text-secondary py-2 text-center font-medium">Tỉ lệ T</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((row, i) => (
                  <tr
                    key={row.registrationId}
                    className={`border-surface-border border-b last:border-0 ${i < 3 ? 'font-medium' : ''}`}
                  >
                    <td className="py-2 pr-3">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                          i === 0
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : i === 1
                              ? 'bg-slate-400/20 text-slate-400'
                              : i === 2
                                ? 'bg-orange-600/20 text-orange-500'
                                : 'text-secondary'
                        }`}
                      >
                        {row.rank}
                      </span>
                    </td>
                    <td className="text-heading py-2 pr-3">{row.playerName}</td>
                    <td className="text-secondary py-2 pr-3 text-center">
                      {row.matchesPlayed}
                    </td>
                    <td className="py-2 pr-3 text-center text-emerald-500">
                      {row.matchesWon}
                    </td>
                    <td className="py-2 pr-3 text-center text-red-400">
                      {row.matchesLost}
                    </td>
                    <td className="text-heading py-2 pr-3 text-center font-semibold">
                      {row.groupPoints}
                    </td>
                    <td className="text-secondary py-2 text-center">
                      {row.winRate != null
                        ? `${Math.round(row.winRate * 100)}%`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}
    </>
  );
}
