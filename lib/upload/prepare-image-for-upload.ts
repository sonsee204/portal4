/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import imageCompression from 'browser-image-compression';
import {
  PAYMENT_PROOF_ACCEPT,
  PAYMENT_PROOF_MAX_BYTES,
} from '@/lib/owner/payment-proof';

const ALLOWED_MIME_TYPES = PAYMENT_PROOF_ACCEPT.split(',');

export class ImageUploadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageUploadValidationError';
  }
}

function normalizeMimeType(file: File): string {
  const type = file.type.toLowerCase();
  if (type === 'image/jpg') return 'image/jpeg';
  return type;
}

export function validateImageFile(file: File): void {
  const mimeType = normalizeMimeType(file);

  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    throw new ImageUploadValidationError(
      'Định dạng file không hợp lệ. Chỉ chấp nhận JPEG, PNG hoặc WebP.',
    );
  }

  if (file.size > PAYMENT_PROOF_MAX_BYTES) {
    const maxMb = PAYMENT_PROOF_MAX_BYTES / (1024 * 1024);
    throw new ImageUploadValidationError(
      `Kích thước file quá lớn. Tối đa ${maxMb}MB cho ảnh minh chứng thanh toán.`,
    );
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Không thể đọc file ảnh.'));
      }
    };
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh.'));
    reader.readAsDataURL(file);
  });
}

export async function prepareImageForUpload(file: File): Promise<string> {
  validateImageFile(file);

  const compressed = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
  });

  if (compressed.size > PAYMENT_PROOF_MAX_BYTES) {
    const maxMb = PAYMENT_PROOF_MAX_BYTES / (1024 * 1024);
    throw new ImageUploadValidationError(
      `Kích thước file quá lớn sau khi nén. Tối đa ${maxMb}MB cho ảnh minh chứng thanh toán.`,
    );
  }

  return readFileAsDataUrl(compressed);
}

export async function prepareImagesForUpload(files: File[]): Promise<string[]> {
  const results: string[] = [];
  for (const file of files) {
    results.push(await prepareImageForUpload(file));
  }
  return results;
}
