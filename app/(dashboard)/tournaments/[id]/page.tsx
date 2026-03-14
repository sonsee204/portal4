'use client';

import { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { useTournament } from '@/hooks/tournament';
import { TOURNAMENT } from '@/lib/strings';

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-400',
  PUBLISHED: 'bg-blue-500/20 text-blue-400',
  REGISTRATION_OPEN: 'bg-green-500/20 text-green-400',
  REGISTRATION_CLOSED: 'bg-yellow-500/20 text-yellow-400',
  IN_PROGRESS: 'bg-orange-500/20 text-orange-400',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: TOURNAMENT.STATUS_DRAFT,
  PUBLISHED: TOURNAMENT.STATUS_PUBLISHED,
  REGISTRATION_OPEN: TOURNAMENT.STATUS_REGISTRATION_OPEN,
  REGISTRATION_CLOSED: TOURNAMENT.STATUS_REGISTRATION_CLOSED,
  IN_PROGRESS: TOURNAMENT.STATUS_IN_PROGRESS,
  COMPLETED: TOURNAMENT.STATUS_COMPLETED,
  CANCELLED: TOURNAMENT.STATUS_CANCELLED,
};

const QUICK_LINKS = [
  { href: 'edit', label: 'Chỉnh sửa', icon: 'create-outline' },
  { href: 'registrations', label: TOURNAMENT.LABEL_REGISTRATIONS, icon: 'person-add-outline' },
  { href: 'draw', label: TOURNAMENT.LABEL_DRAW, icon: 'git-branch-outline' },
  { href: 'schedule', label: TOURNAMENT.LABEL_SCHEDULE, icon: 'calendar-outline' },
] as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export default function TournamentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { tournament, loading, error } = useTournament(id);

  if (loading) {
    return (
      <GlassPanel card>
        <div className="flex items-center justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </GlassPanel>
    );
  }

  if (error || !tournament) {
    return (
      <GlassPanel card>
        <div className="py-20 text-center">
          <p className="text-secondary">Không tìm thấy giải đấu.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/tournaments')}
            className="mt-4"
          >
            Quay lại danh sách
          </Button>
        </div>
      </GlassPanel>
    );
  }

  const statusColor = STATUS_COLORS[tournament.status] ?? STATUS_COLORS.DRAFT;
  const statusLabel = STATUS_LABELS[tournament.status] ?? tournament.status;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">{tournament.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
            >
              {statusLabel}
            </span>
            <span className="text-muted text-sm">{tournament.sportType}</span>
            {tournament.location?.name && (
              <span className="text-muted text-sm">
                • {tournament.location.name}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/tournaments')}
        >
          Quay lại
        </Button>
      </div>

      <GlassPanel card>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="text-heading text-2xl font-bold">
              {tournament.totalCategories}
            </div>
            <div className="text-muted mt-1 text-sm">
              {TOURNAMENT.LABEL_CATEGORIES}
            </div>
          </div>
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="text-heading text-2xl font-bold">
              {tournament.totalRegistrations}
            </div>
            <div className="text-muted mt-1 text-sm">
              {TOURNAMENT.LABEL_REGISTRATIONS}
            </div>
          </div>
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="text-heading text-2xl font-bold">
              {tournament.totalMatches}
            </div>
            <div className="text-muted mt-1 text-sm">Trận đấu</div>
          </div>
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="text-heading text-sm font-medium">
              {tournament.dates?.startDate
                ? formatDate(tournament.dates.startDate)
                : '—'}
            </div>
            <div className="text-muted mt-1 text-sm">Ngày bắt đầu</div>
          </div>
        </div>

        <div className="border-surface-border mt-6 border-t pt-6">
          <h2 className="text-heading mb-4 text-sm font-semibold">
            Thao tác nhanh
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map(({ href, label, icon }) => (
              <Link
                key={href}
                href={`/tournaments/${id}/${href}`}
                className="text-secondary hover:text-primary flex items-center gap-3 rounded-lg border border-white/10 p-4 transition-colors hover:border-white/20 hover:bg-white/5"
              >
                <IonIcon name={icon} size="md" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
