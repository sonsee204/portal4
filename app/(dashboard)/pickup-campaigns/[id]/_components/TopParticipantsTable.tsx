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

import type { TopCampaignParticipant } from '@/graphql/types';

interface TopParticipantsTableProps {
  participants?: TopCampaignParticipant[];
  loading: boolean;
}

export function TopParticipantsTable({
  participants,
  loading,
}: TopParticipantsTableProps) {
  if (loading) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <div className="bg-surface-hover mb-4 h-5 w-36 animate-pulse rounded" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-surface-hover h-8 w-8 animate-pulse rounded-full" />
              <div className="bg-surface-hover h-4 flex-1 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!participants || participants.length === 0) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <h3 className="text-heading mb-4 text-sm font-semibold">
          Top Người Chơi
        </h3>
        <p className="text-faint text-sm">Chưa có dữ liệu</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border-surface-border overflow-hidden rounded-xl border">
      <div className="p-5 pb-3">
        <h3 className="text-heading text-sm font-semibold">Top Người Chơi</h3>
      </div>
      <div className="divide-surface-border divide-y">
        {participants.map((p, index) => {
          const attendancePct = Math.round(p.attendanceRate * 100);
          return (
            <div
              key={p.userId}
              className="hover:bg-surface-hover flex items-center gap-3 px-5 py-3 transition-colors"
            >
              {/* Rank */}
              <span
                className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  index === 0
                    ? 'bg-amber-400 text-white'
                    : index === 1
                      ? 'bg-gray-300 text-gray-700'
                      : index === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-surface-hover text-faint'
                }`}
              >
                {index + 1}
              </span>

              {/* Avatar */}
              {p.avatarUrl ? (
                <img
                  src={p.avatarUrl}
                  alt={p.displayName}
                  className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {p.displayName.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Name & stats */}
              <div className="min-w-0 flex-1">
                <p className="text-heading truncate text-sm font-medium">
                  {p.displayName}
                </p>
                <p className="text-faint text-xs">
                  {p.gamesJoined} kèo · {p.gamesCheckedIn} check-in
                </p>
              </div>

              {/* Attendance rate */}
              <div className="flex flex-shrink-0 flex-col items-end">
                <span
                  className={`text-sm font-semibold ${
                    attendancePct >= 80
                      ? 'text-green-600'
                      : attendancePct >= 50
                        ? 'text-amber-600'
                        : 'text-red-500'
                  }`}
                >
                  {attendancePct}%
                </span>
                <span className="text-faint text-xs">attendance</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
