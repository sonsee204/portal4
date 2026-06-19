/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import {
  ImageUploadValidationError,
  validateImageFile,
} from '@/lib/upload/prepare-image-for-upload';
import { PAYMENT_PROOF_MAX_BYTES } from '@/lib/owner/payment-proof';

function createFile(name: string, type: string, size: number): File {
  const buffer = new Uint8Array(size);
  return new File([buffer], name, { type });
}

describe('validateImageFile', () => {
  it('rejects unsupported mime types', () => {
    const file = createFile('doc.pdf', 'application/pdf', 1024);
    expect(() => validateImageFile(file)).toThrow(ImageUploadValidationError);
    expect(() => validateImageFile(file)).toThrow(/Định dạng file không hợp lệ/);
  });

  it('accepts jpeg png and webp', () => {
    expect(() =>
      validateImageFile(createFile('a.jpg', 'image/jpeg', 1024)),
    ).not.toThrow();
    expect(() =>
      validateImageFile(createFile('a.png', 'image/png', 1024)),
    ).not.toThrow();
    expect(() =>
      validateImageFile(createFile('a.webp', 'image/webp', 1024)),
    ).not.toThrow();
  });

  it('rejects files larger than 10MB', () => {
    const file = createFile('big.jpg', 'image/jpeg', PAYMENT_PROOF_MAX_BYTES + 1);
    expect(() => validateImageFile(file)).toThrow(ImageUploadValidationError);
    expect(() => validateImageFile(file)).toThrow(/quá lớn/);
  });
});
