import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from './config';

let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Set up an invisible reCAPTCHA verifier.
 * Must be called once before sendOtp — attaches to a DOM element.
 */
export function setupRecaptcha(containerId: string): void {
  if (recaptchaVerifier) return;

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
  });
}

/**
 * Send an OTP to the given phone number (E.164 format, e.g. +84987654321).
 * Returns a ConfirmationResult used to verify the code later.
 */
export async function sendOtp(
  phoneNumber: string,
): Promise<ConfirmationResult> {
  if (!recaptchaVerifier) {
    throw new Error('RecaptchaVerifier not initialised — call setupRecaptcha first');
  }

  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

/**
 * Verify the 6-digit OTP code and return the Firebase ID token.
 */
export async function verifyOtp(
  confirmationResult: ConfirmationResult,
  code: string,
): Promise<string> {
  const credential = await confirmationResult.confirm(code);
  const idToken = await credential.user.getIdToken();
  return idToken;
}

/**
 * Tear down the reCAPTCHA verifier (call on unmount).
 */
export function cleanup(): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
}
