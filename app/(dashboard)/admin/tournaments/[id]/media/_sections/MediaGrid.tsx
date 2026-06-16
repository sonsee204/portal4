/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';

interface MediaGridProps {
  coverImage: string | null;
  loading: boolean;
  error?: Error | null;
  onDelete: () => void;
  deleting?: boolean;
  /**
   * Sau này khi backend có mediaImages, đổi tên prop thành images và dùng map
   */
}

export function MediaGrid({
  coverImage,
  loading,
  error,
  onDelete,
  deleting = false,
}: MediaGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500">Lỗi: {error.message}</div>
    );
  }

  if (!coverImage) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          Chưa có ảnh cho giải đấu này
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Sẽ hỗ trợ nhiều ảnh trong tương lai
        </p>
      </div>
    );
  }

  // Để chuẩn bị cho mediaImages, tôi dùng mảng 1 phần tử
  const images = [coverImage];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {images.map((url) => (
        <div
          key={url}
          className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <Image
            src={url}
            alt="Tournament media"
            fill
            className="object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          <span className="absolute top-2 left-2 rounded bg-blue-600 px-2 py-0.5 text-xs font-medium text-white">
            Ảnh bìa
          </span>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              onClick={onDelete}
              disabled={deleting}
              className="h-8 w-8 rounded-full bg-red-600 p-0 text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
