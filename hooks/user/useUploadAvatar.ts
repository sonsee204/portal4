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

import { useMutation } from '@apollo/client/react';
import { useCallback } from 'react';
import { UPLOAD_AVATAR } from '@/graphql/user/mutations';
import { useAuthStore } from '@/stores/auth';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { showSuccess } from '@/lib/toast';

export function useUploadAvatar() {
  const setUser = useAuthStore((s) => s.setUser);

  const [mutate, { loading }] = useMutation<
    { uploadAvatar: { url: string; user: { _id: string; photoURL?: string } } },
    { input: { base64Image: string } }
  >(UPLOAD_AVATAR, {
    ...createMutationOptions('UploadAvatar'),
    onCompleted: (data) => {
      const updatedUser = data.uploadAvatar.user;
      const currentUser = useAuthStore.getState().user;
      if (currentUser && updatedUser) {
        setUser({
          ...currentUser,
          photoURL: updatedUser.photoURL ?? currentUser.photoURL,
        });
      }
      showSuccess('Cập nhật ảnh đại diện thành công');
    },
  });

  const uploadAvatar = useCallback(
    (base64Image: string) =>
      mutate({
        variables: { input: { base64Image } },
      }),
    [mutate],
  );

  return { uploadAvatar, loading };
}
