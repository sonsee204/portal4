'use client';

import { useParams } from 'next/navigation';
import { useTournamentMedia } from './_hooks/useTournamentMedia';
import { MediaGrid } from './_sections/MediaGrid';
import { MediaUpload } from './_sections/MediaUpload';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TOURNAMENT } from '@/lib/strings';

export default function TournamentMediaPage() {
  const params = useParams<{ id: string }>();
  const tournamentId = params.id;

  const {
    coverImage,
    loading,
    error,
    uploadAndSetCover,
    uploading,
    deleteImage,
    deleting,
  } = useTournamentMedia(tournamentId);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Lỗi: {error.message}</p>
      </div>
    );
  }

  // Đếm số ảnh (hiện tại chỉ có coverImage)
  const imageCount = coverImage ? 1 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={TOURNAMENT.LABEL_MEDIA || 'Media'}
        description="Quản lý ảnh của giải đấu (hiện tại hỗ 1 ảnh, sẽ mở rộng lên nhiều ảnh sau)"
        actions={
          <MediaUpload
            onUpload={uploadAndSetCover}
            uploading={uploading}
            disabled={loading}
          />
        }
      />

      <GlassPanel card>
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? 'Đang tải...' : `${imageCount} ảnh`}
              {coverImage ? ' • Có ảnh ' : ''}
            </span>
          </div>
          <MediaGrid
            coverImage={coverImage}
            loading={loading}
            error={error}
            onDelete={deleteImage}
            deleting={uploading || deleting}
          />
        </div>
      </GlassPanel>
    </div>
  );
}
