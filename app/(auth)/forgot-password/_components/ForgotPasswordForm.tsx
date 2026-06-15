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

import { motion, AnimatePresence } from 'framer-motion';
import { Stepper } from '@/components/molecules/Stepper';
import { AUTH } from '@/lib/strings';
import {
  RECAPTCHA_CONTAINER_ID,
  STEP_INDEX,
  slideVariants,
  useForgotPasswordFlow,
} from '../_hooks/useForgotPasswordFlow';
import { ForgotPasswordPhoneStep } from './steps/ForgotPasswordPhoneStep';
import { ForgotPasswordOtpStep } from './steps/ForgotPasswordOtpStep';
import { ForgotPasswordPasswordStep } from './steps/ForgotPasswordPasswordStep';

const STEPPER_STEPS = [
  { label: AUTH.FORGOT_PASSWORD.STEP_PHONE },
  { label: AUTH.FORGOT_PASSWORD.STEP_OTP },
  { label: AUTH.FORGOT_PASSWORD.STEP_PASSWORD },
];

export function ForgotPasswordForm() {
  const flow = useForgotPasswordFlow();

  return (
    <div className="space-y-6">
      <div id={RECAPTCHA_CONTAINER_ID} />

      <Stepper
        steps={STEPPER_STEPS}
        currentStep={STEP_INDEX[flow.step]}
        className="justify-center"
      />

      <AnimatePresence mode="wait" custom={flow.direction}>
        <motion.div
          key={flow.step}
          custom={flow.direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {flow.step === 'phone' && <ForgotPasswordPhoneStep flow={flow} />}
          {flow.step === 'otp' && <ForgotPasswordOtpStep flow={flow} />}
          {flow.step === 'password' && (
            <ForgotPasswordPasswordStep flow={flow} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
