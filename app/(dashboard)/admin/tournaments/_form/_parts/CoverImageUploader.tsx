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

import { useCallback, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useUploadTournamentImage } from '@/hooks/shared/useUploadTournamentImage';

interface CoverImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  tournamentId?: string;
}

export function CoverImageUploader({
  value,
  onChange,
  tournamentId,
}: CoverImageUploaderProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, loading } = useUploadTournamentImage(tournamentId);

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const url = await upload(base64);
        if (url) onChange(url);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [upload, onChange]
  );

  return (
    <div>
      <label className="text-body mb-1.5 block text-sm font-medium">
        Ảnh bìa giải đấu
      </label>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={loading}
        onChange={handleFileChange}
      />

      {value ? (
        <div className="relative h-[200px] w-full overflow-hidden rounded-xl">
          <Image
            src={value}
            alt="Ảnh bìa giải đấu"
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="rounded-xl object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 opacity-0 transition-all hover:bg-black/40 hover:opacity-100">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="text-heading flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow transition-transform hover:scale-110"
            >
              <IonIcon name="camera-outline" size="sm" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-danger/90 flex h-10 w-10 items-center justify-center rounded-full text-white shadow transition-transform hover:scale-110"
            >
              <IonIcon name="trash-outline" size="sm" />
            </button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-surface-border group relative flex min-h-[200px] cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors',
            'hover:border-primary/40 hover:bg-primary/5'
          )}
          onClick={() => !loading && fileRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            {loading ? (
              <>
                <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-2xl">
                  <IonIcon name="hourglass-outline" size="lg" />
                </div>
                <p className="text-heading text-sm font-medium">
                  Đang tải ảnh lên...
                </p>
              </>
            ) : (
              <>
                <div className="bg-overlay-faint text-faint group-hover:bg-primary/10 group-hover:text-primary flex h-14 w-14 items-center justify-center rounded-2xl transition-colors">
                  <IonIcon name="cloud-upload-outline" size="lg" />
                </div>
                <div>
                  <p className="text-heading text-sm font-medium">
                    Kéo thả hoặc nhấn để tải ảnh lên
                  </p>
                  <p className="text-muted mt-1 text-xs">
                    PNG, JPG tối đa 5MB. Khuyến nghị 1200 x 400px
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
