'use client';

import type { CheckInByGame } from '@/graphql/types';

interface GameFillRateTableProps {
  games?: CheckInByGame[];
  loading: boolean;
}

const SPORT_LABEL: Record<string, string> = {
  BADMINTON: 'Cầu lông',
  FOOTBALL: 'Bóng đá',
  PICKLEBALL: 'Pickleball',
  BASKETBALL: 'Bóng rổ',
  TENNIS: 'Tennis',
  VOLLEYBALL: 'Bóng chuyền',
  TABLE_TENNIS: 'Bóng bàn',
};

export function GameFillRateTable({ games, loading }: GameFillRateTableProps) {
  if (loading) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <div className="bg-surface-hover mb-4 h-5 w-32 animate-pulse rounded" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-hover h-10 animate-pulse rounded"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!games || games.length === 0) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <h3 className="text-heading mb-4 text-sm font-semibold">
          Chi tiết từng kèo
        </h3>
        <p className="text-faint text-sm">Chưa có kèo trong campaign</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border-surface-border overflow-hidden rounded-xl border">
      <div className="p-5 pb-3">
        <h3 className="text-heading text-sm font-semibold">
          Chi tiết từng kèo
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-surface-border border-b">
              <th className="text-faint px-4 py-2.5 text-left font-medium">
                Kèo
              </th>
              <th className="text-faint px-4 py-2.5 text-left font-medium">
                Ngày
              </th>
              <th className="text-faint px-4 py-2.5 text-center font-medium">
                Slot
              </th>
              <th className="text-faint px-4 py-2.5 text-center font-medium">
                Check-in
              </th>
              <th className="text-faint px-4 py-2.5 text-left font-medium">
                Fill Rate
              </th>
              <th className="text-faint px-4 py-2.5 text-center font-medium">
                QR / Thủ công / Bulk
              </th>
            </tr>
          </thead>
          <tbody className="divide-surface-border divide-y">
            {games.map((game) => {
              const fillPct = Math.round(game.fillRate * 100);
              return (
                <tr
                  key={game.gameId}
                  className="hover:bg-surface-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-heading font-medium">
                        {game.gameName}
                      </p>
                      {game.sportType && (
                        <p className="text-faint text-xs">
                          {SPORT_LABEL[game.sportType.toUpperCase()] ??
                            game.sportType}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="text-body px-4 py-3 text-sm">
                    {game.date
                      ? new Date(game.date).toLocaleDateString('vi-VN')
                      : '—'}
                  </td>
                  <td className="text-body px-4 py-3 text-center">
                    {game.maxSlots}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-heading font-semibold">
                      {game.checkIns}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-overlay-subtle h-1.5 w-20 overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            fillPct >= 80
                              ? 'bg-green-500'
                              : fillPct >= 50
                                ? 'bg-amber-500'
                                : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(fillPct, 100)}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          fillPct >= 80
                            ? 'text-green-600'
                            : fillPct >= 50
                              ? 'text-amber-600'
                              : 'text-red-500'
                        }`}
                      >
                        {fillPct}%
                      </span>
                    </div>
                  </td>
                  <td className="text-faint px-4 py-3 text-center text-xs">
                    <span className="font-medium text-green-600">
                      {game.qrScanCount}
                    </span>{' '}
                    /{' '}
                    <span className="font-medium text-amber-600">
                      {game.manualCount}
                    </span>{' '}
                    /{' '}
                    <span className="font-medium text-blue-600">
                      {game.bulkCount}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
