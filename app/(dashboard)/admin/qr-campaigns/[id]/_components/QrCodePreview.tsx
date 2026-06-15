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
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useGenerateQrCode } from '@/hooks/qr-campaign';

interface QrCodePreviewProps {
  campaignId: string;
  campaignSlug: string;
  campaignName: string;
}

export function QrCodePreview({
  campaignId,
  campaignSlug,
  campaignName,
}: QrCodePreviewProps) {
  const { svgString, loading, error, refetch } = useGenerateQrCode(campaignId);

  const downloadSvg = useCallback(() => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${campaignSlug}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svgString, campaignSlug]);

  const downloadPng = useCallback(async () => {
    if (!svgString) return;

    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = `qr-${campaignSlug}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  }, [svgString, campaignSlug]);

  return (
    <div className="bg-surface border-surface-border rounded-xl border p-6">
      <h3 className="text-heading mb-4 text-sm font-semibold">QR Code</h3>

      {loading && (
        <div className="bg-surface-hover mx-auto h-48 w-48 animate-pulse rounded-xl" />
      )}

      {error && (
        <div className="text-faint flex flex-col items-center gap-2 py-8 text-sm">
          <IonIcon
            name="alert-circle-outline"
            className="text-2xl text-red-400"
          />
          <p>Không thể tải QR code</p>
          <Button variant="ghost" size="sm" onClick={() => void refetch()}>
            Thử lại
          </Button>
        </div>
      )}

      {svgString && !loading && (
        <div className="flex flex-col items-center gap-4">
          {/* SVG Preview */}
          <div
            className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
            dangerouslySetInnerHTML={{ __html: svgString }}
            style={{ width: 200, height: 200 }}
          />

          <p className="text-faint text-center text-xs">
            aotrinh.vn/download?c=
            <span className="font-mono font-medium">{campaignSlug}</span>
          </p>

          <p className="text-faint text-center text-xs">{campaignName}</p>

          {/* Download buttons */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconLeft="download-outline"
              onClick={downloadSvg}
            >
              SVG
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconLeft="image-outline"
              onClick={() => void downloadPng()}
            >
              PNG
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
