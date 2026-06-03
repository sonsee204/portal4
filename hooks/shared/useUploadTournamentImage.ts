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
