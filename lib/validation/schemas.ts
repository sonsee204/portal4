import { z } from 'zod';
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  PASSWORD_MIN_LENGTH,
  OTP_LENGTH,
  FULLNAME_MIN_LENGTH,
} from './constants';
import { VALIDATION, GROWTH } from '@/lib/strings';

// ==================== Base Validations ====================

export const emailValidation = z
  .string()
  .min(1, VALIDATION.EMAIL_REQUIRED)
  .pipe(z.email({ error: VALIDATION.EMAIL_INVALID }));

export const phoneValidation = z
  .string()
  .min(1, VALIDATION.PHONE_REQUIRED)
  .regex(PHONE_REGEX, VALIDATION.PHONE_INVALID);

export const passwordValidation = z
  .string()
  .min(PASSWORD_MIN_LENGTH, VALIDATION.PASSWORD_MIN(PASSWORD_MIN_LENGTH))
  .regex(/[A-Z]/, VALIDATION.PASSWORD_UPPERCASE)
  .regex(/[a-z]/, VALIDATION.PASSWORD_LOWERCASE)
  .regex(/[0-9]/, VALIDATION.PASSWORD_DIGIT);

export const fullNameValidation = z
  .string()
  .min(FULLNAME_MIN_LENGTH, VALIDATION.FULLNAME_MIN(FULLNAME_MIN_LENGTH));

export const otpValidation = z
  .string()
  .length(OTP_LENGTH, VALIDATION.OTP_LENGTH(OTP_LENGTH));

export const emailOrPhoneValidation = z
  .string()
  .min(1, VALIDATION.EMAIL_OR_PHONE_REQUIRED)
  .refine(
    (value) => {
      const trimmed = value.trim();
      if (trimmed.includes('@')) {
        return EMAIL_REGEX.test(trimmed);
      }
      return PHONE_REGEX.test(trimmed.replace(/\s/g, ''));
    },
    VALIDATION.EMAIL_OR_PHONE_INVALID,
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
    confirmPassword: z.string().min(1, VALIDATION.CONFIRM_PASSWORD),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: VALIDATION.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/** Admin creates a referral code */
export const createReferralCodeSchema = z.object({
  code: z.string().min(1, `${GROWTH.REFERRAL.FORM.CODE} là bắt buộc`),
  ownerId: z.string().min(1, `${GROWTH.REFERRAL.FORM.OWNER_ID} là bắt buộc`),
  ownerName: z.string().min(1, `${GROWTH.REFERRAL.FORM.OWNER_NAME} là bắt buộc`),
  ownerRole: z.string().optional(),
  maxUses: z.string().optional(),
});

export type CreateReferralCodeFormData = z.infer<typeof createReferralCodeSchema>;
