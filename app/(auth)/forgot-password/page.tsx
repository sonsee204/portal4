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

import { Suspense } from 'react';
import { ForgotPasswordForm } from './_components/ForgotPasswordForm';
import { AUTH } from '@/lib/strings';

export default function ForgotPasswordPage() {
  return (
    <>
      {/* Title — visible on lg where brand panel hides the logo area */}
      <div className="mb-6 hidden text-center lg:block">
        <h2 className="text-heading text-xl font-bold">
          {AUTH.FORGOT_PASSWORD.TITLE}
        </h2>
        <p className="mt-1 text-sm text-faint">
          {AUTH.FORGOT_PASSWORD.SUBTITLE}
        </p>
      </div>

      {/* Title for mobile — below the logo rendered by layout */}
      <div className="mb-6 text-center lg:hidden">
        <p className="text-sm text-faint">{AUTH.FORGOT_PASSWORD.SUBTITLE}</p>
      </div>

      <Suspense fallback={null}>
        <ForgotPasswordForm />
      </Suspense>
    </>
  );
}
