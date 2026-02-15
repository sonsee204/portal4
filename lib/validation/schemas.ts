import { z } from 'zod';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  PASSWORD_MIN_LENGTH,
  OTP_LENGTH,
  FULLNAME_MIN_LENGTH,
} from './constants';

// ==================== Base Validations ====================

export const emailValidation = z
  .string()
  .min(1, 'Email là bắt buộc')
  .email('Email không hợp lệ');

export const phoneValidation = z
  .string()
  .min(1, 'Số điện thoại là bắt buộc')
  .regex(PHONE_REGEX, 'Số điện thoại không hợp lệ (VD: 0987654321 hoặc +84987654321)');

export const passwordValidation = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Mật khẩu phải có ít nhất ${PASSWORD_MIN_LENGTH} ký tự`);

export const fullNameValidation = z
  .string()
  .min(FULLNAME_MIN_LENGTH, `Họ tên phải có ít nhất ${FULLNAME_MIN_LENGTH} ký tự`);

export const otpValidation = z
  .string()
  .length(OTP_LENGTH, `Mã OTP phải có ${OTP_LENGTH} chữ số`);

export const emailOrPhoneValidation = z
  .string()
  .min(1, 'Vui lòng nhập email hoặc số điện thoại')
  .refine(
    (value) => {
      const trimmed = value.trim();
      if (trimmed.includes('@')) {
        return EMAIL_REGEX.test(trimmed);
      }
      return PHONE_REGEX.test(trimmed.replace(/\s/g, ''));
    },
    'Email hoặc số điện thoại không hợp lệ',
  );

// ==================== Form Schemas ====================

/** Admin creates a new user */
export const createUserSchema = z.object({
  fullName: fullNameValidation,
  email: emailValidation,
  phone: phoneValidation,
  password: passwordValidation,
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'FACILITY_OWNER']),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

/** User login */
export const loginSchema = z.object({
  emailOrPhone: emailOrPhoneValidation,
  password: passwordValidation,
});

export type LoginFormData = z.infer<typeof loginSchema>;

/** Phone input for password reset */
export const forgotPasswordPhoneSchema = z.object({
  phone: phoneValidation,
});

export type ForgotPasswordPhoneData = z.infer<typeof forgotPasswordPhoneSchema>;

/** OTP verification */
export const otpSchema = z.object({
  otp: otpValidation,
});

export type OtpFormData = z.infer<typeof otpSchema>;

/** Reset password (new password + confirm) */
export const resetPasswordSchema = z
  .object({
    newPassword: passwordValidation,
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
