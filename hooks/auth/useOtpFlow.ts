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

/**
 * `useOtpFlow` — channel-agnostic phone-OTP orchestrator (portal).
 *
 * Same shape as the web hook of the same name. Owns ZNS-vs-Firebase
 * branching so forms (`ForgotPasswordForm`, future settings flows)
 * never need to know about either provider directly.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ConfirmationResult } from 'firebase/auth';

import {
  PhoneOtpApiError,
  requestPhoneOtp,
  verifyPhoneOtp,
  type OtpChannel,
  type OtpPurpose,
} from '@/lib/api/phone-otp';
import {
  cleanup as cleanupFirebase,
  preloadAppCheck,
  sendOtp as firebaseSendOtp,
  setupRecaptcha,
  signOutFirebase,
  verifyOtpWithId,
  verifyOtp as verifyFirebaseConfirmation,
} from '@/lib/firebase/phone-auth';
import { getFirebaseErrorMessage } from '@/lib/firebase/errors';

export interface PhoneProof {
  phone: string;
  channel: OtpChannel;
  phoneVerificationToken?: string;
  firebaseIdToken?: string;
}

export type OtpFlowStep =
  | 'idle'
  | 'requesting'
  | 'awaitingZnsCode'
  | 'awaitingFirebaseCode'
  | 'verifying'
  | 'verified';

export interface UseOtpFlowOptions {
  recaptchaContainerId: string;
}

interface StartParams {
  phone: string;
  purpose: OtpPurpose;
  forceChannel?: OtpChannel;
  deviceId?: string;
}

/** E.164 normaliser — duplicated from the form-level helper. */
function toE164(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) return `+84${cleaned.slice(1)}`;
  if (cleaned.startsWith('84')) return `+${cleaned}`;
  return `+${cleaned}`;
}

export function useOtpFlow({ recaptchaContainerId }: UseOtpFlowOptions) {
  const [step, setStep] = useState<OtpFlowStep>('idle');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<OtpChannel | null>(null);
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [resendAvailableAt, setResendAvailableAt] = useState<Date | null>(null);
  const [proof, setProof] = useState<PhoneProof | null>(null);

  const verificationIdRef = useRef<string | null>(null);
  const firebaseConfirmationRef = useRef<ConfirmationResult | null>(null);
  const currentPhoneRef = useRef<string | null>(null);
  const currentPurposeRef = useRef<OtpPurpose | null>(null);

  useEffect(() => {
    void preloadAppCheck();
    return () => {
      cleanupFirebase();
    };
  }, []);

  const ensureRecaptcha = useCallback(async () => {
    await setupRecaptcha(recaptchaContainerId);
  }, [recaptchaContainerId]);

  const start = useCallback(
    async (
      params: StartParams,
    ): Promise<{ success: boolean; channel?: OtpChannel; error?: string }> => {
      setError(null);
      setProof(null);
      setStep('requesting');
      setLoading(true);

      const e164 = toE164(params.phone);
      currentPhoneRef.current = e164;
      currentPurposeRef.current = params.purpose;

      try {
        const res = await requestPhoneOtp({
          phone: e164,
          purpose: params.purpose,
          forceChannel: params.forceChannel,
          deviceId: params.deviceId,
        });
        setChannel(res.channel);
        setMaskedPhone(res.maskedPhone);
        setResendAvailableAt(res.resendAvailableAt);

        if (res.channel === 'ZNS') {
          verificationIdRef.current = res.verificationId;
          firebaseConfirmationRef.current = null;
          setStep('awaitingZnsCode');
          return { success: true, channel: 'ZNS' };
        }
        if (res.channel === 'FIREBASE_FALLBACK') {
          await ensureRecaptcha();
          const confirmation = await firebaseSendOtp(e164);
          firebaseConfirmationRef.current = confirmation;
          verificationIdRef.current = confirmation.verificationId;
          setStep('awaitingFirebaseCode');
          return { success: true, channel: 'FIREBASE_FALLBACK' };
        }

        setStep('idle');
        const msg = 'Kênh gửi OTP không hỗ trợ.';
        setError(msg);
        return { success: false, error: msg };
      } catch (err) {
        setStep('idle');
        const msg =
          err instanceof PhoneOtpApiError
            ? err.message
            : getFirebaseErrorMessage(err);
        setError(msg);
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [ensureRecaptcha],
  );

  const submitCode = useCallback(
    async (
      code: string,
    ): Promise<{ success: boolean; proof?: PhoneProof; error?: string }> => {
      setError(null);
      setLoading(true);
      setStep('verifying');

      try {
        if (channel === 'ZNS') {
          if (
            !verificationIdRef.current ||
            !currentPurposeRef.current ||
            !currentPhoneRef.current
          ) {
            const msg = 'Phiên xác thực ZNS không hợp lệ.';
            setError(msg);
            setStep('awaitingZnsCode');
            return { success: false, error: msg };
          }
          const r = await verifyPhoneOtp({
            verificationId: verificationIdRef.current,
            code,
            purpose: currentPurposeRef.current,
          });
          const newProof: PhoneProof = {
            phone: r.phone,
            channel: 'ZNS',
            phoneVerificationToken: r.phoneVerificationToken,
          };
          setProof(newProof);
          setStep('verified');
          return { success: true, proof: newProof };
        }

        if (channel === 'FIREBASE_FALLBACK') {
          let idToken: string;
          if (firebaseConfirmationRef.current) {
            idToken = await verifyFirebaseConfirmation(
              firebaseConfirmationRef.current,
              code,
            );
          } else if (verificationIdRef.current) {
            idToken = await verifyOtpWithId(verificationIdRef.current, code);
          } else {
            const msg = 'Phiên xác thực Firebase không hợp lệ.';
            setError(msg);
            setStep('awaitingFirebaseCode');
            return { success: false, error: msg };
          }
          const newProof: PhoneProof = {
            phone: currentPhoneRef.current ?? '',
            channel: 'FIREBASE_FALLBACK',
            firebaseIdToken: idToken,
          };
          setProof(newProof);
          setStep('verified');
          return { success: true, proof: newProof };
        }

        const msg = 'Không có phiên OTP đang hoạt động.';
        setError(msg);
        return { success: false, error: msg };
      } catch (err) {
        const msg =
          err instanceof PhoneOtpApiError
            ? err.message
            : getFirebaseErrorMessage(err);
        setError(msg);
        setStep(
          channel === 'FIREBASE_FALLBACK'
            ? 'awaitingFirebaseCode'
            : 'awaitingZnsCode',
        );
        return { success: false, error: msg };
      } finally {
        setLoading(false);
      }
    },
    [channel],
  );

  const resend = useCallback(async (): Promise<{
    success: boolean;
    channel?: OtpChannel;
    error?: string;
  }> => {
    if (!currentPhoneRef.current || !currentPurposeRef.current) {
      const msg = 'Không có thông tin OTP để gửi lại.';
      setError(msg);
      return { success: false, error: msg };
    }
    return start({
      phone: currentPhoneRef.current,
      purpose: currentPurposeRef.current,
    });
  }, [start]);

  const reset = useCallback(async () => {
    verificationIdRef.current = null;
    firebaseConfirmationRef.current = null;
    currentPhoneRef.current = null;
    currentPurposeRef.current = null;
    setStep('idle');
    setLoading(false);
    setError(null);
    setChannel(null);
    setMaskedPhone(null);
    setResendAvailableAt(null);
    if (proof?.channel === 'FIREBASE_FALLBACK') {
      await signOutFirebase();
    }
    setProof(null);
  }, [proof?.channel]);

  return {
    step,
    loading,
    error,
    channel,
    maskedPhone,
    resendAvailableAt,
    proof,
    start,
    submitCode,
    resend,
    reset,
  };
}
