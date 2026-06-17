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
import type { TournamentMatch } from '@/graphql/generated';
import { isGroupMatchFinished } from '../_hooks/draw-page.derived';
import type { DrawPageData } from '../_hooks/useDrawData';

function DrawMatchRow({ match }: { match: TournamentMatch }) {
  return (
    <div className="bg-bg-secondary flex items-center justify-between rounded-lg px-4 py-3">
      <div className="flex items-center gap-4">
        <span className="text-secondary font-mono text-xs">#{match.matchNumber}</span>
        <span className="text-heading text-sm font-medium">
          {match.player1?.name ?? 'TBD'}
        </span>
        <span className="text-secondary text-xs">vs</span>
        <span className="text-heading text-sm font-medium">
          {match.player2?.name ?? 'TBD'}
        </span>
      </div>
      <span
        className={`text-xs font-medium ${
          isGroupMatchFinished(match.status)
            ? 'text-emerald-500'
            : match.status === 'LIVE'
              ? 'text-primary'
              : match.isBye
                ? 'text-yellow-400'
                : 'text-secondary'
        }`}
      >
        {match.isBye ? 'BYE' : match.status}
      </span>
    </div>
  );
}

interface DrawGroupKnockoutSectionProps {
  data: DrawPageData;
}

export function DrawGroupKnockoutSection({ data }: DrawGroupKnockoutSectionProps) {
  const {
    allGroupMatchesDone,
    uniqueGroupIds,
    activeGroupTab,
    setSelectedGroupTab,
    activeGroupMatches,
    groupStandings,
    advancingPerGroup,
    knockoutMatches,
    knockoutSeeded,
    knockoutRoundsMap,
  } = data;

  return (
    <>
      <GlassPanel card>
        <div className="mb-4 flex items-center gap-2">
          <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
            <IonIcon name="grid-outline" size="sm" className="text-primary" />
          </div>
          <h3 className="text-heading text-sm font-bold">Vòng bảng</h3>
          {allGroupMatchesDone && (
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
              Hoàn thành
            </span>
          )}
        </div>

        {uniqueGroupIds.length > 0 && (
          <div className="mb-4 flex gap-2">
            {uniqueGroupIds.map((gId) => (
              <button
                key={gId}
                onClick={() => setSelectedGroupTab(gId)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeGroupTab === gId
                    ? 'bg-primary text-white'
                    : 'bg-surface-elevated text-secondary hover:text-primary'
                }`}
              >
                Bảng {gId}
              </button>
            ))}
          </div>
        )}

        {activeGroupMatches.length > 0 ? (
          <div className="space-y-2">
            {activeGroupMatches.map((m) => (
              <DrawMatchRow key={m._id} match={m} />
            ))}
          </div>
        ) : (
          <p className="text-secondary text-sm">
            Không có trận nào trong Bảng {activeGroupTab}
          </p>
        )}

        {groupStandings.length > 0 && (
          <div className="mt-4">
            <h4 className="text-heading mb-2 flex items-center gap-2 text-xs font-semibold">
              <IonIcon name="podium-outline" size="sm" className="text-primary" />
              Bảng xếp hạng — Bảng {activeGroupTab}
              <span className="text-muted font-normal">
                (top {advancingPerGroup} đi tiếp)
              </span>
            </h4>
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
                    <th className="text-secondary py-2 text-center font-medium">Hiệu set</th>
                  </tr>
                </thead>
                <tbody>
                  {groupStandings.map((row, i) => (
                    <tr
                      key={row.registrationId}
                      className={`border-surface-border border-b last:border-0 ${
                        i < advancingPerGroup ? 'bg-emerald-500/5' : ''
                      }`}
                    >
                      <td className="py-2 pr-3">
                        <span
                          className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            i < advancingPerGroup
                              ? 'bg-emerald-500/20 text-emerald-500'
                              : 'text-secondary'
                          }`}
                        >
                          {i + 1}
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
                        {row.setsWon - row.setsLost >= 0 ? '+' : ''}
                        {row.setsWon - row.setsLost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </GlassPanel>

      {knockoutMatches.length > 0 && (
        <GlassPanel card>
          <div className="mb-4 flex items-center gap-2">
            <div className="bg-primary/10 flex h-7 w-7 items-center justify-center rounded-lg">
              <IonIcon
                name="git-branch-outline"
                size="sm"
                className="text-primary"
              />
            </div>
            <h3 className="text-heading text-sm font-bold">Vòng loại trực tiếp</h3>
            {knockoutSeeded ? (
              <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                Đã xếp VĐV
              </span>
            ) : (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
                Chờ xếp VĐV
              </span>
            )}
          </div>

          {!knockoutSeeded && !allGroupMatchesDone && (
            <p className="text-secondary text-sm">
              Hoàn thành tất cả trận vòng bảng để xếp VĐV vào vòng loại trực tiếp.
            </p>
          )}

          {knockoutSeeded && (
            <div className="space-y-4">
              {knockoutRoundsMap.map(([roundNum, roundMatches]) => (
                <div key={roundNum}>
                  <h4 className="text-secondary mb-2 text-xs font-semibold">
                    {roundMatches[0]?.roundLabel ?? `Vòng ${roundNum - 100}`}
                  </h4>
                  <div className="space-y-2">
                    {roundMatches.map((m) => (
                      <DrawMatchRow key={m._id} match={m} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassPanel>
      )}
    </>
  );
}
