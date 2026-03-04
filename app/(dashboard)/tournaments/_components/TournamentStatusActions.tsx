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
  useDeleteTournament,
} from '@/hooks/tournament';
import { TOURNAMENT } from '@/lib/strings';
import type { TournamentStatus } from '@/graphql/generated';

interface TournamentStatusActionsProps {
  tournamentId: string;
  status: TournamentStatus;
  onStatusChange: () => void;
}

type DialogType = 'cancel' | 'delete' | null;

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
  const { execute: deleteTournament, loading: deleting } = useDeleteTournament(
    () => {
      router.push('/tournaments');
    }
  );

  const isLoading =
    publishing ||
    openingReg ||
    closingReg ||
    starting ||
    completing ||
    cancelling ||
    deleting;

  const handleConfirm = async () => {
    if (openDialog === 'cancel') {
      await cancel(tournamentId);
    } else if (openDialog === 'delete') {
      await deleteTournament(tournamentId);
    }
    setOpenDialog(null);
  };

  const isDraft = status === 'DRAFT';
  const isTerminal = ['COMPLETED', 'CANCELLED'].includes(status);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Link href={`/tournaments/${tournamentId}/registrations`}>
          <Button size="sm" variant="outline" iconLeft="people-outline">
            Quản lý đăng ký
          </Button>
        </Link>

        {status === 'DRAFT' && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => void publish(tournamentId)}
          >
            Đăng giải đấu
          </Button>
        )}

        {status === 'PUBLISHED' && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => void openReg(tournamentId)}
          >
            Mở đăng ký
          </Button>
        )}

        {status === 'REGISTRATION_OPEN' && (
          <Button
            size="sm"
            variant="outline"
            disabled={isLoading}
            onClick={() => void closeReg(tournamentId)}
          >
            Đóng đăng ký
          </Button>
        )}

        {status === 'REGISTRATION_CLOSED' && (
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => void start(tournamentId)}
          >
            Bắt đầu giải đấu
          </Button>
        )}

        {status === 'IN_PROGRESS' && (
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => void complete(tournamentId)}
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

      {/* Cancel confirmation — for non-DRAFT statuses */}
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

      {/* Delete confirmation — for DRAFT only */}
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
