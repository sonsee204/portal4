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

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { useTournament } from '@/hooks/tournament';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import { TournamentFormWizard } from '../../_form/TournamentFormWizard';
import { mapTournamentToFormData } from '../../_form/_utils/mapFormToInput';
import { TOURNAMENT } from '@/lib/strings';
import { TournamentStatus } from '@/graphql/generated';

const BLOCKED_EDIT_STATUSES: TournamentStatus[] = [
  TournamentStatus.InProgress,
  TournamentStatus.Completed,
  TournamentStatus.Cancelled,
];

export default function EditTournamentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const routes = useTournamentRoutes();
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
            onClick={() => router.push('/admin/tournaments')}
            className="mt-4"
          >
            Quay lại danh sách
          </Button>
        </div>
      </GlassPanel>
    );
  }

  const isEditBlocked = BLOCKED_EDIT_STATUSES.includes(tournament.status);

  const isCourtsOnlyEdit =
    tournament.status === TournamentStatus.RegistrationOpen ||
    tournament.status === TournamentStatus.RegistrationClosed;

  const pageTitle = isCourtsOnlyEdit
    ? TOURNAMENT.LABEL_MANAGE_COURTS
    : 'Chỉnh sửa giải đấu';

  const pageDescription = isCourtsOnlyEdit
    ? 'Cập nhật số lượng và trạng thái sân thi đấu.'
    : 'Cập nhật thông tin giải đấu hiện có.';

  return (
    <>
      <PageHeader title={pageTitle} description={pageDescription}>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push(routes.detail(id))}
        >
          Quay lại
        </Button>
      </PageHeader>

      <div className="mt-6">
        {isEditBlocked ? (
          <GlassPanel card>
            <div className="py-20 text-center">
              <p className="text-secondary">
                {TOURNAMENT.EDIT_BLOCKED_IN_PROGRESS}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(routes.detail(id))}
                className="mt-4"
              >
                Quay lại chi tiết giải
              </Button>
            </div>
          </GlassPanel>
        ) : (
          <TournamentFormWizard
            defaultValues={mapTournamentToFormData(tournament)}
            isEditMode
            tournamentId={id}
            tournamentStatus={tournament.status}
          />
        )}
      </div>
    </>
  );
}
