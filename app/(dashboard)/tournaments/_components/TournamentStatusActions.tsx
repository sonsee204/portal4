'use client';

import { Button } from '@/components/atoms/Button';
import {
  usePublishTournament,
  useOpenRegistration,
  useCloseRegistration,
  useStartTournament,
  useCompleteTournament,
  useCancelTournament,
} from '@/hooks/tournament';
import { TOURNAMENT } from '@/lib/strings';
import type { TournamentStatus } from '@/graphql/generated';

interface TournamentStatusActionsProps {
  tournamentId: string;
  status: TournamentStatus;
  onStatusChange: () => void;
}

export function TournamentStatusActions({
  tournamentId,
  status,
  onStatusChange,
}: TournamentStatusActionsProps) {
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

  const isLoading =
    publishing ||
    openingReg ||
    closingReg ||
    starting ||
    completing ||
    cancelling;

  const handleCancel = () => {
    if (window.confirm(TOURNAMENT.CONFIRM_CANCEL_TOURNAMENT)) {
      void cancel(tournamentId);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
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

      {!['COMPLETED', 'CANCELLED'].includes(status) && (
        <Button
          size="sm"
          variant="ghost"
          disabled={isLoading}
          onClick={handleCancel}
          className="text-red-400 hover:text-red-300"
        >
          Huỷ
        </Button>
      )}
    </div>
  );
}
