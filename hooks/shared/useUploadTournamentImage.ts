'use client';

import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPLOAD_TOURNAMENT_IMAGE } from '@/graphql/mutations/upload';
import { createSilentMutationOptions } from './mutation-helpers';

interface UploadResult {
  url: string;
  key: string;
}

export function useUploadTournamentImage(tournamentId?: string) {
  const [mutation, { loading }] = useMutation<{
    uploadTournamentImage: UploadResult;
  }>(UPLOAD_TOURNAMENT_IMAGE, createSilentMutationOptions('UploadTournamentImage'));

  const upload = useCallback(
    async (base64Image: string): Promise<string | null> => {
      try {
        const { data } = await mutation({
          variables: {
            input: { base64Image, tournamentId: tournamentId || undefined },
          },
        });
        return data?.uploadTournamentImage.url ?? null;
      } catch {
        return null;
      }
    },
    [mutation, tournamentId],
  );

  return { upload, loading };
}
