/**
 * Validation constants shared across portal forms
 */

export const PASSWORD_MIN_LENGTH = 6;
export const OTP_LENGTH = 6;
export const FULLNAME_MIN_LENGTH = 3;

/** Vietnamese phone: 0xxx or +84xxx (9-10 digits after prefix) */
export const PHONE_REGEX = /^(\+84|0)[0-9]{9,10}$/;

/** Basic email validation */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
