import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_TOURNAMENT,
  UPLOAD_TOURNAMENT_IMAGE,
} from '@/graphql/tournament/queries';
import { UPDATE_TOURNAMENT } from '@/graphql/tournament/mutations';
import type {
  GetTournamentQuery,
  GetTournamentQueryVariables,
  UploadTournamentImageMutation,
  UploadTournamentImageMutationVariables,
} from '@/graphql/generated';
import { toast } from 'sonner';

export function useTournamentMedia(tournamentId: string) {
  // 👇 Thêm kiểu generic cho useQuery
  const { data, loading, error, refetch } = useQuery<
    GetTournamentQuery,
    GetTournamentQueryVariables
  >(GET_TOURNAMENT, {
    variables: { id: tournamentId },
    fetchPolicy: 'cache-and-network',
  });

  // 👇 Bây giờ data có kiểu, coverImage không còn lỗi
  const coverImage = data?.tournament?.coverImage || null;

  // 👇 Thêm kiểu cho useMutation
  const [uploadImage, { loading: uploading }] = useMutation<
    UploadTournamentImageMutation,
    UploadTournamentImageMutationVariables
  >(UPLOAD_TOURNAMENT_IMAGE, {
    onError: (err) => toast.error(err.message || 'Tải ảnh thất bại'),
    onCompleted: () => {
      toast.success('Tải ảnh thành công');
      refetch();
    },
  });

  // 👉 Sửa tiếp: khai báo updateTournament và hàm uploadAndSetCover
  const [updateTournament, { loading: deleting }] = useMutation(
    UPDATE_TOURNAMENT,
    {
      onError: (err) => toast.error(err.message || 'Cập nhật thất bại'),
      onCompleted: () => {
        toast.success('Cập nhật thành công');
        refetch();
      },
    }
  );

  const uploadAndSetCover = async (base64Image: string) => {
    try {
      // 👇 Biến result giờ có kiểu
      const result = await uploadImage({
        variables: {
          input: {
            tournamentId,
            base64Image,
          },
        },
      });
      // 👇 Không còn lỗi vì result.data có kiểu UploadTournamentImageMutation
      const url = result.data?.uploadTournamentImage?.url;
      if (url) {
        await updateTournament({
          variables: {
            input: {
              id: tournamentId,
              coverImage: url,
            },
          },
        });
        toast.success('Cập nhật ảnh thành công');
        refetch();
      } else {
        toast.error('Không lấy được URL ảnh');
      }
    } catch (err) {
      toast.error((err as Error).message || 'Tải ảnh thất bại');
    }
  };

  const deleteImage = async () => {
    await updateTournament({
      variables: {
        input: {
          id: tournamentId,
          coverImage: null,
        },
      },
    });
  };

  return {
    coverImage,
    loading,
    error,
    refetch,
    uploadAndSetCover,
    uploading,
    deleteImage,
    deleting,
  };
}
