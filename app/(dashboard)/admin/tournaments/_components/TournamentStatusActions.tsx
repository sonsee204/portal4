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

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import {
  usePublishTournament,
  useOpenRegistration,
  useCloseRegistration,
  useStartTournament,
  useCompleteTournament,
  useCancelTournament,
  useDuplicateTournament,
  useDeleteTournament,
} from '@/hooks/tournament';
import { TOURNAMENT } from '@/lib/strings';
import type { TournamentStatus } from '@/graphql/generated';

interface TournamentStatusActionsProps {
  tournamentId: string;
  status: TournamentStatus;
  onStatusChange: () => void;
}

type DialogType =
  | 'publish'
  | 'openReg'
  | 'closeReg'
  | 'start'
  | 'complete'
  | 'cancel'
  | 'duplicate'
  | 'delete'
  | null;

export function TournamentStatusActions({
  tournamentId,
  status,
  onStatusChange,
}: TournamentStatusActionsProps) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState<DialogType>(null);

  const { execute: publish, loading: publishing } =
    usePublishTournament(onStatusChange);
  const { execute: openReg, loading: openingReg } =
    useOpenRegistration(onStatusChange);
  const { execute: closeReg, loading: closingReg } =
    useCloseRegistration(onStatusChange);
  const { execute: start, loading: starting } =
    useStartTournament(onStatusChange);
  const { execute: complete, loading: completing } =
    useCompleteTournament(onStatusChange);
  const { execute: cancel, loading: cancelling } =
    useCancelTournament(onStatusChange);
  const { execute: duplicate, loading: duplicating } = useDuplicateTournament(
    (newTournament) => {
      router.push(`/admin/tournaments/${newTournament._id}/edit`);
    }
  );
  const { execute: deleteTournament, loading: deleting } = useDeleteTournament(
    () => {
      router.push('/admin/tournaments');
    }
  );

  const isLoading =
    publishing ||
    openingReg ||
    closingReg ||
    starting ||
    completing ||
    cancelling ||
    duplicating ||
    deleting;

  const handleConfirm = async () => {
    if (!openDialog) return;
    switch (openDialog) {
      case 'publish':
        await publish(tournamentId);
        break;
      case 'openReg':
        await openReg(tournamentId);
        break;
      case 'closeReg':
        await closeReg(tournamentId);
        break;
      case 'start':
        await start(tournamentId);
        break;
      case 'complete':
        await complete(tournamentId);
        break;
      case 'cancel':
        await cancel(tournamentId);
        break;
      case 'duplicate':
        await duplicate(tournamentId);
        break;
      case 'delete':
        await deleteTournament(tournamentId);
        break;
    }
    setOpenDialog(null);
  };

  const isDraft = status === 'DRAFT';
  const isTerminal = ['COMPLETED', 'CANCELLED'].includes(status);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/admin/tournaments/${tournamentId}/registrations`}>
          <Button size="sm" variant="outline" iconLeft="people-outline">
            Quản lý đăng ký
          </Button>
        </Link>

        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          iconLeft="copy-outline"
          onClick={() => setOpenDialog('duplicate')}
        >
          Nhân bản
        </Button>

        {status === 'DRAFT' && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => setOpenDialog('publish')}
          >
            Đăng giải đấu
          </Button>
        )}

        {status === 'PUBLISHED' && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => setOpenDialog('openReg')}
          >
            Mở đăng ký
          </Button>
        )}

        {status === 'REGISTRATION_OPEN' && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => setOpenDialog('closeReg')}
          >
            Đóng đăng ký
          </Button>
        )}

        {status === 'REGISTRATION_CLOSED' && (
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => setOpenDialog('start')}
          >
            Bắt đầu giải đấu
          </Button>
        )}

        {status === 'IN_PROGRESS' && (
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => setOpenDialog('complete')}
          >
            Kết thúc giải đấu
          </Button>
        )}

        {!isTerminal && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isLoading}
            onClick={() => setOpenDialog(isDraft ? 'delete' : 'cancel')}
            className="text-red-400 hover:text-red-300"
          >
            {isDraft ? 'Xoá giải đấu' : 'Huỷ giải đấu'}
          </Button>
        )}

        {isTerminal && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isLoading}
            onClick={() => setOpenDialog('delete')}
            className="text-red-400 hover:text-red-300"
          >
            Xoá hoàn toàn
          </Button>
        )}
      </div>

      {/* Duplicate confirmation */}
      <ConfirmDialog
        open={openDialog === 'duplicate'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Nhân bản giải đấu"
        description={TOURNAMENT.CONFIRM_DUPLICATE_TOURNAMENT}
        confirmLabel="Nhân bản"
        loading={duplicating}
      />

      {/* Status change confirmations */}
      <ConfirmDialog
        open={openDialog === 'publish'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Đăng giải đấu"
        description={TOURNAMENT.CONFIRM_PUBLISH}
        confirmLabel="Đăng"
        loading={publishing}
      />
      <ConfirmDialog
        open={openDialog === 'openReg'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Mở đăng ký"
        description={TOURNAMENT.CONFIRM_OPEN_REGISTRATION}
        confirmLabel="Mở đăng ký"
        loading={openingReg}
      />
      <ConfirmDialog
        open={openDialog === 'closeReg'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Đóng đăng ký"
        description={TOURNAMENT.CONFIRM_CLOSE_REGISTRATION}
        confirmLabel="Đóng đăng ký"
        loading={closingReg}
      />
      <ConfirmDialog
        open={openDialog === 'start'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Bắt đầu giải đấu"
        description={TOURNAMENT.CONFIRM_START_TOURNAMENT}
        confirmLabel="Bắt đầu"
        variant="warning"
        loading={starting}
      />
      <ConfirmDialog
        open={openDialog === 'complete'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Kết thúc giải đấu"
        description={TOURNAMENT.CONFIRM_COMPLETE_TOURNAMENT}
        confirmLabel="Kết thúc"
        variant="warning"
        loading={completing}
      />

      {/* Cancel confirmation */}
      <ConfirmDialog
        open={openDialog === 'cancel'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Huỷ giải đấu"
        description={TOURNAMENT.CONFIRM_CANCEL_TOURNAMENT}
        confirmLabel="Huỷ giải đấu"
        variant="warning"
        loading={cancelling}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        open={openDialog === 'delete'}
        onClose={() => setOpenDialog(null)}
        onConfirm={() => void handleConfirm()}
        title="Xoá giải đấu"
        description={TOURNAMENT.CONFIRM_DELETE_TOURNAMENT}
        confirmLabel="Xoá vĩnh viễn"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
