/**
 * Firebase Phone Auth — FALLBACK ONLY driver (portal).
 *
 * The primary OTP channel for the portal is Zalo Business Solutions
 * (ZNS). This module is reached only when the backend's
 * `requestPhoneOtp` returns `channel === 'FIREBASE_FALLBACK'`. Direct
 * invocation from forms is discouraged; prefer the orchestrator in
 * `hooks/auth/useOtpFlow.ts`.
 *
 * Improvements over the previous implementation:
 *  - re-entrant `setupRecaptcha` — earlier mounts call `cleanup()`
 *    first to avoid the Firebase "already rendered" error.
 *  - `verifyOtpWithId` for cross-page flows.
 *  - `signOutFirebase` to scrub residual sessions after success.
 *  - `preloadAppCheck` placeholder so the portal can lazy-add App
 *    Check without code churn in callers.
 */

import {
  RecaptchaVerifier,
  PhoneAuthProvider,
  signInWithCredential,
  signInWithPhoneNumber,
  signOut,
  type ConfirmationResult,
} from 'firebase/auth';
import { auth } from './config';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let recaptchaContainerId: string | null = null;
let setupPromise: Promise<void> | null = null;

/**
 * Placeholder for App Check preload. The portal may not currently
 * have App Check enabled, but callers can still invoke this on mount
 * so wiring App Check later requires zero call-site changes.
 */
export async function preloadAppCheck(): Promise<void> {
  // Intentionally empty — kept symmetric with the web client API.
}

/**
 * Set up an invisible reCAPTCHA verifier. Idempotent for the same
 * `containerId`; re-mount with a different ID will tear down the
 * existing verifier first.
 */
export async function setupRecaptcha(containerId: string): Promise<void> {
  if (recaptchaVerifier && recaptchaContainerId === containerId) return;
  if (setupPromise) return setupPromise;

  setupPromise = (async () => {
    try {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
        recaptchaContainerId = null;
      }

      const container = document.getElementById(containerId);
      if (!container) {
        throw new Error(`Recaptcha container not found: ${containerId}`);
      }

      // Wipe + create a fresh inner div so a remount doesn't trip the
      // "already been rendered in this element" guard.
      container.innerHTML = '';
      const innerId = `recaptcha-inner-${Date.now()}`;
      const innerDiv = document.createElement('div');
      innerDiv.id = innerId;
      container.appendChild(innerDiv);

      recaptchaVerifier = new RecaptchaVerifier(auth, innerId, {
        size: 'invisible',
      });
      await recaptchaVerifier.render();
      recaptchaContainerId = containerId;
    } finally {
      setupPromise = null;
    }
  })();

  return setupPromise;
}

/**
 * Send an OTP via Firebase Phone Auth (E.164 format).
 */
export async function sendOtp(
  phoneNumber: string,
): Promise<ConfirmationResult> {
  if (!recaptchaVerifier) {
    throw new Error(
      'RecaptchaVerifier not initialised — call setupRecaptcha first',
    );
  }
  return signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
}

/**
 * Verify with an in-memory `ConfirmationResult` (single-page flows).
 */
export async function verifyOtp(
  confirmationResult: ConfirmationResult,
  code: string,
): Promise<string> {
  const credential = await confirmationResult.confirm(code);
  return credential.user.getIdToken();
}

/**
 * Verify with a stored `verificationId` (cross-page flows).
 */
export async function verifyOtpWithId(
  verificationId: string,
  code: string,
): Promise<string> {
  const credential = PhoneAuthProvider.credential(verificationId, code);
  const result = await signInWithCredential(auth, credential);
  return result.user.getIdToken();
}

/**
 * Sign out the residual Firebase user after the backend mutation
 * succeeds. Prevents a stale ID token from leaking into the next flow
 * on the same browser tab.
 */
export async function signOutFirebase(): Promise<void> {
  try {
    if (auth.currentUser) {
      await signOut(auth);
    }
  } catch {
    // Best-effort — don't surface to the user.
  }
}

/**
 * Tear down the reCAPTCHA verifier (call on unmount).
 */
export function cleanup(): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
    recaptchaContainerId = null;
    setupPromise = null;
  }
}
