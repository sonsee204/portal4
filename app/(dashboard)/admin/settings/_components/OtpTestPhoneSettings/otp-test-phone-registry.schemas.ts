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

import { z } from 'zod';

import type { OtpTestPhonePurpose } from '@/lib/api/otp-test-phones';

export const PURPOSE_OPTIONS: { label: string; value: OtpTestPhonePurpose }[] =
  [
    { label: 'Đăng ký', value: 'SIGN_UP_PHONE' },
    { label: 'Đăng nhập', value: 'SIGN_IN_PHONE' },
    { label: 'Quên mật khẩu', value: 'PASSWORD_RESET_PHONE' },
    { label: 'Đổi SĐT', value: 'PHONE_CHANGE' },
  ];

export const createSchema = z.object({
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  testCode: z.string().regex(/^\d{6}$/, 'Mã OTP phải đúng 6 chữ số'),
  label: z.string().min(1, 'Nhãn là bắt buộc').max(120),
  allowedPurposes: z.array(z.string()).optional(),
  expiresAt: z.string().optional(),
});

export const editSchema = createSchema.omit({ phone: true });

export type CreateForm = z.infer<typeof createSchema>;
export type EditForm = z.infer<typeof editSchema>;
