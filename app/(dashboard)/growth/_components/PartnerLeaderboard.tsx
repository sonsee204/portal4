'use client';

import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import type { BadgeVariant } from '@/config/theme';
import type { PartnerLeaderboardItem } from '@/types';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface PartnerRow {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  roleBadgeVariant: BadgeVariant;
  referralCode: string;
  signups: number;
  activationRate: number;
  revenue: string;
  trend: 'up' | 'down' | 'flat';
  isSystem?: boolean;
  isTopPerformer?: boolean;
}

interface PartnerLeaderboardProps {
  items?: PartnerLeaderboardItem[];
  totalCodes: number;
  loading: boolean;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function getRoleBadgeVariant(role?: string): BadgeVariant {
  if (!role) return 'neutral';
  const r = role.toLowerCase();
  if (r.includes('ceo') || r.includes('sáng lập')) return 'warning';
  if (r.includes('cgo') || r.includes('admin')) return 'info';
  return 'purple';
}

function formatRevenue(n: number): string {
  return n.toLocaleString('vi-VN');
}

export function mapToPartnerRows(
  items: PartnerLeaderboardItem[],
): PartnerRow[] {
  return items.map((item, index) => ({
    id: item.partnerId,
    name: item.partnerName,
    email: item.referralCode,
    avatar: item.avatarUrl,
    role: item.role ?? 'Đối tác',
    roleBadgeVariant: getRoleBadgeVariant(item.role),
    referralCode: item.referralCode,
    signups: item.totalSignups,
    activationRate: item.activationRate,
    revenue: formatRevenue(item.totalRevenue),
    trend: (item.trend as 'up' | 'down' | 'flat') || 'flat',
    isTopPerformer: index === 0,
  }));
}

/* ------------------------------------------------------------------ */
/* Column definitions                                                  */
/* ------------------------------------------------------------------ */

const columns: DataTableColumn[] = [
  { key: 'source', label: 'Nguồn / Đối tác' },
  { key: 'role', label: 'Vai trò' },
  { key: 'referral', label: 'Mã giới thiệu' },
  { key: 'signups', label: 'Đăng ký', align: 'right' },
  { key: 'activation', label: 'Kích hoạt' },
  { key: 'revenue', label: 'Doanh thu (VND)', align: 'right' },
  { key: 'trend', label: 'Xu hướng', align: 'center' },
];

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function ActivationBar({
  rate,
  variant,
}: {
  rate: number;
  variant: 'primary' | 'muted' | 'danger';
}) {
  const barColor =
    variant === 'primary'
      ? 'bg-primary'
      : variant === 'danger'
        ? 'bg-red-400'
        : 'bg-slate-400';
  const textColor = variant === 'danger' ? 'text-red-500' : 'text-muted';

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className={`w-8 text-xs font-medium ${textColor}`}>{rate}%</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function PartnerLeaderboard({
  items,
  totalCodes,
  loading,
}: PartnerLeaderboardProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-surface-hover h-6 w-52 animate-pulse rounded" />
        <div className="bg-surface border-surface-border rounded-xl border p-6 shadow-sm">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-hover h-14 animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const data = items ? mapToPartnerRows(items) : [];

  const renderRow = (row: PartnerRow, index: number) => {
    const isGold = row.isTopPerformer;
    const rowBg = row.isSystem
      ? 'bg-black/[0.02] dark:bg-white/[0.02]'
      : isGold
        ? 'bg-amber-50/40 dark:bg-amber-900/10 border-l-4 border-l-amber-400'
        : '';

    return (
      <tr
        key={row.id}
        className={`${rowBg} hover:bg-surface-hover transition-colors`}
      >
        {/* Source / Partner */}
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            {row.isSystem ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10">
                <IonIcon name="globe-outline" className="text-muted" />
              </div>
            ) : (
              <div className="relative">
                <Avatar
                  src={row.avatar}
                  alt={row.name}
                  fallback={row.name.charAt(0)}
                  size="md"
                />
                {isGold && (
                  <div className="bg-surface absolute -top-1 -right-1 rounded-full p-0.5 shadow-sm">
                    <IonIcon
                      name="trophy-outline"
                      size="xs"
                      className="text-amber-500"
                    />
                  </div>
                )}
                {!isGold && index <= 3 && !row.isSystem && (
                  <div className="bg-surface absolute -top-1 -right-1 rounded-full p-0.5 shadow-sm">
                    <IonIcon
                      name="ribbon-outline"
                      size="xs"
                      className="text-slate-400"
                    />
                  </div>
                )}
              </div>
            )}
            <div>
              <p className="text-heading text-sm font-semibold">{row.name}</p>
              <p className="text-faint text-xs">{row.email}</p>
            </div>
          </div>
        </td>

        {/* Role */}
        <td className="px-4 py-4">
          <Badge variant={row.roleBadgeVariant}>{row.role}</Badge>
        </td>

        {/* Referral Code */}
        <td className="px-4 py-4">
          <code className="bg-surface-hover border-surface-border rounded border px-2 py-1 font-mono text-xs">
            {row.referralCode}
          </code>
        </td>

        {/* Signups */}
        <td className="text-heading px-4 py-4 text-right font-medium">
          {row.signups.toLocaleString()}
        </td>

        {/* Activation */}
        <td className="w-1/5 px-4 py-4">
          <ActivationBar
            rate={row.activationRate}
            variant={
              row.isSystem
                ? 'muted'
                : row.activationRate < 20
                  ? 'danger'
                  : 'primary'
            }
          />
        </td>

        {/* Revenue */}
        <td className="px-4 py-4 text-right font-medium">
          {row.isSystem ? (
            <span className="text-muted">-</span>
          ) : (
            <span
              className={
                row.trend === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-body'
              }
            >
              {row.revenue}
            </span>
          )}
        </td>

        {/* Trend */}
        <td className="px-4 py-4 text-center">
          {row.trend === 'up' ? (
            <IonIcon
              name="trending-up-outline"
              size="sm"
              className="text-emerald-500"
            />
          ) : row.trend === 'down' ? (
            <IonIcon
              name="trending-down-outline"
              size="sm"
              className="text-red-500"
            />
          ) : (
            <IonIcon name="remove-outline" size="sm" className="text-faint" />
          )}
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-heading px-1 text-lg font-semibold">
        Đối tác & nguồn dẫn đầu
      </h3>
      <div className="bg-surface border-surface-border overflow-hidden rounded-xl border shadow-sm">
        <DataTable<PartnerRow>
          columns={columns}
          data={data}
          renderRow={renderRow}
          emptyTitle="Chưa có dữ liệu partner"
        />

        {/* Footer */}
        <div className="border-surface-border text-faint flex items-center justify-between border-t px-6 py-4 text-xs">
          <span>
            Đang hiển thị {data.length} trong tổng {totalCodes} mã giới thiệu
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            Xem tất cả đối tác
          </button>
        </div>
      </div>
    </div>
  );
}
